-- Additive provenance for the one-time official archive import.
-- Filename version matches the applied target migration history.
-- Existing post/author records, policies, workflows, and publication dates are untouched.
begin;
alter table public.articles
 add column if not exists legacy_source_id text,
 add column if not exists legacy_source_url text,
 add column if not exists legacy_source_urls text[] not null default '{}',
 add column if not exists original_language text,
 add column if not exists imported_at timestamptz,
 add column if not exists legacy_body_hash text;
alter table public.authors add column if not exists legacy_author_key text;
create unique index if not exists articles_legacy_source_id_unique on public.articles(legacy_source_id) where legacy_source_id is not null;
create unique index if not exists articles_legacy_source_url_unique on public.articles(legacy_source_url) where legacy_source_url is not null;
create unique index if not exists authors_legacy_author_key_unique on public.authors(legacy_author_key) where legacy_author_key is not null;
comment on column public.articles.legacy_source_id is 'Official archive identity: adalawsociety.com/blogs/<numeric source ID>. Never deduplicate by title.';
comment on column public.authors.legacy_author_key is 'Source site plus SHA-256 of the exact credited display name. No transliteration or Team identity merging.';
commit;
