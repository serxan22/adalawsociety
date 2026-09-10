-- Persistent Gallery and ALS Team photos for the existing editorial CMS.
-- Additive migration: it neither deletes content nor changes historical team records.
begin;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null check (length(trim(image_url)) > 0),
  caption text not null default '',
  alt_text text not null check (length(trim(alt_text)) > 0),
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  legacy_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);
create index if not exists gallery_items_public_idx
  on public.gallery_items(status, sort_order, created_at, id);

create table if not exists public.team_member_photos (
  member_key text primary key check (length(trim(member_key)) > 0),
  image_url text not null check (length(trim(image_url)) > 0),
  updated_at timestamptz not null default now(),
  updated_by text
);

create or replace function public.touch_public_media_record()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end $$;

drop trigger if exists cms_touch_gallery_items on public.gallery_items;
create trigger cms_touch_gallery_items before update on public.gallery_items
for each row execute function public.touch_public_media_record();
drop trigger if exists cms_touch_team_member_photos on public.team_member_photos;
create trigger cms_touch_team_member_photos before update on public.team_member_photos
for each row execute function public.touch_public_media_record();

alter table public.gallery_items enable row level security;
alter table public.team_member_photos enable row level security;
grant select on public.gallery_items, public.team_member_photos to anon, authenticated;
grant insert, update, delete on public.gallery_items, public.team_member_photos to authenticated;

drop policy if exists cms_gallery_admin on public.gallery_items;
drop policy if exists cms_gallery_public on public.gallery_items;
create policy cms_gallery_admin on public.gallery_items for all to authenticated
using (public.is_als_cms_admin()) with check (public.is_als_cms_admin());
create policy cms_gallery_public on public.gallery_items for select
using (status = 'published');

drop policy if exists cms_team_photos_admin on public.team_member_photos;
drop policy if exists cms_team_photos_public on public.team_member_photos;
create policy cms_team_photos_admin on public.team_member_photos for all to authenticated
using (public.is_als_cms_admin()) with check (public.is_als_cms_admin());
create policy cms_team_photos_public on public.team_member_photos for select using (true);

-- Gives public filters only author/category values attached to a visible publication.
create or replace function public.public_editorial_choices(p_kind text)
returns table(category_id uuid, category_name text, author_id uuid, author_name text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if p_kind = 'article' then
    return query
      select distinct c.id, c.name, a.id, a.full_name
      from public.articles p
      join public.categories c on c.id = p.category_id
      join public.authors a on a.id = p.author_profile_id
      where p.status = 'published' and p.published_at <= now();
  elsif p_kind = 'news' then
    return query
      select distinct c.id, c.name, a.id, a.full_name
      from public.news p
      join public.categories c on c.id = p.category_id
      join public.authors a on a.id = p.author_profile_id
      where p.status = 'published' and p.published_at <= now();
  else
    raise exception 'Invalid content kind' using errcode = '22023';
  end if;
end $$;
revoke all on function public.public_editorial_choices(text) from public;
grant execute on function public.public_editorial_choices(text) to anon, authenticated;

-- Keep the private editorial bucket private. A file becomes readable only while
-- referenced by a public post, published gallery item, or a known team record.
create or replace function public.editorial_media_is_public(media_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.articles p
    where p.status='published' and p.published_at <= now() and (
      p.cover_image = '/api/editorial/media/' || media_id or
      p.seo_image = '/api/editorial/media/' || media_id or
      p.content_json::text like '%/api/editorial/media/' || media_id || '%' or
      exists(select 1 from public.authors a where a.id=p.author_profile_id and a.avatar_url='/api/editorial/media/' || media_id)
    )
  ) or exists (
    select 1 from public.news p
    where p.status='published' and p.published_at <= now() and (
      p.cover_image = '/api/editorial/media/' || media_id or
      p.seo_image = '/api/editorial/media/' || media_id or
      p.content_json::text like '%/api/editorial/media/' || media_id || '%' or
      exists(select 1 from public.authors a where a.id=p.author_profile_id and a.avatar_url='/api/editorial/media/' || media_id)
    )
  ) or exists (
    select 1 from public.gallery_items g
    where g.status='published' and
      g.image_url='/api/editorial/media/' || media_id
  ) or exists (
    select 1 from public.team_member_photos t
    where t.image_url='/api/editorial/media/' || media_id
  );
$$;
revoke all on function public.editorial_media_is_public(uuid) from public;
grant execute on function public.editorial_media_is_public(uuid) to anon, authenticated;

commit;
