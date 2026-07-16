"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { EditableI18nText } from "@/components/cms/EditableI18nText";
import { articles } from "@/data/articles";

export function FeaturedBlog() {
  const { t } = useI18n();

  return (
    <section className="section-y relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] text-white">
      <div className="absolute inset-0 hero-grid opacity-[0.10]" aria-hidden="true" />
      <div className="container-wide relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            title={<EditableI18nText contentKey="home.featuredBlog.title" value={t.common.latestArticles} />}
            text={<EditableI18nText contentKey="home.featuredBlog.text" value={t.blog.intro} />}
            className="[&_h2]:text-white [&_p]:text-white/[0.74]"
          />
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:gap-3 hover:text-white/80"
            >
              <EditableI18nText contentKey="home.featuredBlog.cta" value={t.nav.blog} />
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
