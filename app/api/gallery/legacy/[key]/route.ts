import heicConvert from "heic-convert";
import {createSupabaseAdminClient} from "@/lib/supabase/admin";
import {legacyStoragePath} from "@/lib/cms/gallery";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{key:string}>}){
 try{
  const key=(await params).key;
  if(!/^gallery\.image\.\d+$/.test(key))return new Response("Not found",{status:404});
  const db=createSupabaseAdminClient();
  const {data:row,error}=await db.from("content").select("value,type").eq("key",key).eq("type","image").maybeSingle();
  const path=row?legacyStoragePath(row.value):null;
  if(error||!path)return new Response("Not found",{status:404});
  const {data,error:downloadError}=await db.storage.from("site-images").download(path);
  if(downloadError||!data||data.size>25*1024*1024)return new Response("Image unavailable",{status:404});
  const source=Buffer.from(await data.arrayBuffer());
  const heic=/\.(heic|heif)$/i.test(path)||/hei[cf]/i.test(data.type);
  const body=heic?await heicConvert({buffer:source,format:"JPEG",quality:0.88}):source;
  return new Response(new Uint8Array(body),{headers:{"Content-Type":heic?"image/jpeg":data.type||"application/octet-stream","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }catch{return new Response("Image unavailable",{status:404});}
}
