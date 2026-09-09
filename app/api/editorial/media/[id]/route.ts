import { createSupabaseServerClient } from "@/lib/supabase/server";
import { idSchema } from "@/lib/cms/validation";
export const dynamic = "force-dynamic";
export async function GET(_request:Request, context:{params:Promise<{id:string}>}) {
  const {id}=await context.params;
  if(!idSchema.safeParse(id).success) return new Response(null,{status:404});
  // Session-scoped RLS authorizes admins or media referenced by a published post.
  const db=await createSupabaseServerClient();
  const {data:media}=await db.from("editorial_media").select("path,mime_type").eq("id",id).maybeSingle();
  if(!media) return new Response(null,{status:404,headers:{"Cache-Control":"no-store"}});
  const {data,error}=await db.storage.from("editorial-images").download(media.path);
  if(error || !data) return new Response(null,{status:404});
  return new Response(data,{headers:{"Content-Type":media.mime_type,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}
