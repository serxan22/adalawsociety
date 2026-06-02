"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { FallbackImage } from "@/components/ui/FallbackImage";
import type { NewsItem } from "@/data/news";
import { formatDate } from "@/lib/format";

export function NewsDetailPage({
  item,
  related,
}: {
  item: NewsItem;
  related: NewsItem[];
}) {
  const { t } = useI18n();

  return (
    <>
      <article className="bg-white">
        <section className="bg-als-blue py-16 text-white">
          <div className="container-wide">
            <Reveal>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/[0.72] transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.common.backToNews}
              </Link>
              <div className="mt-8 max-w-4xl">
                <Badge variant="light">{item.category}</Badge>
                <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
                  {item.title}
                </h1>
                <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/70">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(item.date)}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="container-wide py-10">
          <Reveal>
            <FallbackImage
              src={item.image}
              alt={item.title}
              label={item.category}
              className="aspect-[16/8] border-0 shadow-2xl shadow-als-blue/10"
            />
          </Reveal>
          <div className="mx-auto mt-10 max-w-3xl space-y-6 text-lg leading-8 text-als-blue/[0.82]">
            {item.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {item.sourceUrl ? (
              <p className="rounded-lg border border-als-line bg-[#f7f8fb] p-4 text-sm leading-6 text-als-muted">
                <span className="font-semibold text-als-blue">Public source: </span>
                <Link
                  href={item.sourceUrl}
                  target="_blank"
                  className="font-semibold text-als-red hover:text-als-blue"
                >
                  ADA Law Society public news page
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="section-y bg-[#f7f8fb]">
          <div className="container-wide">
            <SectionHeading title={t.common.relatedNews} />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((relatedItem) => (
                <NewsCard key={relatedItem.slug} item={relatedItem} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
