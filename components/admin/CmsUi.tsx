"use client";
/* eslint-disable @next/next/no-img-element -- Private media checks access on every request. */
import { useEffect, useRef, type ReactNode } from "react";
import { X, ImageIcon, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export const fieldClass = "h-10 w-full rounded-lg border border-als-line bg-white px-3 text-sm text-als-ink focus:border-als-red focus:outline-none focus:ring-2 focus:ring-als-red/10";
export function Field({label,children}:{label:string;children:ReactNode}) { return <label className="grid gap-2 text-sm font-semibold text-als-ink"><span>{label}</span>{children}</label>; }
export function Notice({error,children}:{error?:boolean;children:ReactNode}) { return <p role={error?"alert":"status"} className={"rounded-lg border p-3 text-sm "+(error?"border-red-200 bg-red-50 text-red-800":"border-emerald-200 bg-emerald-50 text-emerald-900")}>{children}</p>; }
export function CmsDialog({title,children,onClose,wide=false}:{title:string;children:ReactNode;onClose:()=>void;wide?:boolean}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const el=ref.current;el?.showModal();return ()=>el?.close();},[]);
  return <dialog ref={ref} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}} className={"fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg bg-white p-5 text-als-ink shadow-2xl backdrop:bg-black/50 "+(wide?"max-w-6xl":"max-w-lg")} data-lenis-prevent>
    <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-lg font-bold">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-md p-2 hover:bg-als-blue-soft"><X size={20}/></button></div>{children}
  </dialog>;
}
export function StatusBadge({status}:{status:string}) { return <span className={"inline-flex rounded-md px-2 py-1 text-xs font-semibold capitalize "+(status==="published"?"bg-emerald-50 text-emerald-800":status==="draft"?"bg-als-blue-light text-als-blue-dark":"bg-als-red/10 text-als-red")}>{status}</span>; }
export async function cmsFetch<T>(url:string,init?:RequestInit):Promise<T> {
  const response=await fetch(url,{cache:"no-store",...init});
  const data=await response.json();
  if(!response.ok) throw new Error(data.error ?? "Request failed.");
  return data as T;
}
export function LoadingRows(){return <div role="status" aria-label="Loading content" className="grid gap-3">{[0,1,2].map(n=><div key={n} className="h-20 animate-pulse rounded-lg bg-als-blue-light"/>)}</div>;}
export function MediaField({value,onChange,label="Featured image"}:{value:string;onChange:(url:string)=>void;label?:string}) {
  const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [failed,setFailed]=useState("");const input=useRef<HTMLInputElement>(null);
  async function upload(file?:File) {
    if(!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5242880){setError("Choose a JPEG, PNG or WebP image up to 5 MB.");return;}
    setBusy(true);setError("");
    const form=new FormData();form.set("file",file);
    try{const result=await cmsFetch<{url:string}>("/api/admin/editorial/media/upload",{method:"POST",body:form});setFailed("");onChange(result.url);}
    catch(e){setError((e as Error).message);}finally{setBusy(false);if(input.current)input.current.value="";}
  }
  return <div className="space-y-3"><p className="text-sm font-semibold">{label}</p>
    <div className="grid aspect-[16/7] place-items-center overflow-hidden rounded-lg border border-dashed border-als-line bg-als-blue-soft">
	      {value&&failed!==value ? <img src={value} alt={label+" preview"} onError={()=>setFailed(value)} className="h-full w-full object-contain"/>:<div className="grid gap-2 text-center text-xs text-als-muted"><ImageIcon className="mx-auto" size={26}/>{value?"Preview unavailable":"No image selected"}</div>}
    </div>
    <div className="flex gap-2"><Button type="button" variant="secondary" size="sm" onClick={()=>input.current?.click()} disabled={busy}><Upload size={14}/>{busy?"Uploading...":value?"Replace":"Upload"}</Button>
	    {value && <Button type="button" variant="ghost" size="icon" onClick={()=>{setFailed("");onChange("");}} aria-label="Remove image"><Trash2 size={15}/></Button>}</div>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e=>void upload(e.target.files?.[0])}/>
    {error && <Notice error>{error}</Notice>}
  </div>;
}
