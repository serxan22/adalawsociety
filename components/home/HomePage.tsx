"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Handshake,
  Lightbulb,
  MessageSquareText,
  PenLine,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Activities } from "@/components/home/Activities";
import { FeaturedBlog } from "@/components/home/FeaturedBlog";
import { FeaturedNews } from "@/components/home/FeaturedNews";
import { Hero } from "@/components/home/Hero";
import { useI18n } from "@/components/providers/LanguageProvider";
import { MarqueeLine } from "@/components/site/MarqueeLine";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { SocialIcon } from "@/components/site/SocialIcon";
import { EditableText } from "@/components/cms/EditableText";
import { EditableI18nText } from "@/components/cms/EditableI18nText";
import { EditableImage } from "@/components/cms/EditableImage";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { Badge } from "@/components/ui/badge";
import { competitions } from "@/data/competitions";
import { socials } from "@/data/socials";
import { teamYears } from "@/data/team";

export function HomePage() {
  const { t } = useI18n();
  const currentTeam = teamYears.find((team) => team.year === "2025-2026") || teamYears[0];
  const marqueeWords = [
    "Moot Court",
    "Legal Writing",
    "Debate",
    "Advocacy",
    "Legal Research",
    "Student Leadership",
    "Academic Excellence",
    "Your Gateway to the Legal World",
    "ADA Law Society",
  ];
  const marqueeItems = marqueeWords.map((word, index) => (
    <EditableText key={index} contentKey={`home.marquee.${index}`} fallback={word} tag="span" />
  ));

  return (
    <>
      <Hero />

      <MarqueeLine items={marqueeItems} />

      <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative">
              <EditableImage
                contentKey="home.about.image"
                fallback="/images/placeholders/about-als.jpg"
                alt="ADA Law Society students at an academic event"
                width={800}
                height={600}
                className="aspect-[4/3] rounded-lg border-0 object-cover shadow-2xl shadow-als-blue/[0.12]"
              />
              <div className="absolute -bottom-5 left-5 right-5 rounded-lg border border-als-line bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-als-red text-white">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-als-blue">
                      <EditableText contentKey="home.about.badge.title" fallback="Established September 2019" tag="span" />
                    </p>
                    <p className="text-xs text-als-muted">
                      <EditableText contentKey="home.about.badge.text" fallback="Student-led legal community" tag="span" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          <SectionHeading
            eyebrow={t.about.eyebrow}
            title={<EditableText contentKey="home.about.title" fallback={t.home.aboutTitle} tag="span" />}
            text={<EditableText contentKey="home.about.text" fallback={t.home.aboutText} tag="span" />}
            className="[&_h2]:text-white [&_p]:text-white/[0.78]"
          />
        </div>
      </section>

      <Activities />

      <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
        <div className="container-wide">
          <Reveal>
            <div className="grid overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_28px_90px_rgba(16,24,40,0.16)] backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative bg-gradient-to-br from-[#3F6076] to-[#2F4C60] p-8 text-white md:p-10">
                <div className="absolute inset-0 hero-grid opacity-25" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-als-red">
                    <Lightbulb className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h2 className="mt-6 text-3xl font-bold leading-tight md:text-4xl">
                    <EditableText
                      contentKey="home.students.title"
                      fallback="By Students, For Future Lawyers"
                      tag="span"
                    />
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/[0.76] md:text-base">
                    <EditableText
                      contentKey="home.students.text"
                      fallback="ALS is built around the idea that legal education becomes stronger when students create serious spaces for discussion, writing, advocacy, and professional growth."
                      tag="span"
                    />
                  </p>
                </div>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
                {[
                  {
                    key: "home.feature.classroom",
                    title: "Beyond the classroom",
                    text: "Extra-curricular legal work helps students apply legal concepts to practical formats.",
                    icon: PenLine,
                  },
                  {
                    key: "home.feature.rigorous",
                    title: "Rigorous but collaborative",
                    text: "The society encourages disciplined preparation while keeping participation peer-led and welcoming.",
                    icon: Handshake,
                  },
                  {
                    key: "home.feature.connected",
                    title: "Connected to ADA's learning culture",
                    text: "ALS aligns with ADA's emphasis on applied knowledge, teamwork, debate, and real-world problem solving.",
                    icon: Brain,
                  },
                  {
                    key: "home.feature.curiosity",
                    title: "Open to legal curiosity",
                    text: "Events can interest law students and students from other majors who want to understand legal issues.",
                    icon: UsersRound,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.key} className="rounded-lg border border-white/80 bg-white/95 p-5 shadow-sm">
                      <Icon className="h-5 w-5 text-als-red" aria-hidden="true" />
                      <h3 className="mt-4 font-bold text-als-blue">
                        <EditableText contentKey={`${item.key}.title`} fallback={item.title} tag="span" />
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-als-muted">
                        <EditableText contentKey={`${item.key}.text`} fallback={item.text} tag="span" />
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FeaturedNews />
      <FeaturedBlog />

      <section className="section-y relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] text-white">
        <div className="absolute inset-0 hero-grid opacity-[0.12]" aria-hidden="true" />
        <div className="container-wide">
          <SectionHeading
            eyebrow={<EditableI18nText contentKey="home.competitions.eyebrow" value={t.competitions.eyebrow} />}
            title={<EditableI18nText contentKey="home.competitions.title" value={t.home.competitionsTitle} />}
            text={<EditableI18nText contentKey="home.competitions.text" value={t.home.competitionsText} />}
            align="center"
            className="[&_h2]:text-white [&_p]:text-white/[0.72]"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {competitions.map((competition, index) => (
              <Reveal key={competition.slug} delay={index * 0.05}>
                <Link
                  href={`/competitions/${competition.slug}`}
                  className="group block h-full overflow-hidden rounded-lg border border-white/[0.12] bg-white/[0.08] p-5 transition hover:-translate-y-1 hover:border-als-red"
                >
                  <FallbackImage
                    src={competition.image}
                    alt={competition.title}
                    label={competition.label}
                    className="h-56 border-0"
                  />
                  <div className="mt-5">
                    <Badge variant="light">{competition.label}</Badge>
                    <h3 className="mt-4 text-2xl font-bold">{competition.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/[0.72]">{competition.intro}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition group-hover:gap-3 group-hover:text-white">
                      <EditableI18nText contentKey="home.competitions.cta" value={t.common.explore} />
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
        <div className="container-wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              title={<EditableI18nText contentKey="home.team.title" value={t.home.teamTitle} />}
              text={<EditableI18nText contentKey="home.team.text" value={t.home.teamText} />}
              className="[&_h2]:text-white [&_p]:text-white/[0.78]"
            />
            <Reveal>
              <Link
                href="/team/2025-2026"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:gap-3 hover:text-white"
              >
                <EditableI18nText contentKey="home.team.cta" value={t.nav.team} />
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {currentTeam.members.slice(0, 4).map((member, index) => (
              <Reveal key={`${member.role}-${index}`} delay={index * 0.05}>
                <article className="overflow-hidden rounded-lg border border-als-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-als-blue/10">
                  <FallbackImage
                    src={member.image}
                    alt={member.name}
                    label={member.role}
                    className="h-56 rounded-none border-0"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-als-blue">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-als-red">{member.role}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] text-white">
        <div className="absolute inset-0 hero-grid opacity-[0.12]" aria-hidden="true" />
        <div className="container-wide">
          <SectionHeading
            title={<EditableI18nText contentKey="home.moments.title" value={t.home.momentsTitle} />}
            text={<EditableI18nText contentKey="home.moments.text" value={t.home.momentsText} />}
            align="center"
            className="[&_h2]:text-white [&_p]:text-white/[0.74]"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {["gallery-1", "gallery-2", "gallery-3", "gallery-4"].map((name, index) => (
              <Reveal key={name} delay={index * 0.04}>
                <FallbackImage
                  src={`/images/placeholders/${name}.jpg`}
                  alt={`ALS event moment ${index + 1}`}
                  label="ALS Moments"
                  className={index % 2 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-16">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-lg border border-white/15 bg-[#2F4C60]/70 p-8 text-white shadow-[0_24px_80px_rgba(16,24,40,0.18)] md:p-10">
              <div className="absolute inset-0 hero-grid opacity-40" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-als-red">
                    <MessageSquareText className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-3xl font-bold md:text-4xl">
                    <EditableI18nText contentKey="home.social.title" value={t.home.socialTitle} />
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/[0.72] md:text-base">
                    <EditableI18nText contentKey="home.social.text" value={t.home.socialText} />
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {socials.map((social) => {
                    return social.href ? (
                      <Link
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-als-red hover:bg-als-red"
                      >
                        <SocialIcon name={social.name} />
                        {social.handle ?? social.name}
                      </Link>
                    ) : (
                      <span
                        key={social.name}
                        title={`${social.name} link pending`}
                        className="inline-flex h-12 cursor-default items-center gap-2 rounded-full border border-dashed border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white/65 transition hover:-translate-y-0.5 hover:border-white/30 hover:text-white"
                      >
                        <SocialIcon name={social.name} />
                        {social.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
