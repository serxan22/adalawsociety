import { cmsFailure, cmsResponse, readJson } from "@/lib/cms/http";
import { CmsError, databaseError, getPost, kindFrom, postToInput, requireCmsApi, savePost, tableFor } from "@/lib/cms/server";
import { idSchema } from "@/lib/cms/validation";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ kind: string; id: string }> };
async function resolve(context: Context) {
  const p = await context.params;
  if (!idSchema.safeParse(p.id).success) throw new CmsError("Post not found.",404);
  return { kind: kindFrom(p.kind), id: p.id };
}
export async function GET(_request: Request, context: Context) {
  try { const {db} = await requireCmsApi(); const {kind,id} = await resolve(context); return cmsResponse({post: await getPost(kind,id,db)}); } catch(error) { return cmsFailure(error); }
}
export async function PUT(request: Request, context: Context) {
  try {
    const {db,session} = await requireCmsApi(request); const {kind,id} = await resolve(context);
    return cmsResponse({post: await savePost(kind,id,await readJson(request),db,session.email)});
  } catch(error) { return cmsFailure(error); }
}
export async function PATCH(request: Request, context: Context) {
  try {
    const {db,session} = await requireCmsApi(request); const {kind,id} = await resolve(context);
    const body = await readJson(request); const original = await getPost(kind,id,db);
    const input = postToInput(original);
    if (body.action === "duplicate") {
      const post = await savePost(kind,null,{...input,title: original.title.slice(0,220)+" (copy)",slug:original.slug.slice(0,90)+"-copy-"+crypto.randomUUID().slice(0,8),status:"draft",publishedAt:null,updatedAt:null},db,session.email);
      return cmsResponse({post},201);
    }
    if (!["publish","unpublish"].includes(body.action)) throw new CmsError("Unknown action.");
    if (body.updatedAt !== original.updated_at) throw new CmsError("This post changed. Refresh before continuing.",409);
    const post = await savePost(kind,id,{...input,status:body.action === "publish" ? "published" : "unpublished"},db,session.email);
    return cmsResponse({post});
  } catch(error) { return cmsFailure(error); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    const {db} = await requireCmsApi(request); const {kind,id} = await resolve(context);
    const body = await readJson(request);
    if (typeof body.updatedAt !== "string") throw new CmsError("Post version is required.");
    const result = await db.from(tableFor(kind)).delete().eq("id",id).eq("updated_at",body.updatedAt).select("id");
    if(result.error) throw databaseError(result.error);
    if(!result.data?.length) throw new CmsError("This post changed or was deleted. Refresh the list.",409);
    return cmsResponse({ok:true});
  } catch(error) { return cmsFailure(error); }
}
