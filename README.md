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

## One-time official Blog archive migration

The public website never scrapes the legacy site at request time. `scripts/migrate-official-blog.ts` is an operator-run migration into the existing `articles`, `authors`, `categories`, and private editorial media architecture.

Review `supabase/migrations/20260914164400_official_blog_archive.sql` before applying it to another environment. It has already been applied to the authorized target project, and its version matches that project's migration history. This additive migration only adds provenance fields and partial unique indexes; it does not change existing content or RLS.

```bash
npx playwright install chromium
npm run migrate:blogs -- --dry-run
npm run migrate:blogs -- --import --target-project lgzdsgsuicyxplclqpux
npx tsx scripts/verify-official-blog.ts
```

Both `/en/blogs` and `/az/blogs` are crawled, including rendered/lazy entries and pagination. Locale copies are merged only when their source ID, normalized metadata, and structured body hashes agree. Different source IDs remain separate. Authors use the exact published spelling; similar transliterations are never merged and no Team member is automatically made an Author.

The source has no explicit categories, so imported articles use the neutral **Legal Articles** category. Author biography, position, avatar, tags, and article images stay empty unless explicitly present in the source. Calendar dates are retained on the original day at 00:00 UTC because the source supplies no publication time. Bibliographies remain in the body even when reliably parsed into citations.

Reports are written to `reports/official-blog/`. Reports, source HTML snapshots, resumable checkpoints in `.cache/official-blog/`, and Supabase CLI temporary files are git-ignored and must not be committed. `--resume` reuses that validated source snapshot after an interruption. Every existing legacy ID/URL match is skipped, never overwritten or automatically republished; source drift is reported for manual review. Without `--resume`, source pages are fetched again. Redirect mappings are report-only and are not activated while both websites coexist.

After import, `npx tsx scripts/verify-official-blog.ts` checks the local production build without writing to Supabase. It requires the local import report and validated source snapshots. After an explicitly authorized release, `BLOG_REVIEW_URL=https://adalawsociety-phi.vercel.app npx tsx scripts/verify-official-blog.ts --production` repeats the read-only checks against the existing public deployment. Verification reports and screenshots remain local and git-ignored.

Import uses the configured server-only service-role credential, requires an explicit matching project ref, checks schema/storage first, validates every source record before writing any publication, and verifies anonymous visibility afterwards. It never deletes target content or imports engagement counts. A rerun cannot duplicate legacy articles or Authors.

The default rerun never updates posts. Optional `--complete-references` can only fill an empty citations field on a pristine import whose source hash, title, summary, and full rich text still match, with `updated_by IS NULL` and insert timestamps within one second (the existing insert trigger uses a separate clock timestamp). Every normal CMS edit sets `updated_by`, so edited posts are excluded. Compare-and-set timestamp and editor guards protect concurrent editing. It cannot overwrite nonempty citations or an edited post. This was used once to recognize the source's additional Azerbaijani reference-heading variant; all original reference text also remains in the body.

`scripts/verify-official-blog.ts` requires a running local server (prefer `npm run build` then `npm run start`) and a successful local `import.json` report, or the explicit production-review flag above. It performs read-only checks of all imported public URLs, full rendered body text, editor-schema round trips, filters, pagination, language persistence, unauthorized access, Gallery viewing, Team records, and browser layouts at 375/768/1440 px. It does not log in or alter publications. Authenticated editor actions still need a separate authorized review; do not use published test records to test them.

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
