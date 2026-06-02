"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Handshake,
  Lightbulb,
  Megaphone,
  MessageSquareText,
  PenLine,
  Scale,
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
import { FallbackImage } from "@/components/ui/FallbackImage";
import { Badge } from "@/components/ui/badge";
import { competitions } from "@/data/competitions";
import { socials } from "@/data/socials";
import { teamYears } from "@/data/team";

const whyAlsMatters = [
  {
    title: "Student leadership",
    description: "ALS gives students ownership of academic community-building beyond the classroom.",
    icon: UsersRound,
  },
  {
    title: "Legal confidence",
    description: "Students practice speaking, writing, and reasoning in formats that make law feel usable.",
    icon: Scale,
  },
  {
    title: "Advocacy skills",
    description: "Debate and moot court formats strengthen structured argument and persuasive delivery.",
    icon: Megaphone,
  },
  {
    title: "Critical thinking",
    description: "Legal discussion asks students to test assumptions, compare authorities, and reason carefully.",
    icon: Brain,
  },
  {
    title: "Professional exposure",
    description: "Talks and networking help students understand legal practice, ethics, and career pathways.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Civic dialogue",
    description: "ALS creates space for respectful public reasoning on legal and social questions.",
    icon: Handshake,
  },
];

export function HomePage() {
  const { t } = useI18n();
  const currentTeam = teamYears.find((team) => team.year === "2025-2026") || teamYears[0];
  const marqueeItems = [
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

  return (
    <>
      <Hero />

      <MarqueeLine items={marqueeItems} />

      <section className="section-y bg-white">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative">
              <FallbackImage
                src="/images/placeholders/about-als.jpg"
                alt="ADA Law Society students at an academic event"
                label="ADA Law Society"
                className="aspect-[4/3] border-0 shadow-2xl shadow-als-blue/[0.12]"
              />
              <div className="absolute -bottom-5 left-5 right-5 rounded-lg border border-als-line bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-als-red text-white">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-als-blue">Established September 2019</p>
                    <p className="text-xs text-als-muted">Student-led legal community</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          <SectionHeading
            eyebrow={t.about.eyebrow}
            title={t.home.aboutTitle}
            text={t.home.aboutText}
          />
        </div>
      </section>

      <Activities />

      <section className="section-y bg-[#f7f8fb]">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Why ALS Matters"
            title="A student-led bridge between legal study and legal practice"
            text="ALS supports the habits future lawyers need: careful writing, confident speaking, ethical teamwork, professional curiosity, and serious dialogue."
            align="center"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyAlsMatters.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.04}>
                  <article className="group h-full rounded-lg border border-als-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-als-red/30 hover:shadow-xl hover:shadow-als-blue/10">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-als-red/10 text-als-red transition group-hover:bg-als-red group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-als-blue">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-als-muted">{item.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-wide">
          <Reveal>
            <div className="grid overflow-hidden rounded-lg border border-als-line bg-white shadow-xl shadow-als-blue/[0.08] lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative bg-als-blue p-8 text-white md:p-10">
                <div className="absolute inset-0 hero-grid opacity-25" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-als-red">
                    <Lightbulb className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h2 className="mt-6 text-3xl font-bold leading-tight md:text-4xl">
                    By Students, For Future Lawyers
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/[0.76] md:text-base">
                    ALS is built around the idea that legal education becomes stronger when
                    students create serious spaces for discussion, writing, advocacy, and
                    professional growth.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
                {[
                  {
                    title: "Beyond the classroom",
                    text: "Extra-curricular legal work helps students apply legal concepts to practical formats.",
                    icon: PenLine,
                  },
                  {
                    title: "Rigorous but collaborative",
                    text: "The society encourages disciplined preparation while keeping participation peer-led and welcoming.",
                    icon: Handshake,
                  },
                  {
                    title: "Connected to ADA's learning culture",
                    text: "ALS aligns with ADA's emphasis on applied knowledge, teamwork, debate, and real-world problem solving.",
                    icon: Brain,
                  },
                  {
                    title: "Open to legal curiosity",
                    text: "Events can interest law students and students from other majors who want to understand legal issues.",
                    icon: UsersRound,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-lg border border-als-line bg-[#f7f8fb] p-5">
                      <Icon className="h-5 w-5 text-als-red" aria-hidden="true" />
                      <h3 className="mt-4 font-bold text-als-blue">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-als-muted">{item.text}</p>
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

      <section className="section-y bg-als-blue text-white">
        <div className="container-wide">
          <SectionHeading
            eyebrow={t.competitions.eyebrow}
            title={t.home.competitionsTitle}
            text={t.home.competitionsText}
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
                      {t.common.explore}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading title={t.home.teamTitle} text={t.home.teamText} />
            <Reveal>
              <Link
                href="/team/2025-2026"
                className="inline-flex items-center gap-2 text-sm font-semibold text-als-red transition hover:gap-3"
              >
                {t.nav.team}
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

      <section className="section-y bg-[#f7f8fb]">
        <div className="container-wide">
          <SectionHeading
            title={t.home.momentsTitle}
            text={t.home.momentsText}
            align="center"
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

      <section className="bg-white py-16">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-lg bg-als-blue p-8 text-white md:p-10">
              <div className="absolute inset-0 hero-grid opacity-40" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-als-red">
                    <MessageSquareText className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-3xl font-bold md:text-4xl">{t.home.socialTitle}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/[0.72] md:text-base">
                    {t.home.socialText}
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
