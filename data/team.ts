export type TeamYearId = "2023-2024" | "2024-2025" | "2025-2026";

export type TeamGroup = "Board" | "Event Committee" | "Marketing Committee" | "Blog Committee";

export type TeamHighlight = {
  title: string;
  text: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  focusAreas: string[];
  isPlaceholder: boolean;
  priority: number;
};

export type TeamYear = {
  year: TeamYearId;
  title: string;
  intro: string;
  yearStory: string;
  highlights: TeamHighlight[];
  members: TeamMember[];
};

type TeamMemberInput = {
  name: string;
  role: string;
  group: TeamGroup;
};

const archiveYears: TeamYearId[] = ["2023-2024", "2024-2025", "2025-2026"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function roleFocusAreas(role: string, group: TeamGroup) {
  const lowerRole = role.toLowerCase();
  const areas = new Set<string>();

  if (group === "Board") {
    areas.add("Leadership");
  }

  if (group === "Event Committee") {
    areas.add("Event");
    areas.add("Student Community");
  }

  if (group === "Marketing Committee") {
    areas.add("Marketing");
  }

  if (group === "Blog Committee") {
    areas.add("Blog");
    areas.add("Editorial");
  }

  if (lowerRole.includes("president")) areas.add("Leadership");
  if (lowerRole.includes("vice")) areas.add("Administration");
  if (lowerRole.includes("secretary")) areas.add("Administration");
  if (lowerRole.includes("treasurer")) areas.add("Finance");
  if (lowerRole.includes("editor-in-chief")) areas.add("Editorial");
  if (lowerRole.includes("event")) areas.add("Event");
  if (lowerRole.includes("logistic")) areas.add("Administration");
  if (lowerRole.includes("moot court")) areas.add("Moot Court");
  if (lowerRole.includes("debate")) areas.add("Debate");
  if (lowerRole.includes("content")) areas.add("Marketing");
  if (lowerRole.includes("graphic") || lowerRole.includes("video")) areas.add("Design");
  if (lowerRole.includes("interviewer")) areas.add("Interviewing");
  if (lowerRole.includes("web")) areas.add("Web");
  if (lowerRole.includes("organizer")) areas.add("Student Community");

  return Array.from(areas).slice(0, 4);
}

function roleBio(role: string, group: TeamGroup) {
  const lowerRole = role.toLowerCase();

  if (lowerRole === "president") {
    return "Leads ALS board coordination and supports the society's student-led legal community.";
  }

  if (lowerRole === "vice president") {
    return "Supports board coordination, member communication, and administrative follow-through for ALS activities.";
  }

  if (lowerRole === "event manager") {
    return "Coordinates ALS event planning and helps align programs with academic and professional goals.";
  }

  if (lowerRole === "marketing manager") {
    return "Guides ALS communication, content direction, and public-facing visibility.";
  }

  if (lowerRole === "editor-in-chief") {
    return "Supports the ALS blog and editorial process through legal writing, review, and publication coordination.";
  }

  if (lowerRole === "secretary") {
    return "Supports documentation, scheduling, and administrative continuity for ALS.";
  }

  if (lowerRole === "treasurer") {
    return "Supports budgeting, finance tracking, and responsible resource coordination for ALS.";
  }

  if (lowerRole.includes("moot court")) {
    return "Supports moot court activity through training coordination, preparation, and competition-focused organization.";
  }

  if (lowerRole.includes("debate")) {
    return "Supports ALS debate activity through argumentation practice, format coordination, and student engagement.";
  }

  if (lowerRole.includes("event organizer")) {
    return "Supports ALS student community activity through event organization and coordination.";
  }

  if (lowerRole.includes("event planner")) {
    return "Supports ALS activities through event planning, program preparation, and coordination.";
  }

  if (lowerRole.includes("logistic")) {
    return "Supports event logistics, operational readiness, and smooth coordination for ALS programming.";
  }

  if (lowerRole.includes("volunteer")) {
    return "Supports ALS activities through hands-on assistance and team coordination.";
  }

  if (lowerRole.includes("content")) {
    return "Supports ALS public communication through content planning and student-facing updates.";
  }

  if (lowerRole.includes("graphic")) {
    return "Supports ALS visual communication through design assets and branded materials.";
  }

  if (lowerRole.includes("video")) {
    return "Supports ALS media work through video editing and visual storytelling.";
  }

  if (lowerRole.includes("interviewer")) {
    return "Supports ALS storytelling and outreach through interview preparation and communication work.";
  }

  if (lowerRole.includes("web")) {
    return "Supports ALS digital presence and website-related coordination.";
  }

  if (lowerRole.includes("blog editor")) {
    return "Supports ALS legal writing through blog editing, review, and editorial coordination.";
  }

  if (group === "Board") {
    return "Supports ALS board work through leadership, administration, and society coordination.";
  }

  return "Supports ALS activities through committee work and student-led coordination.";
}

function makeMembers(year: TeamYearId, members: TeamMemberInput[]) {
  return members.map((member, index) => ({
    id: `${year}-${slugify(member.name)}-${slugify(member.role)}`,
    name: member.name,
    role: member.role,
    group: member.group,
    bio: roleBio(member.role, member.group),
    image: "",
    focusAreas: roleFocusAreas(member.role, member.group),
    isPlaceholder: false,
    priority: index + 1,
  }));
}

const team2024Members: TeamMemberInput[] = [
  { name: "Muslum Mammadov", role: "President", group: "Board" },
  { name: "Murad Iskandar", role: "Vice President", group: "Board" },
  { name: "Aytaj Shahmarova", role: "Event Manager", group: "Board" },
  { name: "Vatan Mammadova", role: "Marketing Manager", group: "Board" },
  { name: "Nilufar Taghiyeva", role: "Editor-in-Chief", group: "Board" },
  { name: "Hayat Namazova", role: "Secretary", group: "Board" },
  { name: "Jalala Hajiyeva", role: "Treasurer", group: "Board" },
  { name: "Asim Zulfugarli", role: "Event Planner", group: "Event Committee" },
  { name: "Tajira Maharramova", role: "Event Planner", group: "Event Committee" },
  { name: "Hafiz Baylarli", role: "Logistic Coordinator", group: "Event Committee" },
  { name: "Gular Mammadova", role: "Debate Specialist", group: "Event Committee" },
  { name: "Aysel Salimova", role: "Debate Organizer", group: "Event Committee" },
  { name: "Salman Huseynov", role: "Debate Organizer", group: "Event Committee" },
  { name: "Ramzi Samadov", role: "Volunteer", group: "Event Committee" },
  { name: "Arzu Mirzayeva", role: "Content Creator", group: "Marketing Committee" },
  { name: "Samira Sharifova", role: "Graphic Designer", group: "Marketing Committee" },
  { name: "Zivar Naghizada", role: "Interviewer", group: "Marketing Committee" },
  { name: "Ayan Yusibli", role: "Blog Editor", group: "Blog Committee" },
  { name: "Maleyka Salamzada", role: "Blog Editor", group: "Blog Committee" },
];

const team2023Members: TeamMemberInput[] = [
  { name: "Afsan Kazimov", role: "President", group: "Board" },
  { name: "Nilgun Mammadova", role: "Vice President", group: "Board" },
  { name: "Khatin Osmanli", role: "Secretary", group: "Board" },
  { name: "Fidan Tahirzada", role: "Marketing Manager", group: "Marketing Committee" },
  { name: "Ofeliya Ahmadzada", role: "Blog Editor", group: "Blog Committee" },
  { name: "Murad Iskandar", role: "Event Organizer", group: "Event Committee" },
  { name: "Muslum Mammadov", role: "Event Organizer", group: "Event Committee" },
  { name: "Nilufar Taghiyeva", role: "Event Organizer", group: "Event Committee" },
  { name: "Rashid Vakilov", role: "Graphic Designer", group: "Marketing Committee" },
];

const team2025Members: TeamMemberInput[] = [
  { name: "Murad Iskandar", role: "President", group: "Board" },
  { name: "Aysel Salimova", role: "Vice President", group: "Board" },
  { name: "Nilufar Taghiyeva", role: "Event Manager", group: "Board" },
  { name: "Arzu Mirzayeva", role: "Marketing Manager", group: "Board" },
  { name: "Gulnar Ismayilli", role: "Editor-in-Chief", group: "Board" },
  { name: "Zivar Naghizada", role: "Secretary", group: "Board" },
  { name: "Aytaj Zeynalova", role: "Treasurer", group: "Board" },
  { name: "Aydan Mehdiyeva", role: "Moot Court Organizer", group: "Event Committee" },
  { name: "Salman Huseynov", role: "Moot Court Organizer", group: "Event Committee" },
  { name: "Gadir Safarli", role: "Moot Court Specialist", group: "Event Committee" },
  { name: "Hafiz Baylarli", role: "Event Planner", group: "Event Committee" },
  { name: "Zakiyya Huseynova", role: "Event Planner", group: "Event Committee" },
  {
    name: "Nigar Oruj",
    role: "Event Planner for Career Purposes",
    group: "Event Committee",
  },
  { name: "Nihad Mukhtarli", role: "Debate Specialist", group: "Event Committee" },
  { name: "Maleyka Salamzada", role: "Debate Organizer", group: "Event Committee" },
  { name: "Nurana Abdullayeva", role: "Debate Organizer", group: "Event Committee" },
  { name: "Alima Aliyeva", role: "Volunteer", group: "Event Committee" },
  { name: "Zahra Gasimli", role: "Content Creator", group: "Marketing Committee" },
  { name: "Yagub Rzayev", role: "Graphic Designer", group: "Marketing Committee" },
  { name: "Malahat Mammadzada", role: "Graphic Designer", group: "Marketing Committee" },
  { name: "Aytan Novruzlu", role: "Video Editor", group: "Marketing Committee" },
  { name: "Banovsha Abbasova", role: "Interviewer", group: "Marketing Committee" },
  { name: "Lachin Hajiyeva", role: "Web-master", group: "Marketing Committee" },
  { name: "Shola Namazova", role: "Blog Editor", group: "Blog Committee" },
  { name: "Subhan Rasulzada", role: "Blog Editor", group: "Blog Committee" },
];

export const teamYears: TeamYear[] = [
  {
    year: "2025-2026",
    title: "ALS Team 2025-2026",
    intro:
      "Meet the current ALS student leaders coordinating board work, events, marketing, and blog activity for the 2025-2026 term.",
    yearStory:
      "The 2025-2026 team represents the current ALS leadership structure, with named board members and committees supporting events, moot court and debate activity, marketing, web presence, interviewing, and legal writing.",
    highlights: [
      {
        title: "Focus of the term",
        text: "Current leadership for the 2025-2026 ALS term across board, event, marketing, and blog committees.",
      },
      {
        title: "Team structure",
        text: "Board, Event Committee, Marketing Committee, and Blog Committee with roles provided by ALS.",
      },
      {
        title: "Main activity areas",
        text: "Event planning, moot court and debate support, legal writing, marketing, design, interviewing, web, finance, and administration.",
      },
      {
        title: "Archive note",
        text: "Names and roles are provided. Photos and personal profile links can be added after official confirmation.",
      },
    ],
    members: makeMembers("2025-2026", team2025Members),
  },
  {
    year: "2024-2025",
    title: "ALS Team 2024-2025",
    intro:
      "A previous leadership archive for the ALS board and committees serving during the 2024-2025 term.",
    yearStory:
      "The 2024-2025 archive preserves the provided ALS leadership and committee structure for the previous term, keeping the public record clear while leaving photos and profile links ready for future official additions.",
    highlights: [
      {
        title: "Focus of the term",
        text: "Previous leadership archive for ALS board, event, marketing, and blog committee roles.",
      },
      {
        title: "Team structure",
        text: "Board, Event Committee, Marketing Committee, and Blog Committee organized as an official archive.",
      },
      {
        title: "Main activity areas",
        text: "Events, debate activity, logistics, marketing, design, interviewing, blog editing, finance, and administration.",
      },
      {
        title: "Archive note",
        text: "Names and roles are provided. Photos and personal profile links can be added after official confirmation.",
      },
    ],
    members: makeMembers("2024-2025", team2024Members),
  },
  {
    year: "2023-2024",
    title: "ALS Team 2023-2024",
    intro:
      "A leadership archive for the ALS board and student committees serving during the 2023-2024 term.",
    yearStory:
      "The 2023-2024 archive records the provided ALS leadership, marketing and design, blog editorial, and events roles for the term while keeping photos and profile links ready for future official additions.",
    highlights: [
      {
        title: "Focus of the term",
        text: "Previous leadership archive for ALS board, marketing and design, blog editorial, and events roles.",
      },
      {
        title: "Team structure",
        text: "Board leadership supported by marketing and design, blog editorial, and events contributors.",
      },
      {
        title: "Main activity areas",
        text: "Leadership, administration, marketing, design, blog editing, editorial support, events, and student community work.",
      },
      {
        title: "Archive note",
        text: "Names and roles are provided. Photos and personal profile links can be added after official confirmation.",
      },
    ],
    members: makeMembers("2023-2024", team2023Members),
  },
];

export const teamArchiveYears = archiveYears;

export function getTeamYear(year: string) {
  return teamYears.find((team) => team.year === year);
}
