import "server-only";
import {createSupabaseAdminClient} from "@/lib/supabase/admin";
import {getSupabaseProjectUrl} from "@/lib/supabase/url";
import type {GalleryItem,GalleryResult} from "./gallery-types";

const columns="id,image_url,caption,alt_text,sort_order,status,legacy_key,updated_at";
export function legacyStoragePath(value:string){
 try{
  const url=new URL(value);const base=new URL(getSupabaseProjectUrl());
  if(url.origin!==base.origin)return null;
  const prefix="/storage/v1/object/public/site-images/";
  if(!url.pathname.startsWith(prefix))return null;
  const path=decodeURIComponent(url.pathname.slice(prefix.length));
  return path&&!path.includes("..")&&!path.startsWith("/")?path:null;
 }catch{return null;}
}
function legacyId(key:string){return "legacy:"+key;}
export async function getGallery(includeAll=false):Promise<GalleryResult&{schemaReady:boolean}>{
 try{
  const db=createSupabaseAdminClient();
  const [stored,content]=await Promise.all([
   db.from("gallery_items").select(columns).order("sort_order").order("created_at"),
   db.from("content").select("key,value,type").like("key","gallery.image.%").eq("type","image"),
	  ]);
	  if(stored.error&&content.error)throw new Error("Gallery sources unavailable");
	  const schemaReady=!stored.error;
  const rows=(stored.data??[]) as GalleryItem[];
  const suppressed=new Set(rows.map(r=>r.legacy_key).filter(Boolean));
  const legacy=(content.data??[]).filter(r=>legacyStoragePath(r.value)&&!suppressed.has(r.key)).map((r,index)=>({
   id:legacyId(r.key),image_url:"/api/gallery/legacy/"+encodeURIComponent(r.key),caption:"",alt_text:"",
   sort_order:10000+index,status:"published" as const,updated_at:"",legacy_key:r.key,
  }));
  const visible=includeAll?rows:rows.filter(r=>r.status==="published");
  return {items:[...visible,...legacy].sort((a,b)=>a.sort_order-b.sort_order),unavailable:false,schemaReady};
	 }catch{return {items:[],unavailable:true,schemaReady:false};}
}
