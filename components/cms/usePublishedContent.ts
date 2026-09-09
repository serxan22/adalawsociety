"use client";
import { useEffect,useState } from "react";
import { cmsFetch } from "@/components/admin/CmsUi";
export type PublishedResult<T>={posts:T[];total:number;page:number;pageSize:number;categories:string[];authors:string[]};
export function usePublishedContent<T>(kind:"blog"|"news",initial:PublishedResult<T>,query:string,category:string,author="All") {
  const key=JSON.stringify([query,category,author]);
  const [pager,setPager]=useState({key,page:1});
  const page=pager.key===key?pager.page:1;
  const [result,setResult]=useState({key:JSON.stringify(["","All","All"]),page:1,data:initial,error:""});
  useEffect(()=>{
    const controller=new AbortController();
    const timer=setTimeout(()=>{
      const params=new URLSearchParams({q:query,category,author,page:String(page)});
      cmsFetch<PublishedResult<T>>("/api/editorial/"+kind+"?"+params,{signal:controller.signal})
        .then(data=>setResult({key,page,data,error:""}))
        .catch(e=>{if(e.name!=="AbortError")setResult(current=>({...current,key,page,error:e.message}));});
    },250);
    return ()=>{clearTimeout(timer);controller.abort();};
  },[kind,query,category,author,page,key]);
  return {...result.data,loading:result.key!==key||result.page!==page,error:result.error,page,
    setPage:(next:number)=>setPager({key,page:next})};
}
