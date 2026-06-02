-- ADA Law Society content publishing schema
-- Future Supabase setup. This file is not connected to the local preview yet.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'public'
    check (role in ('public', 'als_team', 'editor', 'admin')),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  category text,
  tags text[] not null default '{}',
  cover_image text,
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'published')),
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  published_at timestamp with time zone
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  category text,
  cover_image text,
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'published')),
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  published_at timestamp with time zone
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  author_name text not null,
  body text not null,
  status text not null default 'public'
    check (status in ('pending', 'public', 'hidden')),
  created_at timestamp with time zone not null default now()
);

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'public'
  );
$$;

create or replace function public.is_content_role()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() in ('als_team', 'editor', 'admin');
$$;

create or replace function public.is_publisher_role()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() in ('editor', 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.news enable row level security;
alter table public.comments enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.current_user_role() = 'admin');

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "admins_update_roles"
on public.profiles
for update
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "published_articles_are_public"
on public.articles
for select
using (status = 'published');

create policy "authors_and_publishers_can_read_unpublished_articles"
on public.articles
for select
using (auth.uid() = author_id or public.is_publisher_role());

create policy "content_roles_create_articles"
on public.articles
for insert
with check (
  auth.uid() = author_id
  and public.is_content_role()
  and (
    public.is_publisher_role()
    or status in ('draft', 'pending')
  )
);

create policy "authors_update_own_draft_or_pending_articles"
on public.articles
for update
using (auth.uid() = author_id and status in ('draft', 'pending'))
with check (auth.uid() = author_id and status in ('draft', 'pending'));

create policy "editors_and_admins_publish_articles"
on public.articles
for update
using (public.is_publisher_role())
with check (public.is_publisher_role());

create policy "published_news_is_public"
on public.news
for select
using (status = 'published');

create policy "authors_and_publishers_can_read_unpublished_news"
on public.news
for select
using (auth.uid() = author_id or public.is_publisher_role());

create policy "content_roles_create_news"
on public.news
for insert
with check (
  auth.uid() = author_id
  and public.is_content_role()
  and (
    public.is_publisher_role()
    or status in ('draft', 'pending')
  )
);

create policy "authors_update_own_draft_or_pending_news"
on public.news
for update
using (auth.uid() = author_id and status in ('draft', 'pending'))
with check (auth.uid() = author_id and status in ('draft', 'pending'));

create policy "editors_and_admins_publish_news"
on public.news
for update
using (public.is_publisher_role())
with check (public.is_publisher_role());

create policy "public_comments_are_readable"
on public.comments
for select
using (status = 'public');

create policy "anyone_can_create_public_comments"
on public.comments
for insert
with check (status = 'public');

create policy "editors_and_admins_moderate_comments"
on public.comments
for update
using (public.is_publisher_role())
with check (public.is_publisher_role());
