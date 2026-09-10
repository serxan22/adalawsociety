"use client";
import { useEffect,useState } from "react";
import type { PublishedResult } from "@/lib/cms/public-types";
export type { PublishedResult } from "@/lib/cms/public-types";
export function usePublishedContent<T>(kind:"blog"|"news",initial:PublishedResult<T>,query:string,category:string,author="All") {
 const key=JSON.stringify([query,category,author]);
 const [pager,setPager]=useState({key,page:1}); const page=pager.key===key?pager.page:1;
 const [revision,setRevision]=useState(0);
 const [result,setResult]=useState({key:JSON.stringify(["","All","All"]),page:1,data:initial});
 useEffect(()=>{
  const controller=new AbortController();
  const timer=setTimeout(()=>{
   fetch("/api/editorial/"+kind+"?"+new URLSearchParams({q:query,category,author,page:String(page)}),{signal:controller.signal,cache:"no-store"})
    .then(async r=>{if(!r.ok)throw new Error("Unavailable");return r.json() as Promise<PublishedResult<T>>;})
    .then(data=>setResult({key,page,data}))
    .catch(e=>{if(e.name!=="AbortError")setResult(current=>({...current,key,page,data:{...current.data,posts:[],unavailable:true}}));});
  },250);
  return()=>{clearTimeout(timer);controller.abort();};
 },[kind,query,category,author,page,key,revision]);
 return {...result.data,loading:result.key!==key||result.page!==page,page,retry:()=>setRevision(r=>r+1),setPage:(next:number)=>setPager({key,page:next})};
}
