export type CompetitionSlug = "debate" | "moot-court";

export type Competition = {
  slug: CompetitionSlug;
  label: string;
  title: string;
  intro: string;
  image: string;
  pillars: string[];
  upcoming: Array<{
    title: string;
    date?: string;
    description: string;
  }>;
  highlights: string[];
  format: string[];
  cultureNote?: string;
};

export const competitions: Competition[] = [
  {
    slug: "debate",
    label: "Debate",
    title: "Debate at ADA Law Society",
    intro:
      "Debate activities create a platform for argumentation, legal reasoning, public speaking, and civic discussion.",
    image: "/images/placeholders/debate.jpg",
    pillars: [
      "Evidence-led argumentation",
      "Respectful cross-questioning",
      "Legal and civic themes",
      "Feedback from peers and mentors",
    ],
    upcoming: [],
    highlights: [
      "Debates help students learn how to make claims, support them with reasons, and answer counterarguments.",
      "Legal debate culture strengthens confidence, listening, public speaking, and respectful disagreement.",
      "Debate formats can interest both law students and students from other majors who want to examine legal and civic questions.",
    ],
    format: [
      "Teams receive a motion and prepare opening claims, rebuttals, and closing remarks.",
      "Judging focuses on relevance, evidence, structure, responsiveness, and delivery.",
      "Moderators keep discussion rigorous, respectful, and accessible to non-law students.",
    ],
  },
  {
    slug: "moot-court",
    label: "Moot Court",
    title: "Moot Court at ADA Law Society",
    intro:
      "Moot courts are simulated court proceedings where students practice memorial writing, oral advocacy, legal research, teamwork, and disciplined legal analysis.",
    image: "/images/placeholders/moot-court.jpg",
    pillars: [
      "Legal research and issue spotting",
      "Memorial drafting",
      "Oral advocacy",
      "Competition readiness",
    ],
    upcoming: [],
    highlights: [
      "Moot court training develops legal research, written advocacy, oral submissions, and teamwork.",
      "Students learn to identify issues, structure memorials, anticipate judicial questions, and respond with clarity.",
      "ADA University has a broader moot court culture, including Jessup and Topchubashov-related moot activity in its legal ecosystem.",
    ],
    format: [
      "Students analyze a hypothetical dispute and prepare arguments for both sides.",
      "Written memorials are reviewed for legal structure, citation, and clarity.",
      "Oral rounds simulate judicial questioning and reward direct, disciplined answers.",
    ],
    cultureNote:
      "This page describes moot court as an ALS activity area and ADA Law learning format. It does not claim ALS organized any specific external moot competition unless a verified source is added.",
  },
];

export function getCompetition(slug: string) {
  return competitions.find((competition) => competition.slug === slug);
}
