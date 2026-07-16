"use client";

import { BookOpenText, Building2, Gavel, MessagesSquare, Network, Trophy } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { useI18n } from "@/components/providers/LanguageProvider";
import { EditableText } from "@/components/cms/EditableText";
import { EditableI18nText } from "@/components/cms/EditableI18nText";

const activities = [
  {
    key: "home.activities.legalTalks",
    title: "Legal Talks",
    description: "Practitioner and academic conversations that connect legal theory to real professional questions.",
    icon: BookOpenText,
  },
  {
    key: "home.activities.mootCourt",
    title: "Moot Court Training",
    description: "Memorial writing, oral advocacy, legal research, teamwork, and simulated court rounds.",
    icon: Gavel,
  },
  {
    key: "home.activities.debates",
    title: "Debates",
    description: "Structured argumentation, legal reasoning, public speaking, and civic discussion.",
    icon: MessagesSquare,
  },
  {
    key: "home.activities.blog",
    title: "Blog & Legal Research",
    description: "Student legal writing with summaries, citations, editorial review, and research discipline.",
    icon: Trophy,
  },
  {
    key: "home.activities.excursions",
    title: "Academic Excursions",
    description: "Institutional visits that make legal procedure and public service visible.",
    icon: Building2,
  },
  {
    key: "home.activities.networking",
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
          eyebrow={<EditableI18nText contentKey="home.activities.eyebrow" value={t.common.explore} />}
          title={<EditableI18nText contentKey="home.activities.title" value={t.home.activitiesTitle} />}
          text={<EditableI18nText contentKey="home.activities.text" value={t.home.activitiesText} />}
          align="center"
          className="[&_h2]:text-white [&_p]:text-white/[0.74]"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Reveal key={activity.key} delay={index * 0.04}>
                <article className="group h-full rounded-lg border border-white/15 bg-white p-6 text-als-blue shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-als-red/[0.45] hover:shadow-2xl hover:shadow-black/15">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-als-blue text-white transition group-hover:bg-als-red">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-als-blue">
                    <EditableText contentKey={`${activity.key}.title`} fallback={activity.title} tag="span" />
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-als-muted">
                    <EditableText contentKey={`${activity.key}.description`} fallback={activity.description} tag="span" />
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
