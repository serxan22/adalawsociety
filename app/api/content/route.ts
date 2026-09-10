import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { publicOverrides } from "@/lib/content/public-overrides";
export const dynamic = "force-dynamic";
export async function GET() {
 try {
  const {data,error}=await createSupabaseAdminClient().from("content").select("key,value,type");
  if(error)throw error;
  return NextResponse.json(publicOverrides(data??[]),{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Content is temporarily unavailable."},{status:503,headers:{"Cache-Control":"no-store"}});}
}
