export type NewsCategory = "Events" | "Announcements" | "Achievements" | "Collaborations";

export type NewsItem = {
  slug: string;
  title: string;
  category: NewsCategory;
  date: string;
  excerpt: string;
  image: string;
  content: string[];
  sourceUrl?: string;
};

export const newsCategories: NewsCategory[] = [
  "Events",
  "Announcements",
  "Achievements",
  "Collaborations",
];

export const newsItems: NewsItem[] = [
  {
    slug: "bdu-ada-law-society-legal-discussion-forum",
    title:
      "BDU Law Faculty Student Scientific Society and ADA Law Society begin cooperation within the Legal Discussion Forum",
    category: "Collaborations",
    date: "2026-03-26",
    excerpt:
      "A public ALS news listing announces cooperation with BDU Law Faculty Student Scientific Society within the Legal Discussion Forum.",
    image: "/images/placeholders/event-1.jpg",
    sourceUrl: "https://www.adalawsociety.com/az/news",
    content: [
      "This item is based on the public ADA Law Society news page, which lists cooperation between BDU Law Faculty Student Scientific Society and ADA Law Society within the Legal Discussion Forum.",
      "Additional article body, speakers, agenda, and photos should be added only after ALS confirms the official details.",
    ],
  },
  {
    slug: "als-introduces-2024-2025-members",
    title: "The ADA Law Society proudly introduces its members for the 2024/2025 term",
    category: "Announcements",
    date: "2024-08-13",
    excerpt:
      "A public ALS news listing announces the introduction of ADA Law Society members for the 2024/2025 term.",
    image: "/images/placeholders/event-2.jpg",
    sourceUrl: "https://www.adalawsociety.com/en/news",
    content: [
      "This item is based on the public ADA Law Society news page, which lists the introduction of members for the 2024/2025 term.",
      "The member directory on this website should be completed with verified names, roles, and photos before publication.",
    ],
  },
  {
    slug: "ada-law-society-law-blog-launch",
    title: "The ADA Law Society is proud to launch its brand-new Law Blog",
    category: "Announcements",
    date: "2024-09-09",
    excerpt:
      "The public ALS news page lists the launch of the ADA Law Society Law Blog.",
    image: "/images/placeholders/event-3.jpg",
    sourceUrl: "https://www.adalawsociety.com/en/news",
    content: [
      "This public listing supports the website's dedicated blog area and the summary-first article workflow prepared in this project.",
      "Future posts should be created only by authorized ALS team members through a real authentication and role-checking system.",
    ],
  },
  {
    slug: "a-successful-start",
    title: "A Successful Start!",
    category: "Events",
    date: "2024-09-24",
    excerpt:
      "A public ADA Law Society news item titled “A Successful Start!” is listed on the current ALS website.",
    image: "/images/placeholders/event-4.jpg",
    sourceUrl: "https://www.adalawsociety.com/en/news",
    content: [
      "This item is retained as a verified public news listing from the ADA Law Society website.",
      "Replace this placeholder detail text with the official article content when ALS provides it.",
    ],
  },
  {
    slug: "jurisquizdence",
    title: "Jurisquizdence",
    category: "Events",
    date: "2024-10-05",
    excerpt:
      "The public ADA Law Society news page lists “Jurisquizdence” among society updates.",
    image: "/images/placeholders/event-5.jpg",
    sourceUrl: "https://www.adalawsociety.com/en/news",
    content: [
      "This item is retained as a verified public news listing from the ADA Law Society website.",
      "Event description, rules, participants, and results should be added only after ALS confirms the details.",
    ],
  },
  {
    slug: "online-information-session-about-als-blog",
    title: "Online information session about ADA Law Society Blog",
    category: "Announcements",
    date: "2025-10-19",
    excerpt:
      "The public ADA Law Society news page lists an online information session about the ALS Blog.",
    image: "/images/placeholders/event-6.jpg",
    sourceUrl: "https://www.adalawsociety.com/az/news",
    content: [
      "This item is based on the public ADA Law Society news page, which lists an online information session about the ADA Law Society Blog.",
      "The full session summary should be added after ALS confirms the official details.",
    ],
  },
];
