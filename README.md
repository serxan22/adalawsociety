# ADA Law Society

Professional multilingual website for ADA Law Society, a student-led law society at ADA University.

Public facts currently used in the site:

- ADA Law Society was founded in September 2019.
- It is the first and main student organization for law students at ADA University.
- It is based at ADA University in Baku.
- Public handle: `@adalawsociety`.
- Public email: `lawsociety@ada.edu.az`.
- Slogan: `Your Gateway to the Legal World`.

Do not add achievements, events, members, statistics, or competition results unless they are verified by ALS or a public source.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- lucide-react icons
- Framer Motion animations
- Lenis smooth scrolling
- Auth and roles ready architecture for future Supabase Auth/RLS

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## ALS Logo

Place the official PNG logo here:

```text
public/images/als-logo.png
```

The header and footer automatically use that file. If it is missing, the site shows a clean legal-scale fallback mark.

## Replace Images

Team, event, blog, competition, and gallery images are referenced from:

```text
public/images/placeholders/
```

Examples:

```text
public/images/placeholders/event-1.jpg
public/images/placeholders/blog-1.jpg
public/images/placeholders/team-placeholder-1.jpg
```

Missing images do not break the UI. The `FallbackImage` component renders a branded ADA Law Society visual block until real files are added.

## Edit Public Content

Public content is structured for a future CMS or Supabase database:

```text
data/news.ts
data/articles.ts
data/team.ts
data/competitions.ts
data/socials.ts
```

Current news items are based on public ALS listings where possible. Detail text is intentionally cautious and should be replaced with official copy only after ALS confirms it.

Team entries are placeholders. Replace `To be confirmed` only with verified ALS member names, roles, photos, and links.

Blog article examples use placeholder authors. Before publishing real articles, each article must include:

```ts
summary: string
citations: Citation[]
content: string[]
author
date
tags
category
```

## Authorization Model

This project currently implements Option B: an Auth & Roles Ready frontend preview.

It does not implement production authentication yet. Do not rely on frontend-only hiding of buttons for real security.

Local role preview lives here:

```text
data/current-user.ts
```

Change the mock user to test states:

- `authenticated: false`: login required
- `role: "public"`: no publishing permission
- `role: "als_team"`: can create drafts and pending submissions
- `role: "editor"`: can create and publish
- `role: "admin"`: can create, publish, and manage future roles

Role helpers live here:

```text
lib/auth/roles.ts
```

Helpers:

```ts
canCreateContent(role)
canEditContent(userId, authorId, role)
canPublish(role)
```

Dashboard preview routes:

```text
/dashboard
/dashboard/articles
/dashboard/news
/dashboard/articles/new
/dashboard/news/new
```

## Recommended Supabase Setup

Future Supabase schema and RLS policies are documented here:

```text
supabase/migrations/001_roles_content.sql
```

Recommended production approach:

- Use Supabase Auth for login.
- Create a `profiles` row for every allowed ALS user.
- Assign roles only from `public`, `als_team`, `editor`, `admin`.
- Enforce permissions through Supabase RLS and server-side code.
- Use server actions or API routes for content mutations.
- Never trust frontend button visibility as the only permission layer.

Allowed ALS team members should be configured by creating/updating `profiles` rows after identity is verified by ALS leadership.

## Internationalization

Main UI labels and page copy use simple dictionary files:

```text
dictionaries/en.ts
dictionaries/az.ts
dictionaries/ru.ts
```

The language switcher stores the selected language in `localStorage`.

## Key Routes

```text
/
/about
/news
/news/[slug]
/team/2023-2024
/team/2024-2025
/team/2025-2026
/blog
/blog/[slug]
/competitions/debate
/competitions/moot-court
/dashboard
/dashboard/articles
/dashboard/news
/dashboard/articles/new
/dashboard/news/new
/blog-policy
/privacy-policy
/terms
/contact
```

## Deploy on Vercel

This project was updated locally only. Deployment was not run.

When ready:

```bash
npm install
npm run build
```

Then import the repository into Vercel and use the default Next.js settings:

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
