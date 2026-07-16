-- Inline CMS content store for superadmin page editing
-- Run this manually in the Supabase SQL editor (not linked to local preview yet).

create table if not exists public.content (
  key text primary key,
  value text not null default '',
  type text not null default 'text',
  updated_at timestamp with time zone not null default now(),
  updated_by text
);

alter table public.content disable row level security;

insert into public.content (key, value, type)
values
  ('hero.title', 'Your Gateway to the Legal World', 'text'),
  ('hero.subtitle', 'Founded in September 2019, ADA Law Society is the first and main student organization for law students at ADA University.', 'text'),
  ('hero.image', '/images/hero-courtroom.jpg', 'image'),

  ('home.about.title', 'Where legal curiosity becomes legal confidence', 'text'),
  ('home.about.text', 'ALS brings together students interested in advocacy, legal research, debates, moot courts, legal writing, and professional development. Its mission is to create a rigorous, collaborative, and practical legal environment beyond the classroom.', 'text'),
  ('home.about.image', '/images/placeholders/about-als.jpg', 'image'),
  ('home.students.title', 'By Students, For Future Lawyers', 'text'),
  ('home.students.text', 'ALS is built around the idea that legal education becomes stronger when students create serious spaces for discussion, writing, advocacy, and professional growth.', 'text'),

  ('about.eyebrow', 'About ADA Law Society', 'text'),
  ('about.title', 'A professional home for legal ambition at ADA University', 'text'),
  ('about.body', 'Established in September 2019, ADA Law Society is the first and main student organization for law students at ADA University.', 'text'),
  ('about.image', '/images/placeholders/about-page.jpg', 'image'),
  ('about.story.eyebrow', 'Our Story', 'text'),
  ('about.story.title', 'Founded in 2019 to make legal education more active, practical, and collaborative', 'text'),
  ('about.story.text', 'ALS gives law students a serious student-led platform for legal writing, advocacy, debate, research, professional development, and dialogue with the wider university community.', 'text'),
  ('about.mission', 'To organize extra-curricular legal activities that extend students'' knowledge, improve student life on campus, and create a rigorous legal environment beyond the classroom.', 'text'),
  ('about.vision', 'To be a credible student-led legal community where advocacy, legal writing, debate, research, and professional development grow together.', 'text'),
  ('about.history', 'ALS was founded in September 2019 to bring law students together around lectures, talks, legal discussions, academic excursions, moot court activities, and a more productive student life on campus.', 'text'),
  ('about.cta.text', 'Contact ALS about membership, collaborations, legal writing, academic events, debate, moot court training, or professional development opportunities.', 'text'),

  ('contact.title', 'Connect with ADA Law Society', 'text'),
  ('contact.intro', 'Send a message about partnerships, membership, blog submissions, competitions, or upcoming legal events.', 'text'),
  ('contact.email', 'lawsociety@ada.edu.az', 'text'),
  ('contact.location', 'ADA University, Baku, Azerbaijan', 'text'),

  ('news.title', 'Newsroom', 'text'),
  ('news.intro', 'Verified public ALS updates, cooperation announcements, and society news.', 'text'),
  ('blog.title', 'Legal Insights Library', 'text'),
  ('blog.intro', 'Student legal writing with summaries, citations, and editorial review.', 'text'),

  ('team.archive.title', 'ADA Law Society Team Archive', 'text'),
  ('team.archive.intro', 'A public record of ALS leadership periods, early board members, and recent student-led committees.', 'text'),
  ('team.archive.early.eyebrow', 'Early Leadership Records', 'text'),
  ('team.archive.early.title', 'ALS Team 2019-2023', 'text'),
  ('team.archive.early.text', 'Names and roles below are listed exactly from the provided ALS team records.', 'text'),
  ('team.archive.recent.eyebrow', 'Recent Leadership Gallery', 'text'),
  ('team.archive.recent.title', 'Browse Recent Team Years', 'text')
on conflict (key) do nothing;
