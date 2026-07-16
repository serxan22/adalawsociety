"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Scale } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/providers/LanguageProvider";
import { EditableText } from "@/components/cms/EditableText";
import { EditableI18nText } from "@/components/cms/EditableI18nText";
import type { NewsItem } from "@/data/news";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type NewsCardVariant = "card" | "featured" | "timeline";

type NewsCardProps = {
  item: NewsItem;
  compact?: boolean;
  timelineIndex?: number;
  variant?: NewsCardVariant;
};

function NewsThumbnail({
  item,
  mode = "card",
}: {
  item: NewsItem;
  mode?: "card" | "featured" | "timeline";
}) {
  const [failed, setFailed] = useState(!item.image);
  const showImage = mode === "card" && !failed && item.image;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-als-line bg-[#f8fafc]",
        mode === "featured" && "min-h-[17rem] md:min-h-[22rem]",
        mode === "timeline" && "h-28 sm:h-full sm:min-h-32",
        mode === "card" && "h-44",
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(174,72,94,0.16),transparent_9rem),radial-gradient(circle_at_88%_76%,rgba(63,96,118,0.12),transparent_11rem),linear-gradient(135deg,#ffffff_0%,#f4f7fb_100%)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-als-red via-als-blue to-als-red/50" />
          <div className="absolute inset-0 legal-pattern opacity-[0.22]" />
          <div className="relative flex h-full flex-col justify-between p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-als-red shadow-sm ring-1 ring-als-red/10">
                <Scale className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="rounded-full border border-als-blue/10 bg-white/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-als-blue">
                <EditableText contentKey="news.card.placeholderBadge" fallback="ALS" tag="span" />
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-als-muted">{item.category}</p>
              <p className="mt-1 max-w-48 text-sm font-bold leading-5 text-als-blue">
                <EditableText contentKey="news.card.placeholderTitle" fallback="ADA Law Society Update" tag="span" />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function NewsCard({
  item,
  compact = false,
  timelineIndex = 1,
  variant = "card",
}: NewsCardProps) {
  const { t } = useI18n();

  if (variant === "featured") {
    return (
      <Card className="group overflow-hidden border-als-line/90 bg-white shadow-[0_24px_80px_rgba(63,96,118,0.10)] transition duration-300 hover:-translate-y-1 hover:border-als-red/25 hover:shadow-[0_28px_90px_rgba(63,96,118,0.14)]">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="absolute left-0 top-10 hidden h-16 w-1 rounded-r-full bg-als-red md:block" />
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{item.category}</Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-als-line bg-white px-3 py-1 text-xs font-semibold text-als-muted">
                <CalendarDays className="h-3.5 w-3.5 text-als-red" aria-hidden="true" />
                {formatDate(item.date)}
              </span>
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-als-red">
              <EditableText contentKey="news.card.featuredLabel" fallback="Featured update" tag="span" />
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight text-als-blue md:text-4xl">
              {item.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-als-muted">{item.excerpt}</p>
            <Link
              href={`/news/${item.slug}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-als-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-als-blue/15 transition hover:-translate-y-0.5 hover:bg-als-ink"
            >
              <EditableText contentKey="news.card.readFullUpdate" fallback="Read full update" tag="span" />
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative border-t border-als-line bg-[#f8fafc] p-4 lg:border-l lg:border-t-0 md:p-5">
            <NewsThumbnail item={item} mode="featured" />
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "timeline") {
    return (
      <article className="group relative rounded-2xl border border-als-line/90 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-als-red/25 hover:shadow-xl hover:shadow-als-blue/10 md:ml-8">
        <div className="absolute -left-[2.95rem] top-6 z-10 hidden h-8 w-8 place-items-center rounded-full border border-als-red/20 bg-white text-[0.68rem] font-black text-als-red shadow-sm md:grid">
          {String(timelineIndex).padStart(2, "0")}
        </div>
        <div className="flex min-w-0 flex-col justify-between py-1">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-als-muted">
              <span>{formatDate(item.date)}</span>
              <span className="h-1 w-1 rounded-full bg-als-red" aria-hidden="true" />
              <span>{item.category}</span>
            </div>
            <h3 className="mt-3 text-xl font-black leading-snug text-als-blue transition group-hover:text-als-red">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-als-muted">{item.excerpt}</p>
          </div>
          <Link
            href={`/news/${item.slug}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-als-red transition group-hover:gap-3"
          >
            <EditableText contentKey="news.card.readFullUpdate" fallback="Read full update" tag="span" />
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <Card className="group h-full overflow-hidden hover:-translate-y-1 hover:border-als-red/20 hover:shadow-xl hover:shadow-als-blue/10">
      <div className={cn("p-3 pb-0", compact && "p-2 pb-0")}>
        <NewsThumbnail item={item} mode="card" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{item.category}</Badge>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-als-muted">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(item.date)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold leading-snug text-als-blue">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-als-muted">{item.excerpt}</p>
        </div>
        <Link
          href={`/news/${item.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-als-red transition group-hover:gap-3"
        >
          <EditableI18nText contentKey="news.card.readMore" value={t.common.readMore} />
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
