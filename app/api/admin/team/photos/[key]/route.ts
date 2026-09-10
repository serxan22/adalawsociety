import {cmsFailure,cmsResponse,readJson} from "@/lib/cms/http";
import {CmsError,databaseError,requireCmsApi} from "@/lib/cms/server";
import {isTeamRecord} from "@/lib/cms/team-records";
import {isManagedMediaUrl} from "@/lib/cms/media-validation";
export async function PUT(request:Request,{params}:{params:Promise<{key:string}>}){
 try{
  const {db,session}=await requireCmsApi(request);const key=(await params).key;
  if(!isTeamRecord(key))throw new CmsError("Unknown team record.",404);
  const body=await readJson(request);if(typeof body.imageUrl!=="string"||!/^\/api\/editorial\/media\//.test(body.imageUrl)||!isManagedMediaUrl(body.imageUrl))throw new CmsError("Upload a JPEG, PNG or WebP portrait.");
  const {data,error}=await db.from("team_member_photos").upsert({member_key:key,image_url:body.imageUrl,updated_by:session.email},{onConflict:"member_key"}).select("*").single();
  if(error)throw databaseError(error);return cmsResponse({photo:data});
 }catch(error){return cmsFailure(error);}
}
export async function DELETE(request:Request,{params}:{params:Promise<{key:string}>}){
 try{
  const {db}=await requireCmsApi(request);const key=(await params).key;
  if(!isTeamRecord(key))throw new CmsError("Unknown team record.",404);
  const {error}=await db.from("team_member_photos").delete().eq("member_key",key);if(error)throw databaseError(error);
  return cmsResponse({removed:true});
 }catch(error){return cmsFailure(error);}
}
