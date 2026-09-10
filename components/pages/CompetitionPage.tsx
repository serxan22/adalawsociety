"use client";
import {CalendarDays,CheckCircle2,Lightbulb} from "lucide-react";
import {useI18n} from "@/components/providers/LanguageProvider";
import {Reveal,SectionHeading} from "@/components/site/Reveal";
import {Badge} from "@/components/ui/badge";
import {EditableImage} from "@/components/cms/EditableImage";
import {EditableI18nText} from "@/components/cms/EditableI18nText";
import type {Competition} from "@/data/competitions";
import {formatDate} from "@/lib/format";
export function CompetitionPage({competition}:{competition:Competition}){
 const {t}=useI18n();
 const title=competition.slug==="debate"?t.competitions.debateTitle:t.competitions.mootTitle;
 const intro=competition.slug==="debate"?t.competitions.debateIntro:t.competitions.mootIntro;
 return <>
  <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-20 text-white"><div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true"/><div className="container-wide relative grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center"><Reveal><Badge variant="light"><EditableI18nText contentKey="competitions.eyebrow" value={t.competitions.eyebrow}/></Badge><h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl"><EditableI18nText contentKey={"competitions."+competition.slug+".title"} value={title}/></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/80"><EditableI18nText contentKey={"competitions."+competition.slug+".intro"} value={intro}/></p></Reveal><Reveal delay={.08}><EditableImage contentKey={"competitions."+competition.slug+".image"} fallback={competition.image} alt={competition.title} width={800} height={600} className="aspect-[4/3] rounded-lg border border-white/10 object-cover shadow-2xl shadow-black/20"/></Reveal></div></section>
  <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]"><div className="container-wide"><div className="grid gap-4 md:grid-cols-4">{competition.pillars.map((pillar,index)=><Reveal key={pillar} delay={index*.04}><article className="h-full rounded-lg border border-als-line bg-white p-5 shadow-sm"><CheckCircle2 className="h-6 w-6 text-als-red"/><h2 className="mt-4 text-base font-bold leading-6 text-als-blue">{pillar}</h2></article></Reveal>)}</div></div></section>
  <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]"><div className="container-wide grid gap-10 lg:grid-cols-2">
   <div><SectionHeading title={<EditableI18nText contentKey="competitions.upcoming" value={t.competitions.upcoming}/>} className="[&_h2]:text-white"/>
    <div className="mt-8 grid gap-4">{competition.upcoming.length>0?competition.upcoming.map((event,index)=><Reveal key={event.title} delay={index*.04}><article className="rounded-lg border border-als-line bg-white p-5 shadow-sm">{event.date&&<p className="inline-flex items-center gap-2 text-sm font-semibold text-als-red"><CalendarDays size={16}/>{formatDate(event.date)}</p>}<h3 className="mt-3 text-xl font-bold text-als-blue">{event.title}</h3><p className="mt-3 text-sm leading-6 text-als-muted">{event.description}</p></article></Reveal>):<Reveal><article className="rounded-lg border border-als-line bg-white p-6 shadow-sm"><CalendarDays className="h-5 w-5 text-als-red"/><h3 className="mt-4 text-xl font-bold text-als-blue">{t.publication.eventsEmpty}</h3><p className="mt-3 text-sm leading-6 text-als-muted">{t.publication.eventsText}</p></article></Reveal>}</div>
   </div>
   <div><SectionHeading title={t.publication.skills} className="[&_h2]:text-white"/><div className="mt-8 grid gap-4">{competition.highlights.map((item,index)=><Reveal key={item} delay={index*.04}><div className="flex gap-3 rounded-lg border border-als-line bg-white p-5 shadow-sm"><Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-als-red"/><p className="text-sm leading-6 text-als-blue">{item}</p></div></Reveal>)}</div></div>
  </div></section>
  <section className="section-y relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] text-white"><div className="absolute inset-0 hero-grid opacity-[0.12]" aria-hidden="true"/><div className="container-wide"><SectionHeading title={<EditableI18nText contentKey="competitions.format" value={t.competitions.format}/>} text={<EditableI18nText contentKey="competitions.rulesIntro" value={t.competitions.rulesIntro}/>} align="center" className="[&_h2]:text-white [&_p]:text-white/75"/><div className="mt-10 grid gap-4 md:grid-cols-3">{competition.format.map((item,index)=><Reveal key={item} delay={index*.04}><article className="h-full rounded-lg border border-white/15 bg-white/10 p-6"><p className="text-sm font-bold text-white">0{index+1}</p><p className="mt-4 text-sm leading-7 text-white/80">{item}</p></article></Reveal>)}</div></div></section>
 </>;
}
