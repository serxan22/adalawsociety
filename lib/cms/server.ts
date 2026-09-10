import "server-only";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getAdminSession, canManageEditorialContent } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseProjectUrl } from "@/lib/supabase/url";
import { extractPlainText } from "./rich-text";
import { postSchema } from "./validation";
import type { CmsContentType, CmsLookups, CmsPost } from "./types";

export class CmsError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function databaseError(error: { code?: string; message?: string }) {
  if (["42P01", "42703", "PGRST205", "PGRST200", "PGRST202", "PGRST204"].includes(error.code ?? "")) return new CmsError("The editorial database migration has not been applied yet. Run 003_editorial_cms.sql in Supabase.", 503);
  if (error.code === "23505") return new CmsError("That slug or profile is already in use.", 409);
  if (error.code === "23503") return new CmsError("This author, category or tag is missing or still used by a post.", 409);
  if (error.code === "40001") return new CmsError("Another editor changed this post. Reload before saving.", 409);
  if (error.code === "42501") return new CmsError("Your account does not have permission for this operation.", 403);
  if (error.code === "P0002") return new CmsError("Post not found.", 404);
  if (error.code === "23514") return new CmsError(error.message ?? "Invalid post.", 400);
  console.error("Editorial database error:", error.code);
  return new CmsError("The editorial service is unavailable. Please try again.", 503);
}
export async function requireCmsPage() {
  const session = await getAdminSession();
  if (!session || !canManageEditorialContent(session.role)) redirect("/admin/login?error=not-authorized");
  return session;
}
export async function requireCmsApi(request?: Request) {
  const session = await getAdminSession();
  if (!session || !canManageEditorialContent(session.role)) throw new CmsError("Admin access required.", 403);
  if (request && !["GET", "HEAD"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) throw new CmsError("Request origin is not allowed.", 403);
  }
  return { session, db: await createSupabaseServerClient() };
}
export function publicDb() {
  return createClient(getSupabaseProjectUrl(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
export function tableFor(kind: CmsContentType) { return kind === "article" ? "articles" : "news"; }
export function kindFrom(value: string): CmsContentType {
  if (value === "article" || value === "blog") return "article";
  if (value === "news") return "news";
  throw new CmsError("Unknown content type.", 404);
}
export function postSelect(kind: CmsContentType, detail = true) {
  const table = tableFor(kind);
  const fields = "id,title,slug,excerpt,summary,cover_image,status,published_at,created_at,updated_at,author_profile_id,category_id,citations";
  const extra = detail ? ",content,content_json,seo_title,seo_description,seo_keywords,canonical_url,seo_image,updated_by" : "";
  const tags = kind === "article" ? "article_tags" : "news_tags";
  return fields + extra + ",author:authors!"+table+"_author_profile_id_fkey(id,full_name,avatar_url,bio,position,social_links),category_record:categories!"+table+"_category_id_fkey(id,name,slug,description),tag_links:"+tags+"(tag:tags(id,name,slug))";
}
export function normalizePost(row: Record<string, unknown>, kind: CmsContentType): CmsPost {
  const record = row as Partial<CmsPost>;
  const tags = (row.tag_links ?? []) as Array<{ tag: CmsPost["tags"][number] | null }>;
  return {
    id:record.id??"",content_type:kind,title:record.title??"",slug:record.slug??"",
    excerpt:record.excerpt||record.summary||"",summary:record.summary||record.excerpt||"",
    content:record.content??"",content_json:record.content_json??null,citations:record.citations??[],
    cover_image:record.cover_image??null,media:[],status:record.status??"draft",
    published_at:record.published_at??null,created_at:record.created_at??"",updated_at:record.updated_at??"",updated_by:record.updated_by??null,
    seo_title:record.seo_title??null,seo_description:record.seo_description??null,seo_keywords:record.seo_keywords??[],
    canonical_url:record.canonical_url??null,seo_image:record.seo_image??null,
    author:record.author??null,category:(row.category_record as CmsPost["category"])??null,
    tags:tags.flatMap(link=>link.tag?[link.tag]:[]),
  };
}

export async function getPost(kind: CmsContentType, id: string, db: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data, error } = await db.from(tableFor(kind)).select(postSelect(kind)).eq("id", id).maybeSingle();
  if (error) throw databaseError(error);
  if (!data) throw new CmsError("Post not found.", 404);
  return normalizePost(data as unknown as Record<string, unknown>, kind);
}
export async function getLookups(db: Awaited<ReturnType<typeof createSupabaseServerClient>>): Promise<CmsLookups> {
  const results = await Promise.all([
    db.from("authors").select("*").order("full_name").limit(500),
    db.from("categories").select("*").order("name").limit(500),
    db.from("tags").select("*").order("name").limit(500),
  ]);
  for (const r of results) if (r.error) throw databaseError(r.error);
  return { authors: results[0].data ?? [], categories: results[1].data ?? [], tags: results[2].data ?? [] } as CmsLookups;
}
export async function savePost(kind: CmsContentType, id: string | null, input: unknown, db: Awaited<ReturnType<typeof createSupabaseServerClient>>, email: string) {
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) throw new CmsError(parsed.error.issues.map(i => i.path.join(".") + ": " + i.message).join(" "));
  const post = parsed.data;
  if (kind === "article" && !post.summary?.trim()) throw new CmsError("An author summary is required.");
  const data = {
    title: post.title, slug: post.slug, excerpt: post.excerpt, summary: post.summary || post.excerpt,
    content: extractPlainText(post.content), content_json: post.content, citations: post.citations,
    cover_image: post.coverImage || null, author_profile_id: post.authorId, category_id: post.categoryId,
    status: post.status, published_at: post.publishedAt || null, updated_by: email,
    seo_title: post.seoTitle || null, seo_description: post.seoDescription || null, seo_keywords: post.seoKeywords,
    canonical_url: post.canonicalUrl || null, seo_image: post.seoImage || null,
  };
  const result = await db.rpc("save_editorial_post", { p_kind: kind, p_id: id, p_data: data, p_tags: [...new Set(post.tagIds)], p_expected: post.updatedAt ?? null });
  if (result.error) throw databaseError(result.error);
  return getPost(kind, String(result.data), db);
}
export function postToInput(post: CmsPost) {
  return { title: post.title, slug: post.slug, excerpt: post.excerpt, summary: post.summary,
    content: post.content_json, citations: post.citations, coverImage: post.cover_image,
    authorId: post.author?.id ?? "", categoryId: post.category?.id ?? "", tagIds: post.tags.map(tag => tag.id),
    status: post.status, publishedAt: post.published_at, updatedAt: post.updated_at,
    seoTitle: post.seo_title, seoDescription: post.seo_description, seoKeywords: post.seo_keywords,
    canonicalUrl: post.canonical_url, seoImage: post.seo_image,
  };
}
