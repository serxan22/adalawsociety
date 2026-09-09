import { cmsFailure, cmsResponse, readJson } from "@/lib/cms/http";
import { databaseError, kindFrom, normalizePost, postSelect, requireCmsApi, savePost, tableFor } from "@/lib/cms/server";
import { idSchema } from "@/lib/cms/validation";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ kind: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const { db } = await requireCmsApi();
    const kind = kindFrom((await context.params).kind);
    const params = new URL(request.url).searchParams;
    const page = Math.max(1, Number(params.get("page")) || 1);
    const pageSize = 15;
    let query = db.from(tableFor(kind)).select(postSelect(kind, false), { count: "exact" });
    const search = (params.get("q") ?? "").replace(/[%_,().]/g, " ").trim().slice(0, 120);
    if (search) query = query.ilike("title", "%"+search+"%");
    const status = params.get("status");
    if (["draft", "published", "unpublished"].includes(status ?? "")) query = query.eq("status", status);
    for (const [param, col] of [["author","author_profile_id"],["category","category_id"]]) {
      const value = params.get(param);
      if (value && idSchema.safeParse(value).success) query = query.eq(col, value);
    }
    const result = await query.order("created_at", { ascending: params.get("sort") === "oldest" }).order("id").range((page-1)*pageSize, page*pageSize-1);
    if (result.error) throw databaseError(result.error);
    return cmsResponse({ posts: (result.data ?? []).map(row => normalizePost(row as unknown as Record<string,unknown>, kind)), total: result.count ?? 0, page, pageSize });
  } catch (error) { return cmsFailure(error); }
}
export async function POST(request: Request, context: Context) {
  try {
    const { db, session } = await requireCmsApi(request);
    const post = await savePost(kindFrom((await context.params).kind), null, await readJson(request), db, session.email);
    return cmsResponse({ post }, 201);
  } catch (error) { return cmsFailure(error); }
}
