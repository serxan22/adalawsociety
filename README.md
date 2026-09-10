# ADA Law Society

Multilingual public website and protected editorial CMS for ADA Law Society at ADA University.

## Local development

Create `.env.local` with the existing Supabase project credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service-role key is used only by server modules and must never be exposed with a `NEXT_PUBLIC_` prefix.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production checks:

```bash
npm run test:cms
npx tsc --noEmit
npm run lint
npm run build
```

## Public content

News and Blog publications are loaded only from Supabase. The arrays in `data/news.ts` and `data/articles.ts` are intentionally empty and are not fallback publication sources. When the database contains no published records, the public pages show localized empty states and the homepage hides its featured publication sections.

Only records with `status = 'published'` and a non-future `published_at` are public. Draft and unpublished records remain available only to authorized editors. Blog Authors are managed separately from ALS Team members and are never created automatically from the team directory.

The ALS Team identities, year-specific roles, and committee assignments remain in `data/team.ts`. Team profile photos are separate persisted references keyed to each exact historical record.

The only configured public social destination is maintained in `data/socials.ts`. Entries without a genuine URL should not be added.

## Editorial administration

The existing Supabase email/password session and `public.admins` allowlist protect the CMS. Both `admin` and `superadmin` roles may manage editorial content; admin access management remains restricted to `superadmin`.

```text
/admin                 Overview
/admin/blog            Blog publications
/admin/news            News publications
/admin/authors         Blog/news authors
/admin/categories      Categories
/admin/tags            Tags
/admin/gallery         Gallery
/admin/team            ALS Team profile photos
/admin/users           Admin allowlist (superadmin only)
```

Server route guards and Supabase RLS enforce authorization. Hiding a button is never treated as a security boundary.

## Supabase migrations

Apply migrations in order to the intended Supabase project after reviewing them:

1. `supabase/migrations/003_editorial_cms.sql` installs the editorial schema, validation, RLS, private `editorial-images` storage bucket, and publishing functions. It requires the existing `public.admins` allowlist.
2. `supabase/migrations/004_gallery_team_media.sql` additively installs persisted Gallery records, year-specific Team photo references, public editorial filter choices, and media visibility checks.

Migration `004` does not delete publications, Gallery files, Team records, or stored media. The repository test suite applies `003` and `004` to an isolated PGlite database and verifies public/draft boundaries and non-admin write blocking.

`supabase/manual/cleanup_known_demo_content.sql` is a review-only cleanup script. It targets only the exact former example slugs and exact retired inline-content values. Do not run it against production without inspecting the matching rows and approving the operation. It unpublishes matching example posts rather than deleting them and does not target the genuine uploaded HEIC Gallery file.

## Gallery and media

New Gallery images and Team portraits use the private `editorial-images` bucket through authenticated application routes. Uploads are validated as JPEG, PNG, or WebP and limited to 5 MB in both the browser and server handler. Storage paths use generated UUIDs.

The existing genuine HEIC Gallery upload remains in the original public `site-images` bucket. The original file is never removed or rewritten. Because browser HEIC support is inconsistent, `/api/gallery/legacy/[key]` reads that exact stored object and returns an in-memory JPEG preview. Once migration `004` is applied, an editor can add accurate alt text/caption, replace the visible image, reorder it, or unpublish it while the source HEIC remains preserved.

Deleting a Gallery record or Team photo reference intentionally does not immediately delete its storage object, preventing accidental removal of media that may still be referenced elsewhere.

## Branding and translations

The ALS logo is stored at `public/images/als-logo.png`; App Router favicon copies remain at `app/icon.png` and `app/apple-icon.png`.

Primary UI translations live in:

```text
dictionaries/en.ts
dictionaries/az.ts
dictionaries/ru.ts
```

The selected language is persisted in the browser. Keep equivalent visitor-facing empty and error states in all three dictionaries when adding new public UI.

## Deployment

No deployment is performed by local development commands. Before a release, review pending migrations and environment variables, run all checks above, and deploy through the repository's existing GitHub/Vercel workflow only after explicit approval.
