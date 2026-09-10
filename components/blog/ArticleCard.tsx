"use client";
/* eslint-disable @next/next/no-img-element -- CMS media is served through an access-checked application route. */
import Link from "next/link";
import {ArrowRight,ArrowUpRight,CalendarDays,FileText,Quote,Scale,UserRound} from "lucide-react";
import type {ReactNode} from "react";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {useI18n} from "@/components/providers/LanguageProvider";
import {EditableI18nText} from "@/components/cms/EditableI18nText";
import type {Article} from "@/data/articles";
import {formatDate} from "@/lib/format";
import {cn} from "@/lib/utils";
type Variant="card"|"featured"|"index";
function ArticleMark({article,size="md"}:{article:Article;size?:"sm"|"md"}){
 return <div className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-als-line bg-als-blue-soft text-als-blue",size==="sm"?"h-16 w-16":"h-20 w-20")}>
  {article.coverImage?<img src={article.coverImage} alt="" className="h-full w-full object-cover"/>:<><div className="absolute inset-x-0 top-0 h-1 bg-als-red"/><Scale size={22} className="text-als-red"/><FileText size={13} className="absolute bottom-2 right-2 text-als-muted"/></>}
 </div>;
}
function TagChip({children}:{children:ReactNode}){return <span className="inline-flex items-center rounded-full border border-als-red/15 bg-als-red/[0.06] px-3 py-1 text-xs font-bold text-als-red">{children}</span>;}
export function ArticleCard({article,variant="card"}:{article:Article;variant?:Variant}){
 const {t}=useI18n();
 if(variant==="featured")return <Card className="group overflow-hidden border-als-line bg-white shadow-xl transition hover:-translate-y-1 hover:border-als-red/25">
  <div className="relative p-6 md:p-8 lg:p-10"><div className="absolute inset-y-8 left-0 hidden w-1 rounded-r-full bg-als-red md:block"/>
   <div className="flex items-start gap-5"><ArticleMark article={article}/><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><Badge variant="navy">{article.category}</Badge>{article.tags.slice(0,3).map(tag=><TagChip key={tag}>{tag}</TagChip>)}</div>
    <p className="mt-6 text-xs font-bold uppercase text-als-red"><EditableI18nText contentKey="blog.card.featuredLabel" value={t.blog.featuredBlog}/></p>
    <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-als-blue md:text-5xl">{article.title}</h2>
   </div></div>
   <p className="mt-5 max-w-4xl text-base leading-8 text-als-muted">{article.excerpt}</p>
   <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-als-muted"><span className="inline-flex items-center gap-1.5"><UserRound size={14} className="text-als-red"/>{article.author.name}</span><span className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-als-red"/>{formatDate(article.date)}</span></div>
   <div className="mt-7 flex flex-wrap items-center gap-3"><Link href={"/blog/"+article.slug} className="inline-flex items-center gap-2 rounded-full bg-als-blue px-5 py-3 text-sm font-semibold text-white hover:bg-als-ink"><EditableI18nText contentKey="blog.card.readBlog" value={t.blog.readBlog}/><ArrowUpRight size={16}/></Link></div>
   <div className="mt-8 rounded-lg border border-als-line bg-als-blue-soft p-5"><p className="text-xs font-bold uppercase text-als-muted"><EditableI18nText contentKey="blog.card.abstractLabel" value={t.blog.abstract}/></p><p className="mt-3 text-sm leading-7 text-als-blue/80">{article.summary}</p>{article.citations.length>0&&<div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-als-muted"><Quote size={14} className="text-als-red"/>{article.citations.length} <EditableI18nText contentKey="blog.card.citationsLabel" value={t.blog.citations}/></div>}</div>
  </div>
 </Card>;
 if(variant==="index")return <article className="group rounded-lg border border-als-line bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-als-red/25 hover:shadow-xl"><div className="grid gap-5 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-center">
  <ArticleMark article={article}/><div className="min-w-0"><div className="flex flex-wrap gap-2"><Badge variant="navy">{article.category}</Badge>{article.tags.slice(0,2).map(tag=><TagChip key={tag}>{tag}</TagChip>)}</div><Link href={"/blog/"+article.slug} className="mt-3 block"><h3 className="text-xl font-black text-als-blue transition group-hover:text-als-red">{article.title}</h3></Link><p className="mt-3 max-w-3xl text-sm leading-7 text-als-muted">{article.summary}</p><div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-als-muted"><span className="inline-flex items-center gap-1"><UserRound size={14} className="text-als-red"/>{article.author.name}</span><span>{formatDate(article.date)}</span>{article.citations.length>0&&<span className="inline-flex items-center gap-1"><Quote size={13}/>{article.citations.length}</span>}</div></div>
  <Link href={"/blog/"+article.slug} className="inline-flex h-10 items-center gap-2 rounded-full border border-als-line px-4 text-sm font-bold text-als-red hover:bg-als-red/5"><EditableI18nText contentKey="blog.card.readBlog" value={t.blog.readBlog}/><ArrowRight size={16}/></Link>
 </div></article>;
 return <Card className="group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:border-als-red/20 hover:shadow-xl"><div className="p-5 pb-0"><div className="flex items-center justify-between gap-3"><ArticleMark article={article} size="sm"/><Badge variant="navy">{article.category}</Badge></div></div><div className="flex flex-1 flex-col p-5"><div className="flex flex-wrap gap-2">{article.tags.slice(0,2).map(tag=><TagChip key={tag}>{tag}</TagChip>)}</div><Link href={"/blog/"+article.slug} className="mt-4 block"><h3 className="text-lg font-bold text-als-blue transition group-hover:text-als-red">{article.title}</h3></Link><p className="mt-3 flex-1 text-sm leading-6 text-als-muted">{article.excerpt}</p><div className="mt-5 flex flex-wrap gap-3 text-xs text-als-muted"><span className="inline-flex items-center gap-1"><UserRound size={14}/>{article.author.name}</span><span>{formatDate(article.date)}</span></div><Link href={"/blog/"+article.slug} className="mt-5 inline-flex items-center gap-2 border-t border-als-line pt-4 text-sm font-semibold text-als-red"><EditableI18nText contentKey="blog.card.readMore" value={t.common.readMore}/><ArrowRight size={16}/></Link></div></Card>;
}
