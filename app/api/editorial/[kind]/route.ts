import { cmsFailure, cmsResponse } from "@/lib/cms/http";
import { kindFrom } from "@/lib/cms/server";
import { publicListing } from "@/lib/cms/public";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{kind:string}>}) {
  try{return cmsResponse(await publicListing(kindFrom((await context.params).kind),new URL(request.url).searchParams));}
  catch(error){return cmsFailure(error);}
}
