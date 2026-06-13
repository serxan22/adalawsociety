"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, Landmark, Scale, UsersRound } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] text-white"
    >
      <div className="absolute inset-0 hero-grid opacity-[0.16]" />
      <motion.div
        style={{ y }}
        className="absolute right-0 top-24 hidden h-72 w-72 rotate-45 border border-white/10 lg:block"
      />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-als-red/30 to-transparent" />

      <div className="container-wide relative grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.04fr_0.96fr]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Badge variant="light">{t.home.eyebrow}</Badge>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] md:text-7xl">
            {t.home.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.78] md:text-xl">
            {t.home.subtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticButton href="/news">
              {t.home.exploreEvents}
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="/blog" variant="secondary">
              {t.home.readBlog}
            </MagneticButton>
            <MagneticButton href="/team/2025-2026" variant="secondary">
              {t.home.meetTeam}
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-lg border border-white/18 bg-white/[0.08] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="legal-pattern absolute inset-0 opacity-20" />
            <div className="relative rounded-lg border border-white/15 bg-white/[0.08] p-6 text-white shadow-xl shadow-black/10 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase text-als-red">ADA Law Society</p>
                  <p className="mt-2 text-2xl font-bold">ALS</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/15 bg-white/10 shadow-sm">
                  <Scale className="h-9 w-9 text-als-red" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <HeroMetric icon={UsersRound} value="First & main" label={t.home.statsMembers} />
                <HeroMetric icon={Landmark} value="ADA University" label={t.home.statsEvents} />
                <HeroMetric icon={BookOpen} value="Sep 2019" label={t.home.statsSince} />
              </div>

              <div className="mt-8 space-y-3">
                {["Moot court training", "Legal debates", "Research and blog", "Academic excursions"].map(
                  (item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.08 }}
                      className="flex items-center gap-3 rounded-lg border border-white/12 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white shadow-sm"
                    >
                      <span className="h-2 w-2 rounded-full bg-als-red" />
                      {item}
                    </motion.div>
                  ),
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof UsersRound;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/[0.08] p-4 text-white shadow-sm">
      <Icon className="h-5 w-5 text-als-red" aria-hidden="true" />
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs leading-5 text-white/65">{label}</p>
    </div>
  );
}
