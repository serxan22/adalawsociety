"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Library,
  PenLine,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/site/Reveal";
import { articleCategories, articles, type ArticleCategory } from "@/data/articles";
import { currentUser } from "@/data/current-user";
import { canCreateContent } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

type CategoryFilter = "All" | ArticleCategory;

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function BlogListingPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [author, setAuthor] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPreview, setSearchPreview] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const authors = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.author.name)))],
    [],
  );
  const canCreate = currentUser.authenticated && canCreateContent(currentUser.role);
  const writingStandards = t.blog.writingStandards;

  const filteredArticles = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return articles.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesAuthor = author === "All" || article.author.name === author;
      const matchesQuery =
        !normalized ||
        [
          article.title,
          article.excerpt,
          article.summary,
          article.category,
          article.author.name,
          ...article.tags,
        ].some((value) => value.toLowerCase().includes(normalized));

      return matchesCategory && matchesAuthor && matchesQuery;
    });
  }, [author, category, query]);

  const [featuredArticle, ...articleIndex] = filteredArticles;
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
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-16 text-white md:py-20">
        <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true" />
        <div className="container-wide relative">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
            <Reveal>
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/78">
                  {t.blog.eyebrow}
                </p>
                <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-normal text-white md:text-6xl">
                  {t.blog.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/[0.76] md:text-lg">
                  {t.blog.intro}
                </p>
                {canCreate ? (
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href="/dashboard/articles/new"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-als-red px-5 text-sm font-semibold text-white shadow-lg shadow-als-red/15 transition hover:-translate-y-0.5 hover:bg-[#96384d]"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Write Article
                    </Link>
                  </div>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-3xl border border-white/20 bg-white/94 p-6 text-als-blue shadow-[0_24px_70px_rgba(16,24,40,0.20)] backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-als-muted">
                      {t.blog.editorDesk}
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-als-blue">
                      {t.blog.writingForClarity}
                    </h2>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-als-red/10 text-als-red">
                    <PenLine className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {writingStandards.map((standard) => (
                    <div
                      key={standard}
                      className="flex items-center gap-3 rounded-2xl border border-als-line/80 bg-[#fbfcfe] px-4 py-3 text-sm font-semibold text-als-blue"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-als-red" aria-hidden="true" />
                      {standard}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-6">
        <div className="container-wide">
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
              <div className="rounded-2xl border border-als-line bg-[#fbfcfe] p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-als-red">
                  {t.blog.authorDocumentsTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-als-muted">
                  {t.blog.authorDocumentsText}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/blog-policy"
                  className="group flex h-full items-start gap-4 rounded-2xl border border-als-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-als-red/35 hover:bg-als-red/5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-als-red/10 text-als-red">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-als-blue">
                      {t.blog.blogPolicy}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-als-muted">
                      {t.blog.blogPolicyText}
                    </span>
                  </span>
                </Link>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-dashed border-als-line bg-[#fbfcfe] p-5 text-als-muted shadow-sm">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-als-red ring-1 ring-als-line">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-als-blue">
                      {t.blog.submissionGuidelines}
                    </span>
                    <span className="mt-1 block text-sm leading-6">
                      {t.blog.documentComingSoon}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#2F4C60]/70 backdrop-blur-xl">
        <div className="container-wide">
          <Reveal>
            <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center">
              <div className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/75">
                <Library className="h-4 w-4 text-als-red" aria-hidden="true" />
                {t.blog.browseInsights}
              </div>

              <div className="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
                {(["All", ...articleCategories] as CategoryFilter[]).map((item) => (
                  <FilterPill
                    key={item}
                    active={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item === "All" ? t.common.all : item}
                  </FilterPill>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                <label className="relative">
                  <span className="sr-only">{t.common.author}</span>
                  <select
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    className="h-11 w-full appearance-none rounded-full border border-als-line bg-white px-4 pr-10 text-sm font-semibold text-als-blue shadow-sm transition hover:border-als-red/30 focus:border-als-red focus:outline-none focus:ring-4 focus:ring-als-red/10 sm:w-56"
                  >
                    {authors.map((item) => (
                      <option key={item} value={item}>
                        {item === "All" ? `${t.common.author}: ${t.common.all}` : item}
                      </option>
                    ))}
                  </select>
                  <SlidersHorizontal
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-als-red"
                    aria-hidden="true"
                  />
                </label>

                <motion.div
                  className="group relative flex h-11 max-w-full items-center overflow-hidden rounded-full border border-als-line bg-[#fbfcfe] shadow-sm"
                  initial={false}
                  animate={{ width: searchExpanded ? 286 : 142 }}
                  transition={{ type: "spring", stiffness: 360, damping: 34 }}
                  onMouseEnter={() => setSearchPreview(true)}
                  onMouseLeave={() => setSearchPreview(false)}
                >
                  <button
                    type="button"
                    aria-label={searchExpanded ? "Focus blog search" : "Search blogs"}
                    aria-expanded={searchExpanded}
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold text-als-blue transition hover:bg-als-red/10 hover:text-als-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-als-red"
                    onClick={() => setSearchOpen(true)}
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    <span className={cn(searchExpanded && "hidden")}>{t.blog.searchBlogs}</span>
                  </button>
                  <AnimatePresence>
                    {searchExpanded ? (
                      <motion.div
                        key="blog-search-input"
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
                          placeholder={t.blog.searchPlaceholder}
                          className="h-10 min-w-0 flex-1 bg-transparent pr-2 text-sm font-medium text-als-blue placeholder:text-als-muted/70 focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label="Clear blog search"
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-als-muted transition hover:bg-als-blue/5 hover:text-als-red"
                          onClick={clearSearch}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] pb-20 pt-12 md:pb-24 md:pt-16">
        <div className="container-wide">
          {filteredArticles.length > 0 && featuredArticle ? (
            <>
              <div>
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                >
                  <ArticleCard article={featuredArticle} variant="featured" />
                </motion.div>
              </div>

              <div className="mt-14 flex flex-col gap-3 border-t border-white/20 pt-10 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                    {t.blog.blogIndex}
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-white">
                    {t.blog.latestBlogs}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-white/70">
                  {filteredArticles.length}{" "}
                  {filteredArticles.length === 1 ? t.blog.singleBlog : t.blog.blogs} {t.blog.inView}
                </p>
              </div>

              {articleIndex.length > 0 ? (
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-90px" }}
                  className="mt-7 grid gap-4"
                >
                  {articleIndex.map((article) => (
                    <motion.div key={article.slug} variants={itemVariants}>
                      <ArticleCard article={article} variant="index" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  className="mt-7 rounded-3xl border border-dashed border-als-line bg-white p-10 text-center"
                >
                  <PenLine className="mx-auto h-7 w-7 text-als-red" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-als-blue">
                    {t.blog.onlyOneMatchTitle}
                  </p>
                  <p className="mt-1 text-sm text-als-muted">
                    {t.blog.onlyOneMatchText}
                  </p>
                </motion.div>
              )}
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
                {t.blog.noResultsText}
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-als-blue px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-als-ink"
              >
                {t.blog.resetLibrary}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-als-red bg-als-red text-white shadow-lg shadow-als-red/15"
          : "border-als-line bg-white text-als-blue shadow-sm hover:border-als-red/30 hover:bg-als-red/5 hover:text-als-red",
      )}
    >
      {children}
    </motion.button>
  );
}
