"use client";

import { CalendarDays, CheckCircle2, FileText, Trophy } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { FallbackImage } from "@/components/ui/FallbackImage";
import type { Competition } from "@/data/competitions";
import { formatDate } from "@/lib/format";

export function CompetitionPage({ competition }: { competition: Competition }) {
  const { t } = useI18n();
  const localizedTitle =
    competition.slug === "debate" ? t.competitions.debateTitle : t.competitions.mootTitle;
  const localizedIntro =
    competition.slug === "debate" ? t.competitions.debateIntro : t.competitions.mootIntro;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-20 text-white">
        <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true" />
        <div className="container-wide relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Reveal>
            <Badge variant="light">{t.competitions.eyebrow}</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              {localizedTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.76]">
              {localizedIntro}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <FallbackImage
              src={competition.image}
              alt={competition.title}
              label={competition.label}
              className="aspect-[4/3] border-white/10 shadow-2xl shadow-black/20"
            />
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
        <div className="container-wide">
          <div className="grid gap-4 md:grid-cols-4">
            {competition.pillars.map((pillar, index) => (
              <Reveal key={pillar} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-als-line bg-white p-5 shadow-sm">
                  <CheckCircle2 className="h-6 w-6 text-als-red" />
                  <h2 className="mt-4 text-base font-bold leading-6 text-als-blue">{pillar}</h2>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading
              title={t.competitions.upcoming}
              className="[&_h2]:text-white [&_p]:text-white/[0.74]"
            />
            <div className="mt-8 grid gap-4">
              {competition.upcoming.length > 0 ? (
                competition.upcoming.map((event, index) => (
                  <Reveal key={event.title} delay={index * 0.04}>
                    <article className="rounded-lg border border-als-line bg-white p-5 shadow-sm">
                      {event.date ? (
                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-als-red">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(event.date)}
                        </p>
                      ) : null}
                      <h3 className="mt-3 text-xl font-bold text-als-blue">{event.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-als-muted">{event.description}</p>
                    </article>
                  </Reveal>
                ))
              ) : (
                <Reveal>
                  <article className="rounded-lg border border-dashed border-als-line bg-white p-6 shadow-sm">
                    <CalendarDays className="h-5 w-5 text-als-red" />
                    <h3 className="mt-4 text-xl font-bold text-als-blue">
                      No verified upcoming events listed yet
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-als-muted">
                      Add upcoming debate or moot court dates here only after ALS confirms them
                      through its official channels.
                    </p>
                  </article>
                </Reveal>
              )}
            </div>
          </div>

          <div>
            <SectionHeading
              title={t.competitions.highlights}
              className="[&_h2]:text-white [&_p]:text-white/[0.74]"
            />
            <div className="mt-8 grid gap-4">
              {competition.highlights.map((highlight, index) => (
                <Reveal key={highlight} delay={index * 0.04}>
                  <div className="flex gap-3 rounded-lg border border-als-line bg-white p-5 shadow-sm">
                    <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-als-red" />
                    <p className="text-sm leading-6 text-als-blue">{highlight}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] text-white">
        <div className="absolute inset-0 hero-grid opacity-[0.12]" aria-hidden="true" />
        <div className="container-wide">
          <SectionHeading
            title={t.competitions.format}
            text={t.competitions.rulesIntro}
            align="center"
            className="[&_h2]:text-white [&_p]:text-white/[0.72]"
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="grid gap-4 md:grid-cols-3">
            {competition.format.map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-white/[0.12] bg-white/[0.08] p-6">
                  <p className="text-sm font-bold text-white">0{index + 1}</p>
                  <p className="mt-4 text-sm leading-7 text-white/[0.76]">{item}</p>
                </article>
              </Reveal>
            ))}
            </div>
            <Reveal delay={0.12}>
              <DocumentCard
                title={t.competitions.viewRules}
                text={t.competitions.documentComingSoon}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-12">
        <div className="container-wide">
          <Reveal>
            <div className="grid gap-5 rounded-2xl border border-white bg-white p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-als-red">
                  {t.competitions.draftExampleEyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-black text-als-blue">
                  {t.competitions.draftExampleTitle}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-als-muted">
                  {t.competitions.draftExampleText}
                </p>
              </div>
              <div className="md:w-72">
                <DocumentCard
                  title={t.competitions.viewExample}
                  text={t.competitions.documentComingSoon}
                  light
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {competition.cultureNote ? (
        <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-12">
          <div className="container-wide">
            <Reveal>
              <div className="rounded-lg border border-als-line bg-white p-6 text-sm leading-7 text-als-muted">
                <span className="font-semibold text-als-blue">Verification note: </span>
                {competition.cultureNote}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}

function DocumentCard({
  title,
  text,
  light = false,
}: {
  title: string;
  text: string;
  light?: boolean;
}) {
  return (
    <div
      className={
        light
          ? "rounded-2xl border border-dashed border-als-line bg-white p-5 text-als-muted"
          : "rounded-2xl border border-dashed border-white/20 bg-white/[0.08] p-5 text-white/[0.72]"
      }
    >
      <div
        className={
          light
            ? "grid h-11 w-11 place-items-center rounded-full bg-als-red/10 text-als-red"
            : "grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"
        }
      >
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className={light ? "mt-4 font-black text-als-blue" : "mt-4 font-black text-white"}>
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6">{text}</p>
      <button
        type="button"
        disabled
        className={
          light
            ? "mt-4 inline-flex h-10 items-center rounded-full border border-als-line bg-als-blue-soft px-4 text-xs font-bold text-als-muted"
            : "mt-4 inline-flex h-10 items-center rounded-full border border-white/15 bg-white/[0.06] px-4 text-xs font-bold text-white/60"
        }
      >
        {text}
      </button>
    </div>
  );
}
