"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  FileText,
  Heart,
  Quote,
  Scale,
  UserRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { Article } from "@/data/articles";
import { formatCount, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type ArticleCardVariant = "card" | "featured" | "index";

type ArticleCardProps = {
  article: Article;
  variant?: ArticleCardVariant;
};

function ArticleMark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-2xl border border-als-line bg-[radial-gradient(circle_at_20%_18%,rgba(174,72,94,0.14),transparent_5rem),linear-gradient(135deg,#ffffff_0%,#f5f7fb_100%)] text-als-blue",
        size === "sm" && "h-16 w-16",
        size === "md" && "h-20 w-20",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-als-red" />
      <div className="absolute inset-0 legal-pattern opacity-[0.16]" />
      <div className="relative flex h-full flex-col justify-between p-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-als-red shadow-sm ring-1 ring-als-red/10">
          <Scale className="h-5 w-5" aria-hidden="true" />
        </div>
        <FileText className="h-4 w-4 text-als-muted" aria-hidden="true" />
      </div>
    </div>
  );
}

function TagChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-als-red/15 bg-als-red/[0.06] px-3 py-1 text-xs font-bold text-als-red">
      {children}
    </span>
  );
}

export function ArticleCard({ article, variant = "card" }: ArticleCardProps) {
  const { t } = useI18n();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likeCount = article.likes + (liked ? 1 : 0);
  const saveCount = article.saves + (saved ? 1 : 0);

  if (variant === "featured") {
    return (
      <Card className="group overflow-hidden border-als-line/90 bg-white shadow-[0_22px_70px_rgba(63,96,118,0.09)] transition duration-300 hover:-translate-y-1 hover:border-als-red/25 hover:shadow-[0_28px_90px_rgba(63,96,118,0.13)]">
        <div className="relative p-6 md:p-8 lg:p-10">
          <div className="absolute inset-y-8 left-0 hidden w-1 rounded-r-full bg-als-red md:block" />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="navy">{article.category}</Badge>
            {article.tags.slice(0, 3).map((tag) => (
              <TagChip key={tag}>{tag}</TagChip>
            ))}
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-als-red">
            {t.blog.featuredBlog}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-als-blue md:text-5xl">
            {article.title}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-als-muted">
            {article.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-als-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-als-line bg-white px-3 py-1">
              <UserRound className="h-3.5 w-3.5 text-als-red" aria-hidden="true" />
              {article.author.name}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-als-line bg-white px-3 py-1">
              <CalendarDays className="h-3.5 w-3.5 text-als-red" aria-hidden="true" />
              {formatDate(article.date)}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-als-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-als-blue/15 transition hover:-translate-y-0.5 hover:bg-als-ink"
            >
              {t.blog.readBlog}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ActionButton
              active={liked}
              label={t.blog.like}
              onClick={() => setLiked((value) => !value)}
              icon={<Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />}
              count={likeCount}
            />
            <ActionButton
              active={saved}
              label={saved ? t.blog.saved : t.blog.save}
              onClick={() => setSaved((value) => !value)}
              icon={<Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />}
              count={saveCount}
            />
          </div>
          <div className="mt-8 rounded-2xl border border-als-line bg-[#fbfcfe] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-als-muted">
              {t.blog.abstract}
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-als-blue/80">
              {article.summary}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-als-line bg-white px-3 py-1 text-xs font-bold text-als-muted">
              <Quote className="h-3.5 w-3.5 text-als-red" aria-hidden="true" />
              {article.citations.length} {t.blog.citations}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "index") {
    return (
      <article className="group rounded-3xl border border-als-line/90 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-als-red/25 hover:shadow-xl hover:shadow-als-blue/10">
        <div className="grid gap-5 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-center">
          <ArticleMark />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="navy">{article.category}</Badge>
              {article.tags.slice(0, 2).map((tag) => (
                <TagChip key={tag}>{tag}</TagChip>
              ))}
              {article.citations.length > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-als-line bg-white px-3 py-1 text-xs font-bold text-als-muted">
                  <Quote className="h-3.5 w-3.5 text-als-red" aria-hidden="true" />
                  {article.citations.length}
                </span>
              ) : null}
            </div>
            <Link href={`/blog/${article.slug}`} className="mt-3 block">
              <h3 className="text-xl font-black leading-snug text-als-blue transition group-hover:text-als-red">
                {article.title}
              </h3>
            </Link>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-als-muted">{article.summary}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-als-muted">
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-3.5 w-3.5 text-als-red" aria-hidden="true" />
                {article.author.name}
              </span>
              <span>{formatDate(article.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:flex-col md:items-end">
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-als-line bg-white px-4 text-sm font-bold text-als-red transition hover:border-als-red/35 hover:bg-als-red/5"
            >
              {t.blog.readBlog}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-2">
              <ActionButton
                active={liked}
                label={t.blog.like}
                onClick={() => setLiked((value) => !value)}
                icon={<Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />}
                count={likeCount}
              />
              <ActionButton
                active={saved}
                label={saved ? t.blog.saved : t.blog.save}
                onClick={() => setSaved((value) => !value)}
                icon={<Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />}
                count={saveCount}
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:border-als-red/20 hover:shadow-xl hover:shadow-als-blue/10">
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between gap-3">
          <ArticleMark size="sm" />
          <Badge variant="navy">{article.category}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 2).map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>

        <Link href={`/blog/${article.slug}`} className="mt-4 block">
          <h3 className="text-lg font-bold leading-snug text-als-blue transition group-hover:text-als-red">
            {article.title}
          </h3>
        </Link>
        <p className="mt-3 flex-1 text-sm leading-6 text-als-muted">{article.excerpt}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-als-muted">
          <span className="inline-flex items-center gap-1">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            {article.author.name}
          </span>
          <span>{formatDate(article.date)}</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-als-line pt-4">
          <Link
            href={`/blog/${article.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-als-red transition hover:gap-3 hover:text-als-blue"
          >
            {t.common.readMore}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-2">
            <ActionButton
              active={liked}
              label={t.blog.like}
              onClick={() => setLiked((value) => !value)}
              icon={<Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />}
              count={likeCount}
            />
            <ActionButton
              active={saved}
              label={saved ? t.blog.saved : t.blog.save}
              onClick={() => setSaved((value) => !value)}
              icon={<Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />}
              count={saveCount}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ActionButton({
  active,
  label,
  icon,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative inline-flex h-9 items-center gap-1 rounded-full border border-als-line bg-white px-3 text-xs font-semibold text-als-blue transition hover:border-als-red/40 hover:bg-als-red/5"
    >
      <AnimatePresence>
        {active ? (
          <motion.span
            aria-hidden="true"
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 rounded-full bg-als-red/20"
          />
        ) : null}
      </AnimatePresence>
      <span className={active ? "text-als-red" : "text-als-muted"}>{icon}</span>
      <span>{formatCount(count)}</span>
    </button>
  );
}
