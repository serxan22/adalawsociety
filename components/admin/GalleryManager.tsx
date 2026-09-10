"use client";
/* eslint-disable @next/next/no-img-element -- Admin previews private media served by app routes. */
import {useCallback,useEffect,useState} from "react";
import {ArrowDownUp,ImageOff,ImagePlus,Pencil,Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import type {GalleryItem} from "@/lib/cms/gallery-types";
import {CmsDialog,Field,LoadingRows,MediaField,Notice,cmsFetch,fieldClass,StatusBadge} from "./CmsUi";
type Form={imageUrl:string;caption:string;altText:string;sortOrder:number;status:"draft"|"published"|"unpublished";legacyKey:string|null};
const blank:Form={imageUrl:"",caption:"",altText:"",sortOrder:0,status:"draft",legacyKey:null};
const fetchGallery=()=>cmsFetch<{items:GalleryItem[];schemaReady:boolean}>("/api/admin/gallery");
export function GalleryManager(){
 const [items,setItems]=useState<GalleryItem[]>([]);const[loading,setLoading]=useState(true);const[schemaReady,setSchemaReady]=useState(true);
 const[form,setForm]=useState<Form|null>(null);const[editing,setEditing]=useState<string|null>(null);const[removing,setRemoving]=useState<GalleryItem|null>(null);
 const[busy,setBusy]=useState(false);const[error,setError]=useState("");const[message,setMessage]=useState("");
 const load=useCallback(async()=>{try{const r=await fetchGallery();setItems(r.items);setSchemaReady(r.schemaReady);setError("");}catch(e){setError((e as Error).message);}finally{setLoading(false);}},[]);
 useEffect(()=>{let active=true;fetchGallery().then(r=>{if(active){setItems(r.items);setSchemaReady(r.schemaReady);setError("");}}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 function open(item?:GalleryItem){setEditing(item?.id??null);setForm(item?{imageUrl:item.image_url,caption:item.caption,altText:item.alt_text,sortOrder:item.sort_order,status:item.status,legacyKey:item.legacy_key??null}:{...blank,sortOrder:(items.at(-1)?.sort_order??0)+10});setError("");setMessage("");}
 async function save(){
  if(!form)return;setBusy(true);setError("");try{
   const url=editing?"/api/admin/gallery/"+encodeURIComponent(editing):"/api/admin/gallery";
   await cmsFetch(url,{method:editing?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
   setForm(null);setEditing(null);setMessage("Gallery item saved.");load();
  }catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 async function remove(){
  if(!removing)return;setBusy(true);setError("");try{
   await cmsFetch("/api/admin/gallery/"+encodeURIComponent(removing.id),{method:"DELETE"});
   setRemoving(null);setMessage(removing.legacy_key?"Image unpublished. Its original file was preserved.":"Gallery item removed. The stored file was preserved in case another record references it.");load();
  }catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 return <div className="space-y-5">
  <div className="flex flex-wrap items-center justify-between gap-3"><p className="max-w-2xl text-sm text-als-muted">Publish genuine ALS photos with accurate captions and alt text. Display order is controlled by the order number.</p><Button onClick={()=>open()} disabled={!schemaReady}><ImagePlus size={16}/>Upload image</Button></div>
  {!schemaReady&&<Notice error>Apply migration 004_gallery_team_media.sql before editing Gallery records. Existing uploaded files remain untouched.</Notice>}
  {error&&<Notice error>{error}</Notice>}{message&&<Notice>{message}</Notice>}
  {loading?<LoadingRows/>:items.length===0?<div className="rounded-lg border border-dashed border-als-line bg-white p-10 text-center text-sm text-als-muted">No Gallery records yet.</div>:
  <div className="overflow-hidden rounded-lg border border-als-line bg-white"><div className="divide-y divide-als-line">
   {items.map(item=><article key={item.id} className="grid gap-4 p-4 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center">
    <GalleryPreview src={item.image_url} alt={item.alt_text}/>
    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><StatusBadge status={item.status}/><span className="inline-flex items-center gap-1 text-xs text-als-muted"><ArrowDownUp size={12}/>Order {item.sort_order}</span></div><h2 className="mt-2 truncate font-bold text-als-ink">{item.caption||"Untitled photo"}</h2><p className="mt-1 truncate text-sm text-als-muted">{item.alt_text||"Alt text required before publishing"}</p></div>
    <div className="flex gap-2"><Button size="sm" variant="secondary" onClick={()=>open(item)} disabled={!schemaReady}><Pencil size={14}/>Edit</Button><Button size="sm" variant="ghost" onClick={()=>setRemoving(item)} disabled={!schemaReady} aria-label={"Remove "+(item.caption||"photo")}><Trash2 size={15}/></Button></div>
   </article>)}
  </div></div>}
  {form&&<CmsDialog title={editing?"Edit gallery item":"Add gallery item"} onClose={()=>!busy&&setForm(null)}><div className="space-y-4">
   <MediaField label="Gallery image" value={form.imageUrl} onChange={imageUrl=>setForm(v=>v?{...v,imageUrl,legacyKey:imageUrl.startsWith("/api/gallery/legacy/")?v.legacyKey:null}:v)}/>
   <Field label="Caption (optional)"><input maxLength={500} className={fieldClass} value={form.caption} onChange={e=>setForm(v=>v?{...v,caption:e.target.value}:v)}/></Field>
   <Field label="Alt text"><textarea required maxLength={500} className={fieldClass+" h-24 py-2"} value={form.altText} onChange={e=>setForm(v=>v?{...v,altText:e.target.value}:v)}/></Field>
   <div className="grid gap-4 sm:grid-cols-2"><Field label="Display order"><input type="number" className={fieldClass} value={form.sortOrder} onChange={e=>setForm(v=>v?{...v,sortOrder:Number(e.target.value)}:v)}/></Field><Field label="Status"><select className={fieldClass} value={form.status} onChange={e=>setForm(v=>v?{...v,status:e.target.value as Form["status"]}:v)}><option value="draft">Draft</option><option value="published">Published</option><option value="unpublished">Unpublished</option></select></Field></div>
   <div className="flex justify-end gap-2"><Button variant="secondary" onClick={()=>setForm(null)} disabled={busy}>Cancel</Button><Button onClick={()=>void save()} disabled={busy||!form.imageUrl||form.altText.trim().length<2}>{busy?"Saving...":"Save"}</Button></div>
  </div></CmsDialog>}
  {removing&&<CmsDialog title={removing.legacy_key?"Unpublish this photo?":"Remove this gallery item?"} onClose={()=>setRemoving(null)}><p className="text-sm leading-6 text-als-muted">The original stored file will not be deleted. This prevents accidental removal when a file is referenced elsewhere.</p><div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={()=>setRemoving(null)}>Cancel</Button><Button onClick={()=>void remove()} disabled={busy}>{busy?"Working...":removing.legacy_key?"Unpublish":"Remove"}</Button></div></CmsDialog>}
 </div>;
}
function GalleryPreview({src,alt}:{src:string;alt:string}){
 const[failed,setFailed]=useState(false);
 return <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-md bg-als-blue-soft">{failed?<ImageOff className="text-als-muted" aria-label="Image preview unavailable"/>:<img src={src} alt={alt} onError={()=>setFailed(true)} className="h-full w-full object-cover"/>}</div>;
}
