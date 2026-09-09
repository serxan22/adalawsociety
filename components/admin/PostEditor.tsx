"use client";
import Link from "next/link";
import { useEffect,useRef,useState } from "react";
import { useRouter } from "next/navigation";
import { Save,Eye,Plus,Trash2,ArrowLeft } from "lucide-react";
import type { CmsLookups,CmsPost,CmsPostInput } from "@/lib/cms/types";
import { emptyRichTextDocument,extractPlainText } from "@/lib/cms/rich-text";
import { slugify } from "@/lib/cms/slug";
import { toArticle,toNews } from "@/lib/cms/public-adapter";
import { BlogDetailPage } from "@/components/pages/BlogDetailPage";
import { NewsDetailPage } from "@/components/pages/NewsDetailPage";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./RichTextEditor";
import { CmsDialog,Field,LoadingRows,MediaField,Notice,cmsFetch,fieldClass } from "./CmsUi";

type Lookups=CmsLookups&{userId:string};
function fromPost(p:CmsPost):CmsPostInput{return {
  title:p.title,slug:p.slug,excerpt:p.excerpt,summary:p.summary,
  content:p.content_json??{type:"doc",content:[{type:"paragraph",content:[{type:"text",text:p.content||" "}]}]},
  citations:p.citations,coverImage:p.cover_image,authorId:p.author?.id??"",categoryId:p.category?.id??"",tagIds:p.tags.map(t=>t.id),
  status:p.status,publishedAt:p.published_at,updatedAt:p.updated_at,seoTitle:p.seo_title,seoDescription:p.seo_description,
  seoKeywords:p.seo_keywords,canonicalUrl:p.canonical_url,seoImage:p.seo_image,
};}
export function PostEditor({kind,id}:{kind:"blog"|"news";id?:string}) {
  const[data,setData]=useState<{lookups:Lookups;post:CmsPost|null}|null>(null);const[error,setError]=useState("");
  useEffect(()=>{const c=new AbortController();Promise.all([
    cmsFetch<Lookups>("/api/admin/editorial/lookups/all",{signal:c.signal}),
    id?cmsFetch<{post:CmsPost}>("/api/admin/editorial/"+kind+"/"+id,{signal:c.signal}):Promise.resolve({post:null}),
  ]).then(([lookups,result])=>setData({lookups,post:result.post})).catch(e=>{if(e.name!=="AbortError")setError(e.message);});return()=>c.abort();},[id,kind]);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => {
      cmsFetch<Lookups>("/api/admin/editorial/lookups/all", { signal: controller.signal })
        .then(lookups => setData(current => current ? { ...current, lookups } : current))
        .catch(() => { /* Keep current choices if background refresh fails. */ });
    };
    window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.removeEventListener("focus", refresh); };
  }, []);
  if(error)return <Notice error>{error}</Notice>;if(!data)return <LoadingRows/>;
  return <EditorForm key={id??"new"} kind={kind} initial={data.post} lookups={data.lookups}/>;
}
function EditorForm({kind,initial,lookups}:{kind:"blog"|"news";initial:CmsPost|null;lookups:Lookups}) {
  const router=useRouter();
  const blank:CmsPostInput={title:"",slug:"",excerpt:"",summary:"",content:emptyRichTextDocument,citations:[],coverImage:"",authorId:lookups.authors.find(a=>a.user_id===lookups.userId)?.id??"",categoryId:"",tagIds:[],status:"draft",seoKeywords:[]};
  const[form,setForm]=useState<CmsPostInput>(()=>initial?fromPost(initial):blank);
  const[id,setId]=useState(initial?.id);const[busy,setBusy]=useState(false);const[error,setError]=useState("");const[message,setMessage]=useState("");
  const[preview,setPreview]=useState(false);const[confirmPublish,setConfirmPublish]=useState(false);const[slugTouched,setSlugTouched]=useState(!!initial);
  const[savedSnapshot,setSavedSnapshot]=useState(()=>JSON.stringify(initial?fromPost(initial):blank));
  const dirty=JSON.stringify(form)!==savedSnapshot;const dirtyRef=useRef(dirty);
  useEffect(()=>{dirtyRef.current=dirty;},[dirty]);
  useEffect(()=>{
    const unload=(e:BeforeUnloadEvent)=>{if(dirtyRef.current){e.preventDefault();e.returnValue="";}};
    const navigate=(e:MouseEvent)=>{const a=(e.target as HTMLElement).closest("a");if(!dirtyRef.current||!a||a.target==="_blank"||a.getAttribute("href")?.startsWith("#"))return;if(!window.confirm("You have unsaved changes. Leave this editor?")){e.preventDefault();e.stopPropagation();}};
    window.addEventListener("beforeunload",unload);document.addEventListener("click",navigate,true);
    return()=>{window.removeEventListener("beforeunload",unload);document.removeEventListener("click",navigate,true);};
  },[]);
  function update<K extends keyof CmsPostInput>(key:K,value:CmsPostInput[K]){setForm(f=>({...f,[key]:value}));setMessage("");}
  async function save(){
    setBusy(true);setError("");setMessage("");setConfirmPublish(false);
    try {
      const {post}=await cmsFetch<{post:CmsPost}>("/api/admin/editorial/"+kind+(id?"/"+id:""),{method:id?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,seoKeywords:form.seoKeywords?.filter(Boolean)})});
      const next=fromPost(post);setForm(next);setSavedSnapshot(JSON.stringify(next));dirtyRef.current=false;setId(post.id);
      setMessage(post.status==="published"?"Published. This post is now visible on the website.":"Saved.");
      if(!id)router.replace("/admin/"+kind+"/"+post.id+"/edit");
    }catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  function submit(e:React.FormEvent){e.preventDefault();if(form.status==="published")setConfirmPublish(true);else void save();}
  const author=lookups.authors.find(a=>a.id===form.authorId)??null;
  const previewPost:CmsPost={id:id??"preview",content_type:kind==="blog"?"article":"news",title:form.title||"Untitled",slug:form.slug,
    summary:form.summary||form.excerpt,excerpt:form.excerpt,content:extractPlainText(form.content),content_json:form.content,citations:form.citations??[],cover_image:form.coverImage??null,
    media:[],status:form.status,published_at:form.publishedAt??null,created_at:initial?.created_at??new Date().toISOString(),updated_at:initial?.updated_at??new Date().toISOString(),
    author,category:lookups.categories.find(c=>c.id===form.categoryId)??null,tags:lookups.tags.filter(t=>form.tagIds?.includes(t.id)),seo_keywords:form.seoKeywords??[],
    updated_by:null,seo_title:form.seoTitle??null,seo_description:form.seoDescription??null,canonical_url:form.canonicalUrl??null,seo_image:form.seoImage??null,
  };
  const dateInput=form.publishedAt?new Date(new Date(form.publishedAt).getTime()-new Date(form.publishedAt).getTimezoneOffset()*60000).toISOString().slice(0,16):"";
  return <>
    <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
      <div className="sticky top-[5.25rem] z-20 flex flex-wrap items-center justify-between gap-3 border-y border-als-line bg-als-blue-soft/95 py-3 backdrop-blur">
        <Link href={"/admin/"+kind} className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={16}/>All posts</Link>
        <div className="flex items-center gap-2"><span className="hidden text-xs text-als-muted sm:block">{dirty?"Unsaved changes":"Saved"}</span><Button type="button" variant="secondary" onClick={()=>setPreview(true)} disabled={busy}><Eye size={16}/>Preview</Button><Button type="submit" disabled={busy}><Save size={16}/>{busy?"Saving...":form.status==="published"?"Save & publish":"Save changes"}</Button></div>
      </div>
      {error&&<Notice error>{error}</Notice>}{message&&<Notice>{message}</Notice>}
      <fieldset disabled={busy} className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-4 rounded-lg border border-als-line bg-white p-5">
            <Field label="Title"><input required maxLength={240} className={fieldClass+" h-12 text-lg font-semibold"} value={form.title} onChange={e=>{const title=e.target.value;setForm(f=>({...f,title,slug:slugTouched?f.slug:slugify(title)}));}}/></Field>
            <Field label="URL slug"><input required maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={fieldClass} value={form.slug} readOnly={!!initial?.published_at} onChange={e=>{setSlugTouched(true);update("slug",e.target.value);}}/></Field>
            {initial?.published_at&&<p className="text-xs text-als-muted">This published URL is preserved when the title changes.</p>}
            <Field label="Short description / excerpt"><textarea required maxLength={2000} className={fieldClass+" h-24 py-2 font-normal"} value={form.excerpt} onChange={e=>update("excerpt",e.target.value)}/></Field>
            {kind==="blog"&&<Field label="Author summary / abstract"><textarea required maxLength={8000} className={fieldClass+" h-28 py-2 font-normal"} value={form.summary??""} onChange={e=>update("summary",e.target.value)}/></Field>}
          </div>
          <div className={busy?"pointer-events-none opacity-70":""}><h2 className="mb-3 text-sm font-bold">Article content</h2><RichTextEditor value={form.content} onChange={content=>update("content",content)}/></div>
          {kind==="blog"&&<section className="space-y-3 rounded-lg border border-als-line bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Citations</h2><Button type="button" size="sm" variant="secondary" onClick={()=>update("citations",[...(form.citations??[]),{label:"",source:"",url:""}])}><Plus size={14}/>Add citation</Button></div>
            {(form.citations??[]).map((citation,index)=><div key={index} className="grid gap-2 border-t border-als-line pt-3 sm:grid-cols-2">{(["label","source","url"] as const).map(key=><Field label={key==="label"?"Title":key==="source"?"Source":"URL (optional)"} key={key}><input required={key!=="url"} className={fieldClass} value={citation[key]??""} onChange={e=>update("citations",form.citations?.map((c,i)=>i===index?{...c,[key]:e.target.value}:c))}/></Field>)}<Button type="button" variant="ghost" size="icon" aria-label="Remove citation" onClick={()=>update("citations",form.citations?.filter((_,i)=>i!==index))}><Trash2 size={16}/></Button></div>)}
          </section>}
          <details className="rounded-lg border border-als-line bg-white p-5"><summary className="cursor-pointer text-sm font-bold">Search & social metadata</summary><div className="mt-4 grid gap-4">
            <Field label="SEO title (optional, 70 characters)"><input maxLength={70} className={fieldClass} placeholder={form.title} value={form.seoTitle??""} onChange={e=>update("seoTitle",e.target.value)}/></Field>
            <Field label="SEO description (optional, 200 characters)"><textarea maxLength={200} className={fieldClass+" h-24 py-2"} placeholder={form.excerpt.slice(0,200)} value={form.seoDescription??""} onChange={e=>update("seoDescription",e.target.value)}/></Field>
            <Field label="Keywords (comma separated)"><input className={fieldClass} value={form.seoKeywords?.join(",")??""} onChange={e=>update("seoKeywords",e.target.value.split(","))}/></Field>
            <Field label="Canonical URL (optional)"><input className={fieldClass} placeholder="https://" value={form.canonicalUrl??""} onChange={e=>update("canonicalUrl",e.target.value)}/></Field>
            <MediaField label="Social sharing image (optional)" value={form.seoImage??""} onChange={v=>update("seoImage",v)}/>
          </div></details>
        </div>
        <aside className="space-y-5">
          <section className="space-y-4 rounded-lg border border-als-line bg-white p-5">
            <h2 className="text-sm font-bold">Publication</h2><Field label="Status"><select className={fieldClass} value={form.status} onChange={e=>update("status",e.target.value as CmsPostInput["status"])}><option value="draft">Draft</option><option value="published">Published</option><option value="unpublished">Unpublished</option></select></Field>
            <Field label="Publication date (optional)"><input type="datetime-local" className={fieldClass} value={dateInput} onChange={e=>update("publishedAt",e.target.value?new Date(e.target.value).toISOString():null)}/></Field>
            <Field label="Author"><select required className={fieldClass} value={form.authorId??""} onChange={e=>update("authorId",e.target.value)}><option value="">Select author</option>{lookups.authors.map(a=><option key={a.id} value={a.id}>{a.full_name}</option>)}</select></Field>
            {author&&<div className="border-l-2 border-als-red pl-3 text-xs leading-5 text-als-muted"><p className="font-semibold">{author.position}</p><p>{author.bio}</p></div>}
            <Link href="/admin/authors" target="_blank" className="text-xs font-semibold text-als-red">Manage author profiles</Link>
            <Field label="Category"><select required className={fieldClass} value={form.categoryId??""} onChange={e=>update("categoryId",e.target.value)}><option value="">Select category</option>{lookups.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Link href="/admin/categories" target="_blank" className="text-xs font-semibold text-als-red">Manage categories</Link>
          </section>
          <section className="rounded-lg border border-als-line bg-white p-5"><MediaField value={form.coverImage??""} onChange={v=>update("coverImage",v)}/></section>
          <section className="space-y-3 rounded-lg border border-als-line bg-white p-5"><h2 className="text-sm font-bold">Tags</h2><div className="grid max-h-56 gap-2 overflow-y-auto" data-lenis-prevent>{lookups.tags.length===0?<p className="text-xs text-als-muted">No tags yet.</p>:lookups.tags.map(t=><label className="flex items-center gap-2 text-sm" key={t.id}><input type="checkbox" checked={form.tagIds?.includes(t.id)??false} onChange={e=>update("tagIds",e.target.checked?[...(form.tagIds??[]),t.id]:form.tagIds?.filter(id=>id!==t.id))}/>{t.name}</label>)}</div><Link href="/admin/tags" target="_blank" className="text-xs font-semibold text-als-red">Manage tags</Link></section>
        </aside>
      </fieldset>
    </form>
    {confirmPublish&&<CmsDialog title="Publish this post?" onClose={()=>setConfirmPublish(false)}><p className="mb-5 text-sm">Saving will make this version visible to everyone.</p><div className="flex justify-end gap-2"><Button variant="secondary" onClick={()=>setConfirmPublish(false)}>Cancel</Button><Button onClick={()=>void save()}>Publish</Button></div></CmsDialog>}
    {preview&&<CmsDialog title="Preview (not published)" wide onClose={()=>setPreview(false)}>{kind==="blog"?<BlogDetailPage article={toArticle(previewPost)} related={[]} preview/>:<NewsDetailPage item={toNews(previewPost)} related={[]}/>}</CmsDialog>}
  </>;
}
