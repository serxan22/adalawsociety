"use client";

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
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { NewsCard } from "@/components/news/NewsCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { currentUser } from "@/data/current-user";
import { newsCategories, newsItems, type NewsCategory } from "@/data/news";
import { canCreateContent } from "@/lib/auth/roles";
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

export function NewsListingPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPreview, setSearchPreview] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const canCreateNews = currentUser.authenticated && canCreateContent(currentUser.role);

  const filteredNews = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return newsItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery =
        !normalized ||
        [item.title, item.excerpt, item.category].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const [leadNews, ...newsFeed] = filteredNews;
  const searchExpanded = searchOpen || searchPreview || query.length > 0;

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const clearSearch = () => {
    setQuery("");
    setSearchOpen(false);
    setSearchPreview(false);
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-als-line bg-[radial-gradient(circle_at_10%_20%,rgba(174,72,94,0.10),transparent_28rem),radial-gradient(circle_at_90%_12%,rgba(63,96,118,0.08),transparent_26rem),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] pb-10 pt-16 md:pb-12 md:pt-20">
        <div className="absolute inset-0 legal-pattern opacity-[0.18]" aria-hidden="true" />
        <div className="container-wide relative">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <SectionHeading
              eyebrow={t.news.eyebrow}
              title={t.news.title}
              text={t.news.intro}
              headingLevel="h1"
              className="[&_h1]:text-4xl [&_h1]:font-black [&_h1]:tracking-normal [&_h1]:text-als-blue md:[&_h1]:text-6xl [&_p]:max-w-2xl"
            />
            <Reveal
              delay={0.06}
              className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end"
            >
              {canCreateNews ? (
                <Link
                  href="/dashboard/news/new"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-als-red px-5 text-sm font-semibold text-white shadow-lg shadow-als-red/15 transition hover:-translate-y-0.5 hover:bg-[#96384d]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create News
                </Link>
              ) : null}
              <motion.div
                className="group relative flex h-12 max-w-full items-center overflow-hidden rounded-full border border-als-line bg-white shadow-[0_18px_45px_rgba(63,96,118,0.10)]"
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
            <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/75 p-3 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
              <div className="inline-flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-[0.16em] text-als-muted">
                <SlidersHorizontal className="h-4 w-4 text-als-red" aria-hidden="true" />
                Filter updates
              </div>
              <div className="flex flex-wrap gap-2">
                {(["All", ...newsCategories] as CategoryFilter[]).map((item) => {
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
                      {item === "All" ? t.common.all : item}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_34%,#ffffff_100%)] pb-20 pt-12 md:pb-24 md:pt-16">
        <div className="container-wide">
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

              <div className="mt-12 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
                <aside className="hidden lg:block">
                  <div className="sticky top-28 rounded-2xl border border-als-line bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-als-red/10 text-als-red">
                      <Newspaper className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-als-muted">
                      News feed
                    </p>
                    <p className="mt-2 text-3xl font-black text-als-blue">
                      {filteredNews.length}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-als-muted">
                      {query || category !== "All"
                        ? "Matching public updates in the current view."
                        : "Verified public ALS updates currently listed."}
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
                ) : (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="rounded-2xl border border-dashed border-als-line bg-white p-10 text-center"
                  >
                    <Sparkles className="mx-auto h-7 w-7 text-als-red" aria-hidden="true" />
                    <p className="mt-3 text-sm font-semibold text-als-blue">
                      Only one update matches this view.
                    </p>
                    <p className="mt-1 text-sm text-als-muted">
                      Adjust the filters or search to explore more ALS updates.
                    </p>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="mx-auto max-w-xl rounded-3xl border border-dashed border-als-line bg-white p-10 text-center shadow-sm"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-als-red/10 text-als-red">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-als-blue">{t.common.noResults}</h3>
              <p className="mt-2 text-sm leading-6 text-als-muted">
                Try another category or clear the search field to return to the full newsroom.
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-als-blue px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-als-ink"
              >
                Reset newsroom
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
