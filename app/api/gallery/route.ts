import {NextResponse} from "next/server";
import {getGallery} from "@/lib/cms/gallery";
export const dynamic="force-dynamic";
export async function GET(){
 const result=await getGallery(false);
 return NextResponse.json({items:result.items,unavailable:result.unavailable},{status:result.unavailable?503:200,headers:{"Cache-Control":"no-store"}});
}
