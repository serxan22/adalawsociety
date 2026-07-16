"use client";

import Link from "next/link";
import { ArrowRight, History, UsersRound } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { EditableText } from "@/components/cms/EditableText";
import { earlyTeamPeriods, teamArchiveYears, getTeamYear } from "@/data/team";

export function TeamArchivePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-18 text-white md:py-22">
        <div className="absolute inset-0 hero-grid opacity-[0.12]" aria-hidden="true" />
        <div className="container-wide relative text-center">
          <Reveal className="mx-auto max-w-4xl">
            <Badge variant="light" className="mx-auto gap-2">
              <UsersRound className="h-4 w-4" aria-hidden="true" />
              ALS Team
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-black leading-tight md:text-6xl">
              <EditableText
                contentKey="team.archive.title"
                fallback="ADA Law Society Team Archive"
                tag="span"
              />
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              <EditableText
                contentKey="team.archive.intro"
                fallback="A public record of ALS leadership periods, early board members, and recent student-led committees."
                tag="span"
              />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-14 md:py-18">
        <div className="container-wide">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
              <EditableText contentKey="team.archive.early.eyebrow" fallback="Early Leadership Records" tag="span" />
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              <EditableText contentKey="team.archive.early.title" fallback="ALS Team 2019-2023" tag="span" />
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74 md:text-base">
              <EditableText
                contentKey="team.archive.early.text"
                fallback="Names and roles below are listed exactly from the provided ALS team records."
                tag="span"
              />
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {earlyTeamPeriods.map((period, index) => (
              <Reveal key={period.period} delay={index * 0.05}>
                <article className="h-full overflow-hidden rounded-2xl border border-white/15 bg-white shadow-xl shadow-black/10">
                  <div className="border-b border-als-line bg-[#F3F7F9] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-als-red">
                          {period.period}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-als-blue">
                          {period.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-als-muted">
                          {period.description}
                        </p>
                      </div>
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-als-red/10 text-als-red">
                        <History className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-als-line">
                    {period.members.map((member) => (
                      <div
                        key={`${period.period}-${member.role}-${member.name}`}
                        className="grid gap-1 px-6 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-5"
                      >
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-als-muted">
                          {member.role}
                        </span>
                        <span className="text-base font-bold text-als-blue">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-14">
        <div className="container-wide">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
              <EditableText contentKey="team.archive.recent.eyebrow" fallback="Recent Leadership Gallery" tag="span" />
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              <EditableText contentKey="team.archive.recent.title" fallback="Browse Recent Team Years" tag="span" />
            </h2>
          </Reveal>
          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
            {teamArchiveYears.map((year) => {
              const team = getTeamYear(year);

              return (
                <Link
                  key={year}
                  href={`/team/${year}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-bold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-als-red hover:bg-als-red"
                >
                  {team?.title ?? year}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
