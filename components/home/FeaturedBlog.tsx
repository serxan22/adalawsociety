"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { articles } from "@/data/articles";

export function FeaturedBlog() {
  const { t } = useI18n();

  return (
    <section className="section-y bg-white">
      <div className="container-wide">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading title={t.common.latestArticles} text={t.blog.intro} />
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-als-red transition hover:gap-3"
            >
              {t.nav.blog}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.05}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
