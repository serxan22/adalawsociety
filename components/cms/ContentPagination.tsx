"use client";
import { ChevronLeft,ChevronRight } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
export function ContentPagination({page,total,pageSize,onChange}:{page:number;total:number;pageSize:number;onChange:(page:number)=>void}) {
  const {locale}=useI18n();const count=Math.ceil(total/pageSize);
  if(count<2)return null;
  const labels=locale==="az"?["Əvvəlki","Növbəti"]:locale==="ru"?["Назад","Далее"]:["Previous","Next"];
  return <nav className="mt-8 flex items-center justify-center gap-4 text-sm text-white" aria-label="Pagination">
    <button aria-label={labels[0]} disabled={page<=1} onClick={()=>onChange(page-1)} className="rounded-full border border-white/30 p-2 disabled:opacity-30"><ChevronLeft size={18}/></button>
    <span>{page} / {count}</span>
    <button aria-label={labels[1]} disabled={page>=count} onClick={()=>onChange(page+1)} className="rounded-full border border-white/30 p-2 disabled:opacity-30"><ChevronRight size={18}/></button>
  </nav>;
}
