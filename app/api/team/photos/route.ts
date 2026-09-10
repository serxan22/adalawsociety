import {NextResponse} from "next/server";
import {publicDb} from "@/lib/cms/server";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const {data,error}=await publicDb().from("team_member_photos").select("member_key,image_url");
  if(error)throw error;
  return NextResponse.json({photos:Object.fromEntries((data??[]).map(r=>[r.member_key,r.image_url]))},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({photos:{}},{headers:{"Cache-Control":"no-store"}});}
}
