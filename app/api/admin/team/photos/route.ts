import {cmsFailure,cmsResponse} from "@/lib/cms/http";
import {databaseError,requireCmsApi} from "@/lib/cms/server";
export async function GET(request:Request){
 try{const {db}=await requireCmsApi(request);const {data,error}=await db.from("team_member_photos").select("*");if(error&&["42P01","PGRST205"].includes(error.code??""))return cmsResponse({photos:[],schemaReady:false});if(error)throw databaseError(error);return cmsResponse({photos:data??[],schemaReady:true});}
 catch(error){return cmsFailure(error);}
}
