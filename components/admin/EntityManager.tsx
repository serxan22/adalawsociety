"use client";
import { useEffect,useState } from "react";
import { Plus,Pencil,Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CmsLookups } from "@/lib/cms/types";
import { slugify } from "@/lib/cms/slug";
import { CmsDialog,Field,LoadingRows,MediaField,Notice,cmsFetch,fieldClass } from "./CmsUi";
type Entity="authors"|"categories"|"tags";
type Form={id?:string;name:string;full_name:string;slug:string;description:string;bio:string;position:string;avatar_url:string;image_url:string;social_links:Record<string,string>;user_id:string|null};
const blank:Form={name:"",full_name:"",slug:"",description:"",bio:"",position:"",avatar_url:"",image_url:"",social_links:{},user_id:null};
export function EntityManager({entity}:{entity:Entity}) {
  const [data,setData]=useState<(CmsLookups&{userId:string;email:string})|null>(null);const [version,setVersion]=useState(0);
  const [form,setForm]=useState<Form|null>(null);const[error,setError]=useState("");const[message,setMessage]=useState("");const[busy,setBusy]=useState(false);const[remove,setRemove]=useState<{id:string;name:string}|null>(null);
  useEffect(()=>{const c=new AbortController();cmsFetch<CmsLookups&{userId:string;email:string}>("/api/admin/editorial/lookups/all",{signal:c.signal}).then(setData).catch(e=>{if(e.name!=="AbortError")setError(e.message);});return()=>c.abort();},[version]);
  async function save(e:React.FormEvent){
    e.preventDefault();if(!form)return;setBusy(true);setError("");
    try {const payload={...form,social_links:Object.fromEntries(Object.entries(form.social_links).filter(([,v])=>v.trim()))};await cmsFetch("/api/admin/editorial/entities/"+entity,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});setForm(null);setVersion(v=>v+1);setMessage("Saved.");}
    catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  async function deleteItem(){if(!remove)return;setBusy(true);setError("");try{await cmsFetch("/api/admin/editorial/entities/"+entity,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:remove.id})});setRemove(null);setVersion(v=>v+1);setMessage("Deleted.");}catch(e){setRemove(null);setError((e as Error).message);}finally{setBusy(false);}}
  function change(key:keyof Form,value:string|null){setForm(f=>f?{...f,[key]:value}:null);}
  const singular=entity==="authors"?"author":entity==="categories"?"category":"tag";
  return <div className="space-y-5"><div className="flex justify-end"><Button onClick={()=>{setForm({...blank});setError("");}}><Plus size={17}/>Create {singular}</Button></div>
    {error&&!form&&<Notice error>{error}</Notice>}{message&&<Notice>{message}</Notice>}
    {!data&&!error?<LoadingRows/>:data&&<div className="divide-y divide-als-line rounded-lg border border-als-line bg-white">{data[entity].length===0?<p className="p-8 text-center text-sm text-als-muted">No {entity} yet.</p>:data[entity].map(item=>{
      const name="full_name" in item?item.full_name:item.name;
      return <div className="flex items-center gap-4 p-4" key={item.id}><div className="min-w-0 flex-1"><p className="font-semibold">{name}{"user_id" in item&&item.user_id===data.userId&&<span className="ml-2 text-xs font-normal text-als-red">Your profile</span>}</p><p className="mt-1 text-sm text-als-muted">{"position" in item?item.position:"slug" in item?item.slug:""}</p></div>
      <button className="rounded p-2 hover:bg-als-blue-soft" aria-label={"Edit "+name} title="Edit" onClick={()=>{setForm({...blank,...item} as Form);setError("");}}><Pencil size={16}/></button><button className="rounded p-2 text-als-red hover:bg-als-red/10" aria-label={"Delete "+name} title="Delete" onClick={()=>setRemove({id:item.id,name})}><Trash2 size={16}/></button></div>;
    })}</div>}
    {form&&<CmsDialog title={(form.id?"Edit ":"Create ")+singular} onClose={()=>!busy&&setForm(null)}><form onSubmit={save} className="space-y-4">
      {entity==="authors"?<>
        <Field label="Full name"><input required maxLength={240} className={fieldClass} value={form.full_name} onChange={e=>change("full_name",e.target.value)}/></Field>
        <Field label="Position / title"><input maxLength={150} className={fieldClass} value={form.position??""} onChange={e=>change("position",e.target.value)}/></Field>
        <Field label="Biography"><textarea className={fieldClass+" h-28 py-2"} maxLength={3000} value={form.bio??""} onChange={e=>change("bio",e.target.value)}/></Field>
        <MediaField value={form.avatar_url??""} onChange={v=>change("avatar_url",v)} label="Author photo"/>
        {(!form.user_id||form.user_id===data?.userId)&&<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.user_id===data?.userId} onChange={e=>change("user_id",e.target.checked?data?.userId??null:null)}/>Link to my admin account</label>}
        {["LinkedIn","Website","Instagram"].map(label=><Field label={label+" URL (optional)"} key={label}><input className={fieldClass} value={form.social_links?.[label]??""} onChange={e=>setForm(f=>f?{...f,social_links:{...f.social_links,[label]:e.target.value}}:null)} placeholder="https://"/></Field>)}
      </>:<>
        <Field label="Name"><input required maxLength={entity==="tags"?80:240} className={fieldClass} value={form.name} onChange={e=>{const value=e.target.value;setForm(f=>f?{...f,name:value,slug:f.id?f.slug:slugify(value)}:null);}}/></Field>
        <Field label="Slug"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={120} className={fieldClass} value={form.slug} onChange={e=>change("slug",e.target.value)}/></Field>
        {entity==="categories"&&<Field label="Description"><textarea className={fieldClass+" h-24 py-2"} maxLength={1000} value={form.description??""} onChange={e=>change("description",e.target.value)}/></Field>}
      </>}
      {error&&<Notice error>{error}</Notice>}<div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={()=>setForm(null)} disabled={busy}>Cancel</Button><Button type="submit" disabled={busy}>{busy?"Saving...":"Save"}</Button></div>
    </form></CmsDialog>}
    {remove&&<CmsDialog title={"Delete "+singular+"?"} onClose={()=>!busy&&setRemove(null)}><p className="mb-5 text-sm">Delete <strong>{remove.name}</strong>? Authors and categories used by posts cannot be deleted.</p><div className="flex justify-end gap-2"><Button variant="secondary" disabled={busy} onClick={()=>setRemove(null)}>Cancel</Button><Button disabled={busy} onClick={()=>void deleteItem()}>{busy?"Deleting...":"Delete"}</Button></div></CmsDialog>}
  </div>;
}
