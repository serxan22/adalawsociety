"use client";

import { usePublishedContent, type PublishedResult } from "@/components/cms/usePublishedContent";
import { PublicLibraryState } from "@/components/cms/PublicLibraryState";
import { ContentPagination } from "@/components/cms/ContentPagination";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Newspaper,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NewsCard } from "@/components/news/NewsCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { EditableText } from "@/components/cms/EditableText";
import { EditableI18nText } from "@/components/cms/EditableI18nText";
import type { NewsItem, NewsCategory } from "@/data/news";
import { cn } from "@/lib/utils";

type CategoryFilter = "All" | NewsCategory;

const feedVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function NewsListingPage({ initial, canCreateNews = false }: { initial: PublishedResult<NewsItem>; canCreateNews?: boolean }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPreview, setSearchPreview] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listing = usePublishedContent("news", initial, query, category);
  const filteredNews = listing.unavailable ? [] : listing.posts;
  const filtered = !!query.trim() || category !== "All";

  const [leadNews, ...newsFeed] = filteredNews;
  const searchExpanded = searchOpen || searchPreview || query.length > 0;

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const clearSearch = () => {
    setQuery("");
    setCategory("All");
    setSearchOpen(false);
    setSearchPreview(false);
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#3F6076] to-[#2F4C60] pb-10 pt-16 text-white md:pb-12 md:pt-20">
        <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true" />
        <div className="container-wide relative">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <SectionHeading
              eyebrow={<EditableI18nText contentKey="news.eyebrow" value={t.news.eyebrow} />}
              title={<EditableText contentKey="news.title" fallback={t.news.title} tag="span" />}
              text={<EditableText contentKey="news.intro" fallback={t.news.intro} tag="span" />}
              headingLevel="h1"
              className="[&_h1]:text-4xl [&_h1]:font-black [&_h1]:tracking-normal [&_h1]:text-white md:[&_h1]:text-6xl [&_p]:max-w-2xl [&_p]:text-white/[0.76]"
            />
            <Reveal
              delay={0.06}
              className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end"
            >
              {canCreateNews ? (
                <Link
                  href="/admin/news/new"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-als-red px-5 text-sm font-semibold text-white shadow-lg shadow-als-red/15 transition hover:-translate-y-0.5 hover:bg-[#96384d]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <EditableText contentKey="news.createButton" fallback="Create News" tag="span" />
                </Link>
              ) : null}
              <motion.div
                className="group relative flex h-12 max-w-full items-center overflow-hidden rounded-full border border-white/35 bg-white shadow-[0_18px_45px_rgba(16,24,40,0.20)]"
                initial={false}
                animate={{ width: searchExpanded ? 316 : 48 }}
                transition={{ type: "spring", stiffness: 360, damping: 34 }}
                onMouseEnter={() => setSearchPreview(true)}
                onMouseLeave={() => setSearchPreview(false)}
              >
                <button
                  type="button"
                  aria-label={searchExpanded ? "Focus news search" : "Open news search"}
                  aria-expanded={searchExpanded}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-als-blue transition hover:bg-als-red/10 hover:text-als-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-als-red"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
                <AnimatePresence>
                  {searchExpanded ? (
                    <motion.div
                      key="news-search-input"
                      className="flex min-w-0 flex-1 items-center pr-2"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <input
                        ref={searchInputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onFocus={() => setSearchOpen(true)}
                        placeholder={t.news.searchPlaceholder}
                        className="h-11 min-w-0 flex-1 bg-transparent pr-2 text-sm font-medium text-als-blue placeholder:text-als-muted/70 focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Clear news search"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-als-muted transition hover:bg-als-blue/5 hover:text-als-red"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/12 p-3 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
              <div className="inline-flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-[0.16em] text-white/75">
                <SlidersHorizontal className="h-4 w-4 text-als-red" aria-hidden="true" />
                <EditableText contentKey="news.filterLabel" fallback="Filter updates" tag="span" />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["All", ...listing.categories] as CategoryFilter[]).map((item) => {
                  const active = category === item;

                  return (
                    <motion.button
                      key={item}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setCategory(item)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                        active
                          ? "border-als-red bg-als-red text-white shadow-lg shadow-als-red/15"
                          : "border-als-line bg-white text-als-blue shadow-sm hover:border-als-red/30 hover:bg-als-red/5 hover:text-als-red",
                      )}
                    >
                      {item === "All" ? <EditableI18nText contentKey="news.filterAll" value={t.common.all} /> : item}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] pb-20 pt-12 md:pb-24 md:pt-16">
        <div className="container-wide">
          <div aria-busy={listing.loading} className={listing.loading ? "opacity-60" : ""}>
          {filteredNews.length > 0 && leadNews ? (
            <>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
              >
                <NewsCard item={leadNews} variant="featured" />
              </motion.div>

              {newsFeed.length > 0 && (<div className="mt-12 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
                <aside className="hidden lg:block">
                  <div className="sticky top-28 rounded-2xl border border-als-line bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-als-red/10 text-als-red">
                      <Newspaper className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-als-muted">
                      <EditableText contentKey="news.feedLabel" fallback="News feed" tag="span" />
                    </p>
                    <p className="mt-2 text-3xl font-black text-als-blue">
                      {filteredNews.length}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-als-muted">
                      {query || category !== "All" ? (
                        <EditableText
                          contentKey="news.feedFilteredCaption"
                          fallback="Matching public updates in the current view."
                          tag="span"
                        />
                      ) : (
                        <EditableText
                          contentKey="news.feedCaption"
                          fallback="Verified public ALS updates currently listed."
                          tag="span"
                        />
                      )}
                    </p>
                  </div>
                </aside>

                {newsFeed.length > 0 ? (
                  <motion.div
                    variants={feedVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-90px" }}
                    className="relative space-y-5 before:absolute before:left-4 before:top-4 before:hidden before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-als-red/40 before:via-als-line before:to-transparent md:before:block"
                  >
                    {newsFeed.map((item, index) => (
                      <motion.div key={item.slug} variants={itemVariants}>
                        <NewsCard item={item} variant="timeline" timelineIndex={index + 1} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}
              </div>)}

            </>
          ) : (
            <PublicLibraryState kind="news" filtered={filtered} unavailable={listing.unavailable} onReset={listing.unavailable ? listing.retry : clearSearch}/>
          )}
          </div>
          <ContentPagination page={listing.page} total={listing.total} pageSize={listing.pageSize} onChange={listing.setPage}/>
        </div>
      </section>
    </>
  );
}
