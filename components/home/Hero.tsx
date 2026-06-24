"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Badge } from "@/components/ui/badge";
import { EditableText } from "@/components/cms/EditableText";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  const { t } = useI18n();

  return (
    <section
      className="relative isolate min-h-[calc(100vh-5.25rem)] overflow-hidden bg-[#2F4C60] text-white"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(20, 31, 39, 0.78) 0%, rgba(35, 55, 68, 0.62) 46%, rgba(20, 31, 39, 0.48) 100%), url('/images/hero-courtroom.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-transparent to-[#2F4C60]/70" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-als-red/45 to-transparent" />

      <div className="container-wide relative flex min-h-[calc(100vh-5.25rem)] items-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Badge variant="light">{t.home.eyebrow}</Badge>
          <p className="mt-7 text-sm font-black uppercase tracking-[0.22em] text-white/70">
            ADA Law Society
          </p>
          <h1 className="mt-4 text-balance text-5xl font-black leading-[0.98] tracking-normal text-white md:text-7xl">
            {t.home.title}<EditableText contentKey="hero.title" fallback="" />
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/84 md:text-xl">
            {t.home.subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <MagneticButton href="/news">
              {t.home.exploreEvents}
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="/blog" variant="secondary">
              {t.home.readBlog}
            </MagneticButton>
            <MagneticButton href="/team" variant="secondary">
              {t.home.meetTeam}
            </MagneticButton>
          </div>

          <div className="mt-12 grid max-w-2xl gap-3 border-t border-white/18 pt-6 text-sm font-semibold text-white/76 sm:grid-cols-3">
            <span>{t.home.statsMembers}</span>
            <span>{t.home.statsEvents}</span>
            <span>{t.home.statsSince}: Sep 2019</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
