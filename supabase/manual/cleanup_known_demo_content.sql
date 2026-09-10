-- MANUAL REVIEW ONLY: do not run without production data approval.
-- Archives only the exact demo slugs formerly bundled with the repository.
begin;
update public.articles set status='unpublished'
where slug in (
 'role-of-moot-courts-in-legal-education',
 'freedom-of-expression-and-student-debate-culture',
 'introduction-to-legal-research-for-law-students',
 'student-led-legal-communities-and-professional-growth'
);
update public.news set status='unpublished'
where slug in (
 'bdu-ada-law-society-legal-discussion-forum',
 'als-introduces-2024-2025-members',
 'ada-law-society-law-blog-launch',
 'a-successful-start',
 'jurisquizdence',
 'online-information-session-about-als-blog'
);

-- The exact placeholder author label was never an official author identity.
update public.articles set author_profile_id=null
where slug in (
 'role-of-moot-courts-in-legal-education',
 'freedom-of-expression-and-student-debate-culture',
 'introduction-to-legal-research-for-law-students',
 'student-led-legal-communities-and-professional-growth'
) and author_profile_id in (select id from public.authors where full_name='ALS Blog Placeholder Author');
delete from public.authors a
where a.full_name='ALS Blog Placeholder Author'
  and not exists(select 1 from public.articles p where p.author_profile_id=a.id)
  and not exists(select 1 from public.news p where p.author_profile_id=a.id);

-- Remove only exact obsolete inline overrides. Genuine uploaded Gallery media is excluded.
delete from public.content where
 (key='home.team.text' and value='This section is prepared for verified ALS team information. Placeholder profiles should be replaced only with confirmed member details.')
 or (key='competitions.noEventsTitle' and value='No verified upcoming events listed yet')
	 or (key='competitions.noEventsText' and value='Add upcoming debate or moot court dates here only after ALS confirms them through its official channels.')
	 or (key='contact.linkPending' and value='Link pending')
	 or (key='blog.submissionGuidelines' and value='Submission Guidelines')
	 or (key='blog.documentComingSoon' and value='Document coming soon after official confirmation.')
	 or (key='competitions.documentComingSoon' and value='Document coming soon')
	 or (key='competitions.draftExampleEyebrow' and value='Legislative drafting')
	 or (key='competitions.draftExampleTitle' and value='Best Legislative Draft Example')
	 or (key='competitions.draftExampleText' and value='This space is prepared for a strong sample law draft once ALS provides the official document.')
	 or (key='competitions.viewExample' and value='View Example')
	 or (key='competitions.verificationNoteLabel' and value='Verification note: ')
	 or (key='gallery.intro' and value='A living record of debates, moot courts, talks, and community moments from ADA Law Society.')
	 or (key='gallery.image.1' and value='/images/placeholders/gallery-1.jpg')
	 or (key='gallery.image.2' and value='/images/placeholders/gallery-2.jpg')
	 or (key='gallery.image.3' and value='/images/placeholders/gallery-3.jpg')
	 or (key='gallery.image.4' and value='/images/placeholders/gallery-4.jpg')
	 or (key='gallery.image.5' and value='/images/placeholders/event-1.jpg')
	 or (key='gallery.image.6' and value='/images/placeholders/event-2.jpg')
	 or (key='gallery.image.7' and value='/images/placeholders/event-3.jpg')
	 or (key='gallery.image.8' and value='/images/placeholders/event-4.jpg')
	 or (key='gallery.image.9' and value='/images/placeholders/event-5.jpg')
	 or (key='gallery.image.10' and value='/images/placeholders/event-6.jpg')
	 or (key='gallery.caption.1' and value='Moot Court Finals Night')
	 or (key='gallery.caption.2' and value='Legal Talks Series')
	 or (key='gallery.caption.3' and value='Debate Championship')
	 or (key='gallery.caption.4' and value='Academic Excursion')
	 or (key='gallery.caption.5' and value='Orientation Week')
	 or (key='gallery.caption.6' and value='Blog Editorial Meeting')
	 or (key='gallery.caption.7' and value='Guest Lecture')
	 or (key='gallery.caption.8' and value='Team Building Retreat')
	 or (key='gallery.caption.9' and value='Networking Night')
	 or (key='gallery.caption.10' and value='Graduation Ceremony');
commit;
