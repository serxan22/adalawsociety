import {cmsFailure,cmsResponse,readJson} from "@/lib/cms/http";
import {CmsError,databaseError,requireCmsApi} from "@/lib/cms/server";
import {getGallery} from "@/lib/cms/gallery";
import {gallerySchema} from "@/lib/cms/gallery-validation";
export const dynamic="force-dynamic";
export async function GET(request:Request){
	 try{await requireCmsApi(request);const result=await getGallery(true);if(result.unavailable)throw new CmsError("Gallery data is temporarily unavailable.",503);return cmsResponse(result);}
 catch(error){return cmsFailure(error);}
}
export async function POST(request:Request){
 try{
  const {db,session}=await requireCmsApi(request);const parsed=gallerySchema.safeParse(await readJson(request));
	  if(!parsed.success)throw new CmsError(parsed.error.issues.map(i=>i.message).join(" "));
	  const v=parsed.data;
	  const legacyUrl=v.imageUrl.match(/^\/api\/gallery\/legacy\/(gallery\.image\.\d+)$/)?.[1]??null;
	  if(legacyUrl!==null&&legacyUrl!==v.legacyKey)throw new CmsError("Legacy image reference does not match.");
  const {data,error}=await db.from("gallery_items").insert({image_url:v.imageUrl,caption:v.caption,alt_text:v.altText,sort_order:v.sortOrder,status:v.status,legacy_key:v.legacyKey??null,updated_by:session.email}).select("*").single();
  if(error)throw databaseError(error);return cmsResponse({item:data},201);
 }catch(error){return cmsFailure(error);}
}
