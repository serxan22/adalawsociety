export type ArticleCategory = "Legal Education" | "Human Rights" | "Research" | "Student Advocacy";

export type Citation = {
  label: string;
  source: string;
  url?: string;
};

export type Article = {
  slug: string;
  title: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  date: string;
  category: ArticleCategory;
  tags: string[];
  readingTime: number;
  summary: string;
  excerpt: string;
  coverImage: string;
  likes: number;
  saves: number;
  citations: Citation[];
  content: string[];
};

export const articleCategories: ArticleCategory[] = [
  "Legal Education",
  "Human Rights",
  "Research",
  "Student Advocacy",
];

export const articles: Article[] = [
  {
    slug: "role-of-moot-courts-in-legal-education",
    title: "The Role of Moot Courts in Legal Education",
    author: {
      name: "ALS Blog Placeholder Author",
      role: "Placeholder author",
      image: "/images/placeholders/team-editor.jpg",
    },
    date: "2026-04-06",
    category: "Legal Education",
    tags: ["Moot Court", "Advocacy", "Legal Skills"],
    readingTime: 7,
    summary:
      "Moot courts bridge doctrine and practice by requiring students to research issues, write structured submissions, and defend arguments orally under pressure.",
    excerpt:
      "Why moot courts remain one of the strongest training tools for students who want to understand law as both analysis and advocacy.",
    coverImage: "/images/placeholders/blog-1.jpg",
    likes: 84,
    saves: 31,
    citations: [
      {
        label: "Jessup Competition Guide",
        source: "International Law Students Association",
        url: "https://www.ilsa.org/",
      },
      {
        label: "Legal Education and Experiential Learning",
        source: "Clinical Legal Education literature",
      },
    ],
    content: [
      "Moot court exercises force students to move from abstract knowledge to disciplined legal performance. The task is not only to know the rule, but to identify the strongest issue, frame it accurately, and defend a position before questions begin to reshape the argument.",
      "The written stage teaches structure. A memorial rewards clarity, source control, hierarchy, and restraint. It also exposes weak reasoning quickly because unsupported claims cannot survive the discipline of citation and counterargument.",
      "The oral stage teaches judgment. Students learn to answer directly, concede carefully, and return to the legal theory of the case without sounding rehearsed. That pressure is valuable because real legal work rarely arrives in ideal conditions.",
      "For ALS, moot court is also a community project. Senior students can mentor newer participants, editors can support research, and competition coordinators can build a culture where preparation is respected as much as performance.",
    ],
  },
  {
    slug: "freedom-of-expression-and-student-debate-culture",
    title: "Freedom of Expression and Student Debate Culture",
    author: {
      name: "ALS Blog Placeholder Author",
      role: "Placeholder author",
      image: "/images/placeholders/team-debate.jpg",
    },
    date: "2026-03-20",
    category: "Human Rights",
    tags: ["Expression", "Debate", "Campus Culture"],
    readingTime: 6,
    summary:
      "A serious debate culture depends on freedom of expression, but also on structure, good faith, and a shared commitment to reasoned disagreement.",
    excerpt:
      "A campus debate community can protect strong speech while expecting students to argue with evidence and respect.",
    coverImage: "/images/placeholders/blog-2.jpg",
    likes: 62,
    saves: 19,
    citations: [
      {
        label: "Article 10",
        source: "European Convention on Human Rights",
        url: "https://www.echr.coe.int/",
      },
      {
        label: "Campus debate and civic education",
        source: "Comparative student affairs research",
      },
    ],
    content: [
      "Student debate is often treated as performance, but its deeper value is civic discipline. A debate setting asks participants to listen carefully, distinguish emotion from argument, and answer the strongest version of the opposing position.",
      "Freedom of expression matters because meaningful disagreement cannot exist if students fear exploring unpopular or difficult ideas. At the same time, a productive debate culture requires rules that protect the integrity of the exchange.",
      "The best debate formats do not reward volume. They reward evidence, responsiveness, organization, and intellectual honesty. Those habits are central to legal education because law itself is an organized argument about authority, facts, and values.",
      "ALS debate activities can help students become more comfortable with disagreement while keeping discussion serious, humane, and grounded.",
    ],
  },
  {
    slug: "introduction-to-legal-research-for-law-students",
    title: "Introduction to Legal Research for Law Students",
    author: {
      name: "ALS Blog Placeholder Author",
      role: "Placeholder author",
      image: "/images/placeholders/team-research.jpg",
    },
    date: "2026-02-28",
    category: "Research",
    tags: ["Research", "Writing", "Methodology"],
    readingTime: 8,
    summary:
      "Legal research begins with a precise question, then moves through authority, jurisdiction, hierarchy, relevance, and careful citation.",
    excerpt:
      "A practical starting framework for students preparing blog articles, moot court memorials, or academic essays.",
    coverImage: "/images/placeholders/blog-3.jpg",
    likes: 101,
    saves: 44,
    citations: [
      {
        label: "Legal research methods",
        source: "Comparative legal methodology texts",
      },
      {
        label: "Citation and source hierarchy",
        source: "Academic legal writing manuals",
      },
    ],
    content: [
      "The first step in legal research is not opening every source available. It is defining the question. A vague question produces a vague search, while a precise question makes it possible to decide what authority matters.",
      "Students should ask whether the issue concerns domestic law, comparative law, international law, or a policy argument. Each category changes the sources that deserve priority and the weight those sources can carry.",
      "A strong research process moves from primary authority to commentary, not the other way around. Secondary sources can explain the field, but they should not replace statutes, cases, treaties, or official materials where those are relevant.",
      "For student writing, research also includes source hygiene. Keep notes with full citation details, mark uncertainty, and separate your own analysis from the language of the source. That discipline prevents confusion during editing.",
    ],
  },
  {
    slug: "student-led-legal-communities-and-professional-growth",
    title: "Student-Led Legal Communities and Professional Growth",
    author: {
      name: "ALS Blog Placeholder Author",
      role: "Placeholder author",
      image: "/images/placeholders/team-project.jpg",
    },
    date: "2025-12-16",
    category: "Student Advocacy",
    tags: ["Leadership", "Community", "Professional Growth"],
    readingTime: 5,
    summary:
      "A student-led legal society creates low-risk opportunities to practice leadership, professional communication, event planning, and peer learning.",
    excerpt:
      "Legal education becomes richer when students build institutions for one another and take responsibility for shared academic culture.",
    coverImage: "/images/placeholders/blog-4.jpg",
    likes: 47,
    saves: 16,
    citations: [
      {
        label: "Student engagement and leadership",
        source: "Higher education leadership studies",
      },
    ],
    content: [
      "Student organizations are not extracurricular decoration. At their best, they are small institutions where students learn responsibility, cooperation, and professional communication.",
      "A legal society has a special role because law is social. Students need spaces where they can test arguments, organize events, edit writing, invite speakers, and learn how institutions operate.",
      "The student-led model matters because it gives members ownership. Instead of only consuming opportunities, students create them for peers. That habit is close to the professional responsibility expected in legal practice.",
    ],
  },
];
