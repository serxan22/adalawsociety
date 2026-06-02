"use client";

import { ArrowRight, CalendarDays, CheckCircle2, Trophy } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
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
      <section className="bg-als-blue py-20 text-white">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Reveal>
            <Badge variant="light">{t.competitions.eyebrow}</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              {localizedTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.76]">
              {localizedIntro}
            </p>
            <div className="mt-8">
              <MagneticButton href="/contact">
                {t.competitions.register}
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
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

      <section className="section-y bg-white">
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

      <section className="section-y bg-[#f7f8fb]">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading title={t.competitions.upcoming} />
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
            <SectionHeading title={t.competitions.highlights} />
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

      <section className="section-y bg-als-blue text-white">
        <div className="container-wide">
          <SectionHeading
            title={t.competitions.format}
            align="center"
            className="[&_h2]:text-white"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {competition.format.map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-white/[0.12] bg-white/[0.08] p-6">
                  <p className="text-sm font-bold text-white">0{index + 1}</p>
                  <p className="mt-4 text-sm leading-7 text-white/[0.76]">{item}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {competition.cultureNote ? (
        <section className="bg-white py-12">
          <div className="container-wide">
            <Reveal>
              <div className="rounded-lg border border-als-line bg-[#f7f8fb] p-6 text-sm leading-7 text-als-muted">
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
