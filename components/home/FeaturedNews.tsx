"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { useI18n } from "@/components/providers/LanguageProvider";
import { NewsCard } from "@/components/news/NewsCard";
import { newsItems } from "@/data/news";

export function FeaturedNews() {
  const { t } = useI18n();

  return (
    <section className="section-y bg-[#f7f8fb]">
      <div className="container-wide">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading title={t.common.latestNews} text={t.news.intro} />
          <Reveal>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-als-red transition hover:gap-3"
            >
              {t.nav.news}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {newsItems.slice(0, 3).map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.05}>
              <NewsCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
