-- ALS Blog/News CMS. Standalone upgrade; safe when 001 was never installed.
-- Requires the existing public.admins allowlist. Run in Supabase SQL Editor.
begin;
create extension if not exists pgcrypto;

create or replace function public.is_als_cms_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
 select auth.uid() is not null and exists (
   select 1 from public.admins a
   where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
     and a.role in ('admin', 'superadmin')
     and (to_jsonb(a)->>'uid' is null or to_jsonb(a)->>'uid' = auth.uid()::text)
 );
$$;
create or replace function public.is_als_cms_owner()
returns boolean language sql stable security definer set search_path = ''
as $$
 select auth.uid() is not null and exists (
   select 1 from public.admins a
   where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
     and a.role = 'superadmin'
     and (to_jsonb(a)->>'uid' is null or to_jsonb(a)->>'uid' = auth.uid()::text)
 );
$$;
revoke all on function public.is_als_cms_admin() from public;
revoke all on function public.is_als_cms_owner() from public;
grant execute on function public.is_als_cms_admin(), public.is_als_cms_owner() to anon, authenticated;

-- Protect the existing allowlist against direct client role escalation.
alter table public.admins enable row level security;
drop policy if exists cms_admin_read on public.admins;
create policy cms_admin_read on public.admins for select to authenticated
using (lower(email) = lower(auth.jwt()->>'email') or public.is_als_cms_owner());
drop policy if exists cms_admin_write_guard on public.admins;
drop policy if exists cms_admin_insert_guard on public.admins;
drop policy if exists cms_admin_update_guard on public.admins;
drop policy if exists cms_admin_delete_guard on public.admins;
create policy cms_admin_insert_guard on public.admins as restrictive for insert to authenticated with check (public.is_als_cms_owner());
create policy cms_admin_update_guard on public.admins as restrictive for update to authenticated using (public.is_als_cms_owner()) with check (public.is_als_cms_owner());
create policy cms_admin_delete_guard on public.admins as restrictive for delete to authenticated using (public.is_als_cms_owner());

