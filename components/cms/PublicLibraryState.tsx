"use client";
import { BookOpen, Newspaper, Images, RotateCcw } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
export function PublicLibraryState({kind,filtered=false,unavailable=false,onReset}:{kind:"blog"|"news"|"gallery";filtered?:boolean;unavailable?:boolean;onReset?:()=>void}) {
	 const {t}=useI18n(); const c=t.publication;
	 const Icon=kind==="blog"?BookOpen:kind==="news"?Newspaper:Images;
	 const emptyText=kind==="blog"?c.emptyBlogText:kind==="news"?c.emptyNewsText:c.emptyGalleryText;
 return <div role={unavailable?"alert":"status"} className="mx-auto max-w-xl rounded-lg border border-white/20 bg-white/5 px-6 py-9 text-center text-white">
   <Icon className="mx-auto mb-4 h-7 w-7 text-white/80" aria-hidden="true"/>
   <h2 className="text-xl font-bold">{unavailable?c.unavailable:filtered?c.noMatches:kind==="blog"?c.emptyBlog:kind==="news"?c.emptyNews:c.emptyGallery}</h2>
	   <p className="mt-3 text-sm leading-6 text-white/80">{unavailable?c.unavailableText:filtered?c.noMatchesText:emptyText}</p>
   {onReset&&(filtered||unavailable)&&<button type="button" onClick={onReset} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/10"><RotateCcw size={15}/>{unavailable?c.retry:c.reset}</button>}
 </div>;
}
