"use client";
/* eslint-disable @next/next/no-img-element -- Gallery files come from permission-checked media routes. */
import {Camera,ChevronLeft,ChevronRight,ImageOff,X,ZoomIn} from "lucide-react";
import {AnimatePresence,motion} from "framer-motion";
import {useCallback,useEffect,useRef,useState} from "react";
import {useI18n} from "@/components/providers/LanguageProvider";
import {Reveal} from "@/components/site/Reveal";
import {Badge} from "@/components/ui/badge";
import {PublicLibraryState} from "@/components/cms/PublicLibraryState";
import type {GalleryItem,GalleryResult} from "@/lib/cms/gallery-types";

export function GalleryPage({initial}:{initial:GalleryResult}){
 const {t}=useI18n();const copy=t.publication;
 const [active,setActive]=useState<number|null>(null);const [failed,setFailed]=useState<Set<string>>(new Set());
 const close=useCallback(()=>setActive(null),[]);
 const previous=useCallback(()=>setActive(i=>i===null?null:(i-1+initial.items.length)%initial.items.length),[initial.items.length]);
 const next=useCallback(()=>setActive(i=>i===null?null:(i+1)%initial.items.length),[initial.items.length]);
 const markFailed=(id:string)=>setFailed(current=>new Set(current).add(id));
 return <>
  <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-16 text-white md:py-20">
   <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true"/>
   <div className="container-wide relative text-center"><Reveal className="mx-auto max-w-4xl">
    <Badge variant="light" className="mx-auto gap-2"><Camera size={16}/>{copy.gallery}</Badge>
    <h1 className="mt-6 text-4xl font-black md:text-6xl">{copy.gallery}</h1>
    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/80 md:text-lg">{copy.galleryIntro}</p>
   </Reveal></div>
  </section>
  <section className="min-h-[28rem] bg-gradient-to-br from-[#3F6076] to-[#2F4C60] pb-20 pt-6">
   <div className="container-wide">
    {initial.items.length===0?<PublicLibraryState kind="gallery" unavailable={initial.unavailable}/>:
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
     {initial.items.map((item,index)=><Reveal key={item.id} delay={Math.min(index,8)*0.04}>
      <button type="button" onClick={()=>setActive(index)} aria-label={copy.viewImage+(item.caption?": "+item.caption:"")} className="group block w-full overflow-hidden rounded-lg border border-white/15 bg-white/5 text-left shadow-lg transition hover:-translate-y-1 hover:border-white/30">
       <span className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-[#2F4C60]">
        {!failed.has(item.id)?<img src={item.image_url} alt={item.alt_text||copy.imageAlt} onError={()=>markFailed(item.id)} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy"/>:
        <span className="grid gap-2 text-center text-sm text-white/70"><ImageOff className="mx-auto"/>{copy.imageError}</span>}
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"><ZoomIn size={17}/></span>
       </span>
       {item.caption&&<span className="block px-4 py-3 text-sm font-semibold text-white">{item.caption}</span>}
      </button>
     </Reveal>)}
    </div>}
   </div>
  </section>
  <AnimatePresence>{active!==null&&initial.items[active]&&<Lightbox item={initial.items[active]} position={active} total={initial.items.length} failed={failed.has(initial.items[active].id)} onFail={()=>markFailed(initial.items[active].id)} onClose={close} onPrevious={previous} onNext={next}/>}</AnimatePresence>
 </>;
}
function Lightbox({item,position,total,failed,onFail,onClose,onPrevious,onNext}:{item:GalleryItem;position:number;total:number;failed:boolean;onFail:()=>void;onClose:()=>void;onPrevious:()=>void;onNext:()=>void}){
 const {t}=useI18n();const c=t.publication;const dialog=useRef<HTMLDialogElement>(null);const closeButton=useRef<HTMLButtonElement>(null);
	 useEffect(()=>{
	  const previousFocus=document.activeElement as HTMLElement|null;const element=dialog.current;element?.showModal();closeButton.current?.focus();
  const previousOverflow=document.body.style.overflow;
  const key=(event:KeyboardEvent)=>{
   if(event.key==="ArrowLeft")onPrevious();if(event.key==="ArrowRight")onNext();
   if(event.key==="Tab"&&element){
    const controls=[...element.querySelectorAll<HTMLButtonElement>("button:not([disabled])")];
    const first=controls[0],last=controls.at(-1);
    // A one-control native dialog can otherwise tab to the document body.
    if(event.shiftKey?document.activeElement===first:document.activeElement===last){
     event.preventDefault();(event.shiftKey?last:first)?.focus();
    }
   }
  };
  document.addEventListener("keydown",key);document.body.style.overflow="hidden";
	  return()=>{document.removeEventListener("keydown",key);document.body.style.overflow=previousOverflow;element?.close();previousFocus?.focus();};
 },[onNext,onPrevious]);
 return <dialog ref={dialog} aria-label={c.gallery} data-lenis-prevent onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}} className="fixed inset-0 m-auto h-dvh w-screen max-w-none overflow-hidden bg-black/90 p-0 text-white backdrop:bg-black/90">
  <motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.98}} className="flex h-full flex-col p-3 sm:p-6" onClick={event=>event.stopPropagation()}>
   <div className="flex items-center justify-between gap-4 pb-3">
    <p className="truncate text-sm font-semibold">{item.caption||c.imageAlt} <span className="ml-2 text-white/55">{position+1} / {total}</span></p>
    <button ref={closeButton} type="button" onClick={onClose} aria-label={c.close} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 hover:bg-white/20"><X/></button>
   </div>
   <div className="relative min-h-0 flex-1">
    {failed?<div className="grid h-full place-items-center text-center text-white/70"><div><ImageOff className="mx-auto mb-3"/><p>{c.imageError}</p></div></div>:
    <img src={item.image_url} alt={item.alt_text||c.imageAlt} onError={onFail} className="h-full w-full object-contain"/>}
    {total>1&&<><button type="button" onClick={onPrevious} aria-label={c.previous} className="absolute left-1 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 hover:bg-black/70 sm:left-3"><ChevronLeft/></button>
    <button type="button" onClick={onNext} aria-label={c.next} className="absolute right-1 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 hover:bg-black/70 sm:right-3"><ChevronRight/></button></>}
   </div>
  </motion.div>
 </dialog>;
}
