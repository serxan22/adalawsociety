"use client";

import { motion, type Variants } from "framer-motion";
import {
  Archive,
  BookOpenText,
  CalendarDays,
  Megaphone,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/site/Reveal";
import { TeamCard } from "@/components/team/TeamCard";
import { Badge } from "@/components/ui/badge";
import type { TeamGroup, TeamMember, TeamYear } from "@/data/team";
import { getTeamYear, teamArchiveYears } from "@/data/team";
import { cn } from "@/lib/utils";

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function sortMembers(members: TeamMember[]) {
  return [...members].sort((a, b) => a.priority - b.priority);
}

function getPresident(members: TeamMember[]) {
  const sortedMembers = sortMembers(members);

  return (
    sortedMembers.find((member) => member.role.toLowerCase().includes("president")) ??
    sortedMembers[0]
  );
}

function memberGridClass(count: number) {
  if (count <= 1) return "mx-auto max-w-md grid-cols-1";
  if (count === 2) return "mx-auto max-w-4xl sm:grid-cols-2";

  return "sm:grid-cols-2 xl:grid-cols-3";
}

export function TeamYearPage({ team }: { team: TeamYear }) {
  const { t } = useI18n();
  const president = getPresident(team.members);
  const membersWithoutPresident = president
    ? team.members.filter((member) => member.id !== president.id)
    : team.members;

  const memberSectionTemplates: Array<{
    title: string;
    description: string;
    groups: TeamGroup[];
    icon: ReactNode;
  }> = [
    {
      title: t.team.boardGroupTitle,
      description: t.team.boardGroupDescription,
      groups: ["Board"],
      icon: <UsersRound className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: t.team.eventCommitteeGroupTitle,
      description: t.team.eventCommitteeGroupDescription,
      groups: ["Event Committee"],
      icon: <CalendarDays className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: t.team.marketingCommitteeGroupTitle,
      description: t.team.marketingCommitteeGroupDescription,
      groups: ["Marketing Committee"],
      icon: <Megaphone className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: t.team.blogCommitteeGroupTitle,
      description: t.team.blogCommitteeGroupDescription,
      groups: ["Blog Committee"],
      icon: <BookOpenText className="h-5 w-5" aria-hidden="true" />,
    },
  ];

  const memberSections = memberSectionTemplates
    .map((section) => ({
      ...section,
      members: sortMembers(
        membersWithoutPresident.filter((member) => section.groups.includes(member.group)),
      ),
    }))
    .filter((section) => section.members.length > 0);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-als-line bg-[radial-gradient(circle_at_18%_18%,rgba(174,72,94,0.12),transparent_23rem),radial-gradient(circle_at_82%_10%,rgba(63,96,118,0.08),transparent_25rem),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-14 text-center md:py-16">
        <div className="absolute inset-0 legal-pattern opacity-[0.12]" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 rounded-full border border-als-red/15"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full border border-als-blue/10"
          aria-hidden="true"
        />

        <div className="container-wide relative">
          <Reveal className="mx-auto max-w-5xl">
            <Badge className="mx-auto gap-2 px-4 py-2">
              <Archive className="h-4 w-4" aria-hidden="true" />
              {t.team.leadershipArchive}
            </Badge>
            <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-normal text-als-blue md:text-6xl">
              {team.title}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-als-muted md:text-lg">
              {team.intro}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <nav
              aria-label={t.team.archiveNavigation}
              className="mx-auto mt-8 flex max-w-fit gap-2 overflow-x-auto rounded-full border border-als-line bg-white/86 p-2 shadow-sm backdrop-blur"
            >
              {teamArchiveYears.map((year) => {
                const archiveTeam = getTeamYear(year);
                const active = year === team.year;

                return (
                  <Link
                    key={year}
                    href={`/team/${year}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-sm font-black transition",
                      active
                        ? "border-als-red bg-als-red text-white shadow-lg shadow-als-red/15"
                        : "border-als-line bg-white text-als-blue hover:border-als-red/35 hover:bg-als-red/5 hover:text-als-red",
                    )}
                  >
                    {archiveTeam?.year ?? year}
                  </Link>
                );
              })}
            </nav>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-4 py-14 md:py-16">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-als-red/20 to-transparent" />
        <div className="container-wide relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-als-red">
              {t.team.president}
            </p>
            <h2 className="mt-3 text-3xl font-black text-als-blue md:text-4xl">
              {t.team.featuredLeadership}
            </h2>
          </Reveal>

          <div className="mx-auto mt-9 max-w-7xl rounded-[2rem] border border-als-line bg-[radial-gradient(circle_at_50%_0%,rgba(174,72,94,0.10),transparent_23rem),linear-gradient(180deg,#ffffff_0%,#fbfcfe_100%)] p-4 shadow-[0_30px_90px_rgba(63,96,118,0.10)] md:p-8">
            {president ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-5xl"
              >
                <TeamCard member={president} variant="featured" />
              </motion.div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfe] px-4 py-14 md:py-16">
        <div className="container-wide">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-als-red">
              {t.team.roleGroups}
            </p>
            <h2 className="mt-3 text-3xl font-black text-als-blue md:text-4xl">
              {t.team.members}
            </h2>
            <p className="mt-4 text-sm leading-7 text-als-muted md:text-base">
              {t.team.teamDirectoryNote}
            </p>
          </Reveal>

          <div className="mx-auto mt-10 max-w-7xl space-y-8">
            {memberSections.map((section) => (
              <RoleSection
                key={section.title}
                title={section.title}
                description={section.description}
                icon={section.icon}
                members={section.members}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function RoleSection({
  title,
  description,
  icon,
  members,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  members: TeamMember[];
}) {
  return (
    <motion.section
      variants={listVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-90px" }}
      className="rounded-[2rem] border border-als-line bg-white p-5 shadow-sm md:p-7"
    >
      <motion.div variants={itemVariants} className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-als-red/15 bg-als-red/[0.06] text-als-red shadow-sm">
          {icon}
        </div>
        <h3 className="mt-4 text-2xl font-black text-als-blue md:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-als-muted">{description}</p>
      </motion.div>

      <div className={cn("mt-7 grid gap-5", memberGridClass(members.length))}>
        {members.map((member) => (
          <motion.div key={member.id} variants={itemVariants}>
            <TeamCard member={member} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
