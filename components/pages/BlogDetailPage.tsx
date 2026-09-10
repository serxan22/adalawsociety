"use client";

import Link from "next/link";
import { RichTextRenderer } from "@/components/cms/RichTextRenderer";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { EditableText } from "@/components/cms/EditableText";
import { EditableI18nText } from "@/components/cms/EditableI18nText";
import type { Article } from "@/data/articles";
import { formatDate } from "@/lib/format";

export function BlogDetailPage({ article, related }: {
  article: Article;
  related: Article[];
  preview?: boolean;
}) {
  const { t } = useI18n();
  return (
    <>
      <article className="bg-als-blue-dark">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-16 text-white">
          <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true" />
          <div className="container-wide relative">
            <Reveal>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/[0.72] transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <EditableI18nText contentKey="blog.detail.backLink" value={t.common.backToBlog} />
              </Link>
              <div className="mt-8 max-w-4xl">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="light">{article.category}</Badge>
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="light">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
                  {article.title}
                </h1>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium text-white/[0.72]">
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    {article.author.name}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(article.date)}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="container-wide py-10">
          <Reveal>
            <FallbackImage
              src={article.coverImage}
              alt={article.title}
              label={article.category}
              className="aspect-[16/8] border-0 shadow-2xl shadow-als-blue/10"
            />
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-5xl gap-8 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl shadow-black/10 md:p-6 lg:grid-cols-[1fr_17rem]">
            <div className="space-y-8">
              <Reveal>
                <section className="rounded-lg border border-als-line bg-als-blue-soft p-6">
                  <p className="text-sm font-semibold uppercase text-als-red">
                    <EditableI18nText contentKey="blog.detail.summaryLabel" value={t.blog.summary} />
                  </p>
                  <p className="mt-3 text-lg leading-8 text-als-blue">{article.summary}</p>
                </section>
              </Reveal>

              <div className="space-y-6 text-lg leading-8 text-als-blue/[0.82]">
                {article.richContent ? <RichTextRenderer document={article.richContent}/> : article.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <section className="rounded-lg border border-als-line bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-als-blue">
                  <EditableI18nText contentKey="blog.detail.citationsLabel" value={t.blog.citations} />
                </h2>
                <ol className="mt-5 space-y-4">
                  {article.citations.map((citation, index) => (
                    <li key={`${citation.label}-${index}`} className="text-sm leading-6 text-als-muted">
                      <span className="font-semibold text-als-blue">{index + 1}. {citation.label}</span>
                      <span> - {citation.source}</span>
                      {citation.url ? (
                        <Link
                          href={citation.url}
                          target="_blank"
                          className="ml-2 font-semibold text-als-red hover:text-als-blue"
                        >
                          <EditableText contentKey="blog.detail.sourceLinkText" fallback="Source" tag="span" />
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>

            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-als-line bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FallbackImage
                    src={article.author.image}
                    alt={article.author.name}
                    label={article.author.name}
                    className="h-14 w-14 shrink-0 border-0"
                  />
                  <div>
                    <p className="font-bold text-als-blue">{article.author.name}</p>
                    <p className="text-sm text-als-muted">{article.author.role}</p>
                  </div>
                </div>
                {article.author.bio && <p className="mt-4 text-sm leading-6 text-als-muted">{article.author.bio}</p>}
                {article.author.socialLinks && <div className="mt-3 flex flex-wrap gap-2">{Object.entries(article.author.socialLinks).map(([label,url])=><a key={label} href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-als-red">{label}</a>)}</div>}

              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
          <div className="container-wide">
            <SectionHeading
              title={<EditableI18nText contentKey="blog.detail.relatedTitle" value={t.common.relatedArticles} />}
              className="[&_h2]:text-white [&_p]:text-white/[0.74]"
            />
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
