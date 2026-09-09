"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { Plus,BookOpen,Newspaper } from "lucide-react";
import type { CmsPost } from "@/lib/cms/types";
import { cmsFetch,LoadingRows,Notice,StatusBadge } from "./CmsUi";
type Overview={totals:{total:number;published:number;draft:number;unpublished:number};recent:CmsPost[];published:CmsPost[]};
export function CmsOverview(){
  const[data,setData]=useState<Overview|null>(null);const[error,setError]=useState("");
  useEffect(()=>{const c=new AbortController();cmsFetch<Overview>("/api/admin/editorial/stats/all",{signal:c.signal}).then(setData).catch(e=>{if(e.name!=="AbortError")setError(e.message);});return()=>c.abort();},[]);
  return <div className="space-y-6"><div className="flex flex-wrap gap-3">
    <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-lg bg-als-red px-4 py-2.5 text-sm font-semibold text-white"><Plus size={18}/>Create New Post</Link>
    <Link href="/admin/news/new" className="inline-flex items-center gap-2 rounded-lg border border-als-line bg-white px-4 py-2.5 text-sm font-semibold"><Newspaper size={16}/>Create news</Link>
  </div>{error?<Notice error>{error}</Notice>:!data?<LoadingRows/>:<>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Object.entries(data.totals).map(([label,value])=><div key={label} className="rounded-lg border border-als-line bg-white p-5"><p className="text-xs font-semibold capitalize text-als-muted">{label} posts</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-2">{[["Recently created",data.recent],["Recently published",data.published]].map(([title,posts])=><section key={String(title)}><h2 className="mb-3 text-base font-bold">{String(title)}</h2><div className="divide-y divide-als-line rounded-lg border border-als-line bg-white">
      {(posts as CmsPost[]).length===0?<p className="p-5 text-sm text-als-muted">No posts yet.</p>:(posts as CmsPost[]).map(post=><Link key={post.content_type+post.id} href={"/admin/"+(post.content_type==="article"?"blog":"news")+"/"+post.id+"/edit"} className="flex items-center gap-3 p-4 hover:bg-als-blue-soft"><BookOpen size={18} className="shrink-0 text-als-red"/><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{post.title}</p><p className="mt-1 text-xs text-als-muted">{post.author?.full_name}</p></div><StatusBadge status={post.status}/></Link>)}
    </div></section>)}</div>
  </>}</div>;
}
