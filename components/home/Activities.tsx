"use client";

import { BookOpenText, Building2, Gavel, MessagesSquare, Network, Trophy } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { useI18n } from "@/components/providers/LanguageProvider";

const activities = [
  {
    title: "Legal Talks",
    description: "Practitioner and academic conversations that connect legal theory to real professional questions.",
    icon: BookOpenText,
  },
  {
    title: "Moot Court Training",
    description: "Memorial writing, oral advocacy, legal research, teamwork, and simulated court rounds.",
    icon: Gavel,
  },
  {
    title: "Debates",
    description: "Structured argumentation, legal reasoning, public speaking, and civic discussion.",
    icon: MessagesSquare,
  },
  {
    title: "Blog & Legal Research",
    description: "Student legal writing with summaries, citations, editorial review, and research discipline.",
    icon: Trophy,
  },
  {
    title: "Academic Excursions",
    description: "Institutional visits that make legal procedure and public service visible.",
    icon: Building2,
  },
  {
    title: "Professional Networking",
    description: "Peer, faculty, alumni, and practitioner connections for future-facing legal careers.",
    icon: Network,
  },
];

export function Activities() {
  const { t } = useI18n();

  return (
    <section className="section-y relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] text-white">
      <div className="absolute inset-0 hero-grid opacity-[0.12]" aria-hidden="true" />
      <div className="container-wide relative">
        <SectionHeading
          eyebrow={t.common.explore}
          title={t.home.activitiesTitle}
          text={t.home.activitiesText}
          align="center"
          className="[&_h2]:text-white [&_p]:text-white/[0.74]"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Reveal key={activity.title} delay={index * 0.04}>
                <article className="group h-full rounded-lg border border-white/15 bg-white p-6 text-als-blue shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-als-red/[0.45] hover:shadow-2xl hover:shadow-black/15">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-als-blue text-white transition group-hover:bg-als-red">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-als-blue">{activity.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-als-muted">{activity.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
