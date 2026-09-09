"use client";
/* eslint-disable @next/next/no-img-element -- Private media checks access on every request. */
import Link from "next/link";
import { useEffect,useState } from "react";
import { Plus,Search,Pencil,Copy,Trash2,Eye,EyeOff,ImageIcon,ChevronLeft,ChevronRight } from "lucide-react";
import type { CmsLookups,CmsPaginatedPosts,CmsPost } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { CmsDialog,LoadingRows,Notice,StatusBadge,cmsFetch,fieldClass } from "./CmsUi";

export function PostsManager({kind}:{kind:"blog"|"news"}) {
  const[filters,setFilters]=useState({q:"",status:"",author:"",category:"",sort:"newest",page:1});
  const[data,setData]=useState<CmsPaginatedPosts|null>(null);const[lookups,setLookups]=useState<CmsLookups>({authors:[],categories:[],tags:[]});
  const[error,setError]=useState("");const[message,setMessage]=useState("");const[busy,setBusy]=useState(false);const[version,setVersion]=useState(0);
  const[confirm,setConfirm]=useState<{post:CmsPost;action:string}|null>(null);
  useEffect(()=>{const c=new AbortController();cmsFetch<CmsLookups>("/api/admin/editorial/lookups/all",{signal:c.signal}).then(setLookups).catch(e=>{if(e.name!=="AbortError")setError(e.message);});return()=>c.abort();},[]);
  useEffect(()=>{
    const c=new AbortController();const timer=setTimeout(()=>{
      const params=new URLSearchParams({...filters,page:String(filters.page)});
      cmsFetch<CmsPaginatedPosts>("/api/admin/editorial/"+kind+"?"+params,{signal:c.signal}).then(r=>{setData(r);setError("");}).catch(e=>{if(e.name!=="AbortError")setError(e.message);});
    },200);return()=>{c.abort();clearTimeout(timer);};
  },[filters,kind,version]);
  function filter(key:string,value:string){setFilters(f=>({...f,[key]:value,page:1}));}
  async function action(post:CmsPost,name:string){
    setBusy(true);setError("");setMessage("");
    try{
      await cmsFetch("/api/admin/editorial/"+kind+"/"+post.id,{method:name==="delete"?"DELETE":"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:name,updatedAt:post.updated_at})});
      setMessage(name==="delete"?"Post deleted.":name==="duplicate"?"Draft copy created.":name==="publish"?"Post published.":"Post unpublished.");
      setConfirm(null);setVersion(v=>v+1);
    }catch(e){setError((e as Error).message);setConfirm(null);}finally{setBusy(false);}
  }
  const date=(value:string|null)=>value?new Date(value).toLocaleDateString("en-GB"):"—";
  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row"><p className="text-sm text-als-muted">{data?data.total+" posts":"Content library"}</p><Link href={"/admin/"+kind+"/new"} className="inline-flex items-center justify-center gap-2 rounded-lg bg-als-red px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17}/>Create New Post</Link></div>
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1.4fr_repeat(4,1fr)]">
      <label className="relative"><Search size={16} className="absolute left-3 top-3 text-als-muted"/><input aria-label="Search posts" className={fieldClass+" pl-9"} value={filters.q} onChange={e=>filter("q",e.target.value)} placeholder="Search posts"/></label>
      <select aria-label="Status filter" className={fieldClass} value={filters.status} onChange={e=>filter("status",e.target.value)}><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="unpublished">Unpublished</option></select>
      <select aria-label="Category filter" className={fieldClass} value={filters.category} onChange={e=>filter("category",e.target.value)}><option value="">All categories</option>{lookups.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select aria-label="Author filter" className={fieldClass} value={filters.author} onChange={e=>filter("author",e.target.value)}><option value="">All authors</option>{lookups.authors.map(a=><option key={a.id} value={a.id}>{a.full_name}</option>)}</select>
      <select aria-label="Sort posts" className={fieldClass} value={filters.sort} onChange={e=>filter("sort",e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select>
    </div>
    {error&&<Notice error>{error}</Notice>}{message&&<Notice>{message}</Notice>}
    {!data&&!error?<LoadingRows/>:data&&<div className="overflow-x-auto rounded-lg border border-als-line bg-white">
      <table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-als-line bg-als-blue-soft text-xs text-als-muted"><tr>{["Post","Author / category","Status","Created","Published","Updated","Actions"].map(s=><th className="px-4 py-3 font-semibold" key={s}>{s}</th>)}</tr></thead>
      <tbody className="divide-y divide-als-line">{data.posts.map(post=><tr key={post.id} className="hover:bg-als-blue-soft/50">
        <td className="max-w-72 px-4 py-4"><div className="flex items-center gap-3"><div className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded bg-als-blue-light">{post.cover_image?<img src={post.cover_image} alt="" className="h-full w-full object-cover"/>:<ImageIcon size={19} className="text-als-muted"/>}</div><Link href={"/admin/"+kind+"/"+post.id+"/edit"} className="font-semibold hover:text-als-red">{post.title}</Link></div></td>
        <td className="px-4 py-4"><p>{post.author?.full_name??"Unassigned"}</p><p className="mt-1 text-xs text-als-muted">{post.category?.name??"Uncategorized"}</p></td>
        <td className="px-4 py-4"><StatusBadge status={post.status}/></td><td className="whitespace-nowrap px-4 py-4 text-xs">{date(post.created_at)}</td><td className="whitespace-nowrap px-4 py-4 text-xs">{date(post.published_at)}</td><td className="whitespace-nowrap px-4 py-4 text-xs">{date(post.updated_at)}</td>
        <td className="px-4 py-4"><div className="flex gap-1"><Link href={"/admin/"+kind+"/"+post.id+"/edit"} aria-label={"Edit "+post.title} title="Edit" className="rounded p-2 hover:bg-als-blue-light"><Pencil size={16}/></Link>
          <button disabled={busy} aria-label={"Duplicate "+post.title} title="Duplicate" onClick={()=>void action(post,"duplicate")} className="rounded p-2 hover:bg-als-blue-light"><Copy size={16}/></button>
          <button disabled={busy} aria-label={(post.status==="published"?"Unpublish ":"Publish ")+post.title} title={post.status==="published"?"Unpublish":"Publish"} onClick={()=>setConfirm({post,action:post.status==="published"?"unpublish":"publish"})} className="rounded p-2 hover:bg-als-blue-light">{post.status==="published"?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          <button disabled={busy} aria-label={"Delete "+post.title} title="Delete" onClick={()=>setConfirm({post,action:"delete"})} className="rounded p-2 text-als-red hover:bg-als-red/10"><Trash2 size={16}/></button>
        </div></td>
      </tr>)}</tbody></table>{data.posts.length===0&&<p className="p-8 text-center text-sm text-als-muted">No posts match these filters.</p>}
    </div>}
    {data&&data.total>data.pageSize&&<div className="flex items-center justify-end gap-3 text-sm"><Button variant="secondary" size="icon" disabled={filters.page<=1} aria-label="Previous page" onClick={()=>setFilters(f=>({...f,page:f.page-1}))}><ChevronLeft size={17}/></Button><span>{filters.page} / {Math.ceil(data.total/data.pageSize)}</span><Button variant="secondary" size="icon" disabled={filters.page*data.pageSize>=data.total} aria-label="Next page" onClick={()=>setFilters(f=>({...f,page:f.page+1}))}><ChevronRight size={17}/></Button></div>}
    {confirm&&<CmsDialog title={confirm.action[0].toUpperCase()+confirm.action.slice(1)+" post?"} onClose={()=>!busy&&setConfirm(null)}><p className="mb-5 text-sm leading-6">{confirm.action==="delete"?"This permanently deletes ":"This changes the public visibility of "}<strong>{confirm.post.title}</strong>.</p><div className="flex justify-end gap-2"><Button variant="secondary" onClick={()=>setConfirm(null)} disabled={busy}>Cancel</Button><Button disabled={busy} onClick={()=>void action(confirm.post,confirm.action)}>{busy?"Working...":"Confirm"}</Button></div></CmsDialog>}
  </div>;
}
