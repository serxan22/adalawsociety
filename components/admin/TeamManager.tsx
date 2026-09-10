"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {Search,Upload,Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {teamPhotoRecords} from "@/lib/cms/team-records";
import type {TeamPhoto} from "@/lib/cms/gallery-types";
import {CmsDialog,LoadingRows,MediaField,Notice,cmsFetch,fieldClass} from "./CmsUi";
import {MemberAvatar} from "@/components/team/MemberAvatar";
const fetchPhotos=()=>cmsFetch<{photos:TeamPhoto[];schemaReady:boolean}>("/api/admin/team/photos");
export function TeamManager(){
 const [photos,setPhotos]=useState<TeamPhoto[]>([]);const[loading,setLoading]=useState(true);const[schemaReady,setSchemaReady]=useState(true);const[error,setError]=useState("");const[message,setMessage]=useState("");
 const[query,setQuery]=useState("");const[year,setYear]=useState("All");const[editing,setEditing]=useState<(typeof teamPhotoRecords)[number]|null>(null);const[image,setImage]=useState("");
 const[removing,setRemoving]=useState<(typeof teamPhotoRecords)[number]|null>(null);const[busy,setBusy]=useState(false);
 const load=useCallback(async()=>{try{const r=await fetchPhotos();setPhotos(r.photos);setSchemaReady(r.schemaReady);setError("");}catch(e){setError((e as Error).message);}finally{setLoading(false);}},[]);
 useEffect(()=>{let active=true;fetchPhotos().then(r=>{if(active){setPhotos(r.photos);setSchemaReady(r.schemaReady);setError("");}}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 const byKey=useMemo(()=>Object.fromEntries(photos.map(p=>[p.member_key,p.image_url])),[photos]);
 const records=teamPhotoRecords.filter(r=>(year==="All"||r.year===year)&&(!query||[r.name,r.role,r.group,r.year].join(" ").toLowerCase().includes(query.toLowerCase())));
 function open(record:(typeof teamPhotoRecords)[number]){setEditing(record);setImage(byKey[record.id]??"");setMessage("");setError("");}
 async function save(){if(!editing||!image)return;setBusy(true);try{await cmsFetch("/api/admin/team/photos/"+encodeURIComponent(editing.id),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({imageUrl:image})});setEditing(null);setMessage("Profile photo saved.");window.dispatchEvent(new Event("als-team-photo-change"));load();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function remove(){if(!removing)return;setBusy(true);try{await cmsFetch("/api/admin/team/photos/"+encodeURIComponent(removing.id),{method:"DELETE"});setRemoving(null);setMessage("Profile photo removed. The member record and historical role were preserved.");window.dispatchEvent(new Event("als-team-photo-change"));load();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <div className="space-y-5">
  <p className="max-w-3xl text-sm leading-6 text-als-muted">Photos are attached to an exact year-specific member record. Names, roles, years, and committee assignments are read-only here.</p>
  {!schemaReady&&<Notice error>Apply migration 004_gallery_team_media.sql before editing team photos.</Notice>}
  <div className="grid gap-3 rounded-lg border border-als-line bg-white p-4 sm:grid-cols-[1fr_14rem]"><label className="relative"><Search className="absolute left-3 top-3 text-als-muted" size={16}/><input className={fieldClass+" pl-9"} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search team records" aria-label="Search team records"/></label><select className={fieldClass} value={year} onChange={e=>setYear(e.target.value)} aria-label="Filter by team year"><option>All</option>{[...new Set(teamPhotoRecords.map(r=>r.year))].map(y=><option key={y}>{y}</option>)}</select></div>
  {error&&<Notice error>{error}</Notice>}{message&&<Notice>{message}</Notice>}
  {loading?<LoadingRows/>:<div className="overflow-hidden rounded-lg border border-als-line bg-white"><div className="divide-y divide-als-line">
   {records.map(record=>{const src=byKey[record.id];return <article key={record.id} className="grid gap-4 p-4 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-center">
	    <MemberAvatar id={record.id} name={record.name} image={src??""} compact/>
    <div className="min-w-0"><h2 className="font-bold text-als-ink">{record.name}</h2><p className="mt-1 text-sm text-als-muted">{record.role} · {record.year}</p></div>
    <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={()=>open(record)} disabled={!schemaReady}><Upload size={14}/>{src?"Replace":"Upload"}</Button>{src&&<Button variant="ghost" size="icon" onClick={()=>setRemoving(record)} disabled={!schemaReady} aria-label={"Remove photo for "+record.name}><Trash2 size={15}/></Button>}</div>
   </article>;})}
  </div>{records.length===0&&<p className="p-8 text-center text-sm text-als-muted">No team records match these filters.</p>}</div>}
  {editing&&<CmsDialog title={"Profile photo · "+editing.name} onClose={()=>!busy&&setEditing(null)}><div className="space-y-4"><div className="rounded-lg bg-als-blue-soft p-3 text-sm"><strong>{editing.role}</strong><span className="text-als-muted"> · {editing.year}</span></div><MediaField label="Portrait" value={image} onChange={setImage}/><p className="text-xs leading-5 text-als-muted">Use a clear portrait in JPEG, PNG, or WebP format. The full image is preserved with contain fitting.</p><div className="flex justify-end gap-2"><Button variant="secondary" onClick={()=>setEditing(null)}>Cancel</Button><Button onClick={()=>void save()} disabled={busy||!image}>{busy?"Saving...":"Save photo"}</Button></div></div></CmsDialog>}
  {removing&&<CmsDialog title="Remove profile photo?" onClose={()=>setRemoving(null)}><p className="text-sm text-als-muted">This removes only the photo reference for {removing.name}. Their year-specific role remains unchanged.</p><div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={()=>setRemoving(null)}>Cancel</Button><Button onClick={()=>void remove()} disabled={busy}>{busy?"Removing...":"Remove photo"}</Button></div></CmsDialog>}
 </div>;
}
