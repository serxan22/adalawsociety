"use client";

import {
  ArrowRight,
  BookOpenCheck,
  Calendar,
  CheckCircle2,
  Scale,
  UsersRound,
} from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableText } from "@/components/cms/EditableText";
import { MagneticButton } from "@/components/ui/MagneticButton";

const timeline = [
  {
    year: "2019",
    title: "Established in September",
    text: "ADA Law Society is founded as a student organization at ADA University.",
  },
  {
    year: "2024",
    title: "Public Law Blog launch",
    text: "The public ALS website lists the launch of the ADA Law Society Law Blog.",
  },
  {
    year: "2024",
    title: "Jurisquizdence listed",
    text: "The public ALS news page lists Jurisquizdence among society updates.",
  },
  {
    year: "2026",
    title: "Legal Discussion Forum cooperation",
    text: "The public ALS news page lists cooperation with BDU Law Faculty Student Scientific Society.",
  },
];

const storyCards = [
  {
    title: "Student-led legal community",
    text: "ALS is run as a student organization at ADA University, based in Baku, with a public identity centered on @adalawsociety.",
    icon: UsersRound,
  },
  {
    title: "Beyond the classroom",
    text: "The society exists to organize extra-curricular legal activities that improve the campus atmosphere and student life.",
    icon: BookOpenCheck,
  },
  {
    title: "Law in practice",
    text: "Its activity areas include lectures, talks, legal discussions, academic excursions, moot court activities, debate, and writing.",
    icon: Scale,
  },
];

export function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-16 text-white md:py-18">
        <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true" />
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase text-white/75">
              <EditableText contentKey="about.eyebrow" fallback={t.about.eyebrow} tag="span" />
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              <EditableText contentKey="about.title" fallback={t.about.title} tag="span" />
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.76]">
              <EditableText contentKey="about.body" fallback={t.about.intro} tag="span" />
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <EditableImage
              contentKey="about.image"
              fallback="/images/placeholders/about-page.jpg"
              alt="ADA Law Society community"
              width={800}
              height={600}
              className="aspect-[4/3] rounded-lg border border-white/10 object-cover shadow-2xl shadow-black/20"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-12 md:py-14">
        <div className="container-wide grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow={<EditableText contentKey="about.story.eyebrow" fallback="Our Story" tag="span" />}
            title={
              <EditableText
                contentKey="about.story.title"
                fallback="Founded in 2019 to make legal education more active, practical, and collaborative"
                tag="span"
              />
            }
            text={
              <EditableText
                contentKey="about.story.text"
                fallback="ALS gives law students a serious student-led platform for legal writing, advocacy, debate, research, professional development, and dialogue with the wider university community."
                tag="span"
              />
            }
            className="[&_h2]:text-white [&_p]:text-white/[0.78]"
          />
          <div className="grid gap-4">
            {storyCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={index * 0.04}>
                  <article className="flex gap-4 rounded-lg border border-white bg-white p-5 shadow-lg shadow-als-blue/10">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-als-red shadow-sm">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-bold text-als-blue">{card.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-als-muted">{card.text}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-12 md:py-14">
        <div className="container-wide grid gap-5 md:grid-cols-3">
          {[
            { key: "about.mission", title: t.about.missionTitle, text: t.about.mission },
            { key: "about.vision", title: t.about.visionTitle, text: t.about.vision },
            { key: "about.history", title: t.about.historyTitle, text: t.about.history },
          ].map((item, index) => (
            <Reveal key={item.key} delay={index * 0.04}>
              <article className="h-full rounded-lg border border-white bg-white p-6 shadow-lg shadow-als-blue/10">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-als-red/10 text-als-red">
                  <Calendar className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-als-blue">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-als-muted">
                  <EditableText contentKey={item.key} fallback={item.text} tag="span" />
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-12 text-white md:py-14">
        <div className="absolute inset-0 hero-grid opacity-[0.12]" aria-hidden="true" />
        <div className="container-wide grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            title={t.about.valuesTitle}
            text={t.about.joinText}
            className="[&_h2]:text-white [&_p]:text-white/[0.74]"
          />
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {t.about.values.map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-3 rounded-lg border border-white/15 bg-white p-4 text-sm font-semibold text-als-blue shadow-xl shadow-black/10"
                >
                  <CheckCircle2 className="h-5 w-5 text-als-red" />
                  {value}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-12 text-white md:py-14">
        <div className="container-wide">
          <SectionHeading
            title="Timeline"
            text="Only public, verified milestones are listed here. Add more details after ALS confirms them."
            align="center"
            className="[&_h2]:text-white [&_p]:text-white/[0.72]"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {timeline.map((item, index) => (
              <Reveal key={`${item.year}-${item.title}-${index}`} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-white/[0.12] bg-white/[0.08] p-5">
                  <p className="text-3xl font-bold text-white">{item.year}</p>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/[0.72]">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-12">
        <div className="container-wide">
          <Reveal>
            <div className="grid gap-6 rounded-lg border border-als-line bg-white p-8 shadow-xl shadow-als-blue/[0.08] md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase text-als-red">{t.about.joinTitle}</p>
                <h2 className="mt-2 text-3xl font-bold text-als-blue">{t.about.cta}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-als-muted">
                  <EditableText
                    contentKey="about.cta.text"
                    fallback="Contact ALS about membership, collaborations, legal writing, academic events, debate, moot court training, or professional development opportunities."
                    tag="span"
                  />
                </p>
              </div>
              <MagneticButton href="/contact">
                {t.nav.contact}
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
