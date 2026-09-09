import { cmsFailure, cmsResponse } from "@/lib/cms/http";
import { CmsError, databaseError, requireCmsApi } from "@/lib/cms/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const {db} = await requireCmsApi(request);
    if(Number(request.headers.get("content-length")) > 5300000) throw new CmsError("Images must be 5 MB or smaller.",413);
    const file = (await request.formData()).get("file");
    if(!(file instanceof File) || file.size <= 0 || file.size > 5242880) throw new CmsError("Select an image up to 5 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    let extension = "";
    if(bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff && file.type==="image/jpeg") extension="jpg";
    if(bytes.slice(0,8).join(",")==="137,80,78,71,13,10,26,10" && file.type==="image/png") extension="png";
    if(String.fromCharCode(...bytes.slice(0,4))==="RIFF" && String.fromCharCode(...bytes.slice(8,12))==="WEBP" && file.type==="image/webp") extension="webp";
    if(!extension) throw new CmsError("Only valid JPEG, PNG and WebP images are accepted.");
    const id = crypto.randomUUID(); const path = id+"."+extension;
    const uploaded = await db.storage.from("editorial-images").upload(path,bytes,{contentType:file.type,upsert:false});
    if(uploaded.error) throw new CmsError("Image upload failed. Check that the editorial storage migration is installed.",503);
    const saved = await db.from("editorial_media").insert({id,path,mime_type:file.type,size:file.size});
    if(saved.error) { await db.storage.from("editorial-images").remove([path]); throw databaseError(saved.error); }
    return cmsResponse({url:"/api/editorial/media/"+id,id},201);
  } catch(error) { return cmsFailure(error); }
}
