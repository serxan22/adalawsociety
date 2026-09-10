import {cmsFailure,cmsResponse,readJson} from "@/lib/cms/http";
import {CmsError,databaseError,requireCmsApi} from "@/lib/cms/server";
import {gallerySchema} from "@/lib/cms/gallery-validation";
import {idSchema} from "@/lib/cms/validation";
const legacyKeyPattern=/^gallery\.image\.\d+$/;
function uuid(value:string){const result=idSchema.safeParse(value);if(!result.success)throw new CmsError("Invalid gallery item.",404);return result.data;}
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){
 try{
  const {db,session}=await requireCmsApi(request);const id=(await params).id;
  const parsed=gallerySchema.safeParse(await readJson(request));if(!parsed.success)throw new CmsError(parsed.error.issues.map(i=>i.message).join(" "));
	  const v=parsed.data;const legacyId=id.startsWith("legacy:");const legacyKey=legacyId?id.slice(7):v.legacyKey??null;
	  if(legacyKey&&!legacyKeyPattern.test(legacyKey))throw new CmsError("Invalid gallery item.",404);
	  const legacyUrl=v.imageUrl.match(/^\/api\/gallery\/legacy\/(gallery\.image\.\d+)$/)?.[1]??null;
	  if(legacyUrl!==null&&legacyUrl!==legacyKey)throw new CmsError("Legacy image reference does not match.");
	  const values={image_url:v.imageUrl,caption:v.caption,alt_text:v.altText,sort_order:v.sortOrder,status:v.status,legacy_key:legacyKey,updated_by:session.email};
	  const query=legacyId?db.from("gallery_items").upsert(values,{onConflict:"legacy_key"}):db.from("gallery_items").update(values).eq("id",uuid(id));
	  const {data,error}=await query.select("*").maybeSingle();if(error)throw databaseError(error);if(!data)throw new CmsError("Gallery item not found.",404);return cmsResponse({item:data});
 }catch(error){return cmsFailure(error);}
}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
 try{
	  const {db,session}=await requireCmsApi(request);const id=(await params).id;
	  if(id.startsWith("legacy:")){
	   const key=id.slice(7);if(!legacyKeyPattern.test(key))throw new CmsError("Invalid gallery item.",404);
	   const {error}=await db.from("gallery_items").upsert({image_url:"/api/gallery/legacy/"+key,caption:"",alt_text:"Unpublished gallery image",sort_order:10000,status:"unpublished",legacy_key:key,updated_by:session.email},{onConflict:"legacy_key"});
	   if(error)throw databaseError(error);return cmsResponse({removed:true});
	  }
	  const valid=uuid(id);const {data, error:readError}=await db.from("gallery_items").select("legacy_key").eq("id",valid).maybeSingle();
	  if(readError)throw databaseError(readError);if(!data)throw new CmsError("Gallery item not found.",404);
  if(data?.legacy_key){
   const {error}=await db.from("gallery_items").update({status:"unpublished",updated_by:session.email}).eq("id",valid);
   if(error)throw databaseError(error);
  }else{
   const {error}=await db.from("gallery_items").delete().eq("id",valid);if(error)throw databaseError(error);
  }
  return cmsResponse({removed:true});
 }catch(error){return cmsFailure(error);}
}