create table if not exists public.articles (
 id uuid primary key default gen_random_uuid(),
 title text not null, slug text not null unique,
 summary text not null default '', content text not null default '',
 citations jsonb not null default '[]', category text, tags text[] not null default '{}',
 cover_image text, status text not null default 'draft',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz
);
create table if not exists public.news (
 id uuid primary key default gen_random_uuid(),
 title text not null, slug text not null unique, excerpt text not null default '',
 content text not null default '', category text, cover_image text, status text not null default 'draft',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz
);
create table if not exists public.authors (
 id uuid primary key default gen_random_uuid(), full_name text not null check (length(trim(full_name)) > 0),
 avatar_url text, bio text, position text, social_links jsonb not null default '{}',
 user_id uuid unique references auth.users(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.categories (
 id uuid primary key default gen_random_uuid(), name text not null check (length(trim(name)) > 0),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), description text, image_url text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.tags (
 id uuid primary key default gen_random_uuid(), name text not null check (length(trim(name)) > 0),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

do $$
declare tbl text;
begin
 foreach tbl in array array['articles', 'news'] loop
  execute format('alter table public.%I
   add column if not exists excerpt text not null default '''',
   add column if not exists summary text not null default '''',
   add column if not exists citations jsonb not null default ''[]'',
   add column if not exists content_json jsonb,
   add column if not exists author_profile_id uuid references public.authors(id) on delete restrict,
   add column if not exists category_id uuid references public.categories(id) on delete restrict,
   add column if not exists seo_title text,
   add column if not exists seo_description text,
   add column if not exists seo_keywords text[] not null default ''{}'',
   add column if not exists canonical_url text,
   add column if not exists seo_image text,
   add column if not exists updated_by text', tbl);
  execute format('alter table public.%I drop constraint if exists %I', tbl, tbl || '_status_check');
  execute format('update public.%I set status = ''draft'' where status = ''pending''', tbl);
  execute format('alter table public.%I add constraint %I check (status in (''draft'',''published'',''unpublished''))', tbl, tbl || '_status_check');
  execute format('create index if not exists %I on public.%I(status, published_at desc, id)', tbl || '_cms_public_idx', tbl);
  execute format('create index if not exists %I on public.%I(created_at desc, id)', tbl || '_cms_created_idx', tbl);
  execute format('create index if not exists %I on public.%I(author_profile_id)', tbl || '_cms_author_idx', tbl);
  execute format('create index if not exists %I on public.%I(category_id)', tbl || '_cms_category_idx', tbl);
 end loop;
end $$;

create table if not exists public.article_tags (
 article_id uuid references public.articles(id) on delete cascade,
 tag_id uuid references public.tags(id) on delete cascade, primary key(article_id, tag_id)
);
create table if not exists public.news_tags (
 news_id uuid references public.news(id) on delete cascade,
 tag_id uuid references public.tags(id) on delete cascade, primary key(news_id, tag_id)
);
create index if not exists article_tags_tag_idx on public.article_tags(tag_id);
create index if not exists news_tags_tag_idx on public.news_tags(tag_id);

create or replace function public.validate_editorial_post()
returns trigger language plpgsql set search_path = '' as $$
begin
 if length(trim(new.title)) = 0 or length(new.title) > 240 or new.slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(new.slug) > 120 then
  raise exception 'Invalid title or slug' using errcode = '23514';
 end if;
 if tg_op = 'UPDATE' and old.published_at is not null then
  if new.slug <> old.slug then
   raise exception 'A previously published URL cannot be changed' using errcode = '23514';
  end if;
  -- Retain publication history even after unpublishing, so URL protection cannot be reset.
  new.published_at := coalesce(new.published_at, old.published_at);
 end if;
 if new.status = 'published' then
  if tg_table_name = 'articles' and length(trim(new.summary)) = 0 then
   raise exception 'Blog publication requires an abstract' using errcode = '23514';
  end if;
  if new.author_profile_id is null or new.category_id is null or length(trim(new.content)) = 0 or
     length(trim(new.excerpt)) = 0 or jsonb_typeof(new.content_json) is distinct from 'object' or
     new.content_json->>'type' is distinct from 'doc' or jsonb_typeof(new.content_json->'content') is distinct from 'array' then
   raise exception 'Publishing requires an author, category, excerpt and article content' using errcode = '23514';
  end if;
  new.published_at := coalesce(new.published_at, now());
  if new.published_at > now() then raise exception 'Future publication is not supported' using errcode = '23514'; end if;
 end if;
 new.updated_at := clock_timestamp();
 return new;
end $$;
drop trigger if exists cms_validate_articles on public.articles;
create trigger cms_validate_articles before insert or update on public.articles for each row execute function public.validate_editorial_post();
drop trigger if exists cms_validate_news on public.news;
create trigger cms_validate_news before insert or update on public.news for each row execute function public.validate_editorial_post();

-- Replace the superseded profile-role policies only on the editorial content tables.
do $$
declare tbl text; pol record;
begin
 foreach tbl in array array['articles','news','authors','categories','tags','article_tags','news_tags'] loop
  execute format('alter table public.%I enable row level security', tbl);
  for pol in select policyname from pg_policies where schemaname = 'public' and tablename = tbl loop
   execute format('drop policy %I on public.%I', pol.policyname, tbl);
  end loop;
  execute format('create policy cms_admin_manage on public.%I for all to authenticated using (public.is_als_cms_admin()) with check (public.is_als_cms_admin())', tbl);
  execute format('grant select on public.%I to anon, authenticated', tbl);
  execute format('grant insert, update, delete on public.%I to authenticated', tbl);
 end loop;
end $$;
create policy cms_public_read on public.articles for select using (status = 'published' and published_at <= now());
create policy cms_public_read on public.news for select using (status = 'published' and published_at <= now());
create policy cms_public_read on public.authors for select using (
 exists(select 1 from public.articles where author_profile_id = authors.id and status = 'published')
 or exists(select 1 from public.news where author_profile_id = authors.id and status = 'published')
);
create policy cms_public_read on public.categories for select using (true);
create policy cms_public_read on public.article_tags for select using (exists(select 1 from public.articles where id = article_id and status = 'published'));
create policy cms_public_read on public.news_tags for select using (exists(select 1 from public.news where id = news_id and status = 'published'));
create policy cms_public_read on public.tags for select using (
 exists(select 1 from public.article_tags where tag_id = tags.id)
 or exists(select 1 from public.news_tags where tag_id = tags.id)
);

-- One transaction saves a post and all tag relations; concurrent edits fail explicitly.
create or replace function public.save_editorial_post(p_kind text, p_id uuid, p_data jsonb, p_tags uuid[], p_expected timestamptz default null)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
 tbl text; junction text; fk text; post_id uuid := coalesce(p_id, gen_random_uuid());
 previous timestamptz; cols text := 'title,slug,summary,excerpt,content,content_json,citations,cover_image,author_profile_id,category_id,status,published_at,seo_title,seo_description,seo_keywords,canonical_url,seo_image,updated_by';
begin
 if not public.is_als_cms_admin() then raise exception 'Not authorized' using errcode = '42501'; end if;
 if p_kind not in ('article','news') then raise exception 'Invalid content kind'; end if;
 tbl := case when p_kind = 'article' then 'articles' else 'news' end;
 junction := case when p_kind = 'article' then 'article_tags' else 'news_tags' end;
 fk := case when p_kind = 'article' then 'article_id' else 'news_id' end;
 if p_id is not null then
  execute format('select updated_at from public.%I where id=$1 for update', tbl) into previous using post_id;
  if previous is null then raise exception 'Post not found' using errcode = 'P0002'; end if;
  if p_expected is null or previous <> p_expected then raise exception 'This post changed in another session. Reload before saving.' using errcode = '40001'; end if;
  execute format('update public.%I set (%s) = (select %s from jsonb_populate_record(null::public.%I,$1)) where id=$2',tbl,cols,cols,tbl) using p_data,post_id;
 else
  execute format('insert into public.%I (id,%s) select $2,%s from jsonb_populate_record(null::public.%I,$1)',tbl,cols,cols,tbl) using p_data,post_id;
 end if;
 execute format('delete from public.%I where %I=$1',junction,fk) using post_id;
 execute format('insert into public.%I (%I,tag_id) select $1,x from unnest($2::uuid[]) x on conflict do nothing',junction,fk) using post_id,p_tags;
 return post_id;
end $$;
revoke all on function public.save_editorial_post(text,uuid,jsonb,uuid[],timestamptz) from public;
grant execute on function public.save_editorial_post(text,uuid,jsonb,uuid[],timestamptz) to authenticated;

-- Private editorial images are delivered through the site's permission-checked media route.
create table if not exists public.editorial_media (
 id uuid primary key default gen_random_uuid(), path text not null unique,
 mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
 size integer not null check (size > 0 and size <= 5242880),
 created_at timestamptz not null default now()
);
alter table public.editorial_media enable row level security;
grant select on public.editorial_media to anon, authenticated;
grant insert, delete on public.editorial_media to authenticated;
create or replace function public.editorial_media_is_public(media_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists (
 select 1 from public.articles p where p.status='published' and p.published_at <= now() and (
 p.cover_image = '/api/editorial/media/' || media_id or p.seo_image = '/api/editorial/media/' || media_id
 or p.content_json::text like '%/api/editorial/media/' || media_id || '%'
 or exists(select 1 from public.authors a where a.id = p.author_profile_id and a.avatar_url = '/api/editorial/media/' || media_id))
 ) or exists (
 select 1 from public.news p where p.status='published' and p.published_at <= now() and (
 p.cover_image = '/api/editorial/media/' || media_id or p.seo_image = '/api/editorial/media/' || media_id
 or p.content_json::text like '%/api/editorial/media/' || media_id || '%'
 or exists(select 1 from public.authors a where a.id = p.author_profile_id and a.avatar_url = '/api/editorial/media/' || media_id))
 );
$$;
revoke all on function public.editorial_media_is_public(uuid) from public;
grant execute on function public.editorial_media_is_public(uuid) to anon, authenticated;
drop policy if exists cms_media_admin on public.editorial_media;
drop policy if exists cms_media_public on public.editorial_media;
create policy cms_media_admin on public.editorial_media for all to authenticated using(public.is_als_cms_admin()) with check(public.is_als_cms_admin());
create policy cms_media_public on public.editorial_media for select using(public.editorial_media_is_public(id));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('editorial-images','editorial-images',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
drop policy if exists cms_storage_admin on storage.objects;
drop policy if exists cms_storage_read on storage.objects;
create policy cms_storage_admin on storage.objects for all to authenticated
using(bucket_id='editorial-images' and public.is_als_cms_admin())
with check(bucket_id='editorial-images' and public.is_als_cms_admin());
create policy cms_storage_read on storage.objects for select
using(bucket_id='editorial-images' and exists(select 1 from public.editorial_media m where m.path=name and public.editorial_media_is_public(m.id)));
commit;
