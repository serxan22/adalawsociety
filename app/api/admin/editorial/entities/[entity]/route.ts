import { cmsFailure, cmsResponse, readJson } from "@/lib/cms/http";
import { CmsError, databaseError, requireCmsApi } from "@/lib/cms/server";
import { authorSchema, categorySchema, idSchema, tagSchema } from "@/lib/cms/validation";
type Context = { params: Promise<{entity:string}> };
export async function POST(request: Request, context: Context) { return mutate(request,context,false); }
export async function DELETE(request: Request, context: Context) { return mutate(request,context,true); }
async function mutate(request: Request, context: Context, remove: boolean) {
  try {
    const {db,session} = await requireCmsApi(request);
    const {entity} = await context.params;
    if(!["authors","categories","tags"].includes(entity)) throw new CmsError("Unknown collection.",404);
    const body = await readJson(request);
    if (body.id && !idSchema.safeParse(body.id).success) throw new CmsError("Invalid ID.");
    const id = body.id || null;
    if(remove) {
      if(!id) throw new CmsError("An ID is required.");
      const {error} = await db.from(entity).delete().eq("id",id);
      if(error) throw databaseError(error);
      return cmsResponse({ok:true});
    }
    const schema = entity === "authors" ? authorSchema : entity === "categories" ? categorySchema : tagSchema;
    const parsed = schema.safeParse(body);
    if(!parsed.success) throw new CmsError(parsed.error.issues.map(i=>i.path.join(".")+": "+i.message).join(" "));
    if(entity === "authors" && "user_id" in parsed.data && parsed.data.user_id && parsed.data.user_id !== session.userId) {
      const previous = id ? await db.from("authors").select("user_id").eq("id",id).maybeSingle() : null;
      if (previous?.data?.user_id !== parsed.data.user_id) throw new CmsError("Only your own login can be linked to an author profile.",403);
    }
    const data: Record<string, unknown> = {...parsed.data,updated_at:new Date().toISOString()};
    const result = id ? await db.from(entity).update(data).eq("id",id).select().single() : await db.from(entity).insert(data).select().single();
    if(result.error) throw databaseError(result.error);
    return cmsResponse({item:result.data});
  } catch(error) { return cmsFailure(error); }
}
