import "server-only";
import { normalizePost, postSelect, publicDb, tableFor } from "./server";
import { toArticle, toNews } from "./public-adapter";
import { emptyPublicationResult } from "./public-types";
import type { CmsContentType, CmsPost } from "./types";

export async function publicPost(kind: CmsContentType, slug: string): Promise<CmsPost | null> {
  const result = await publicDb().from(tableFor(kind)).select(postSelect(kind))
    .eq("slug", slug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
  if (result.error) throw new Error("Public content is temporarily unavailable.");
  return result.data ? normalizePost(result.data as unknown as Record<string, unknown>, kind) : null;
}

export async function publicListing(kind: CmsContentType, params = new URLSearchParams()) {
  try {
    const page = Math.max(1, Math.min(10000, Math.floor(Number(params.get("page")) || 1)));
    const pageSize = 12;
    const search = (params.get("q") ?? "").replace(/[%_,().]/g, " ").trim().slice(0, 120);
    const category = params.get("category") ?? "All";
    const author = params.get("author") ?? "All";
    const db = publicDb();
    const base = () => db.from(tableFor(kind)).select(postSelect(kind, false), { count: "exact" })
      .eq("status", "published").lte("published_at", new Date().toISOString());
    // Choices only come from publications, never unused author/category profiles.
    const [count, choices] = await Promise.all([
      db.from(tableFor(kind)).select("id", { count: "exact", head: true }).eq("status", "published").lte("published_at", new Date().toISOString()),
      db.rpc("public_editorial_choices", { p_kind: kind }),
    ]);
    if (!count.error && count.count === 0) return emptyPublicationResult<ReturnType<typeof toArticle> | ReturnType<typeof toNews>>();
    if (count.error || choices.error) throw new Error("Content unavailable");
    const available = (choices.data ?? []) as { category_id: string; category_name: string; author_id: string; author_name: string }[];
    let query = base();
    if (search) query = query.or("title.ilike.%" + search + "%,excerpt.ilike.%" + search + "%");
    const none = "00000000-0000-0000-0000-000000000000";
    if (category !== "All") query = query.in("category_id", available.filter(c => c.category_name === category).map(c => c.category_id).concat(none));
    if (author !== "All") query = query.in("author_profile_id", available.filter(a => a.author_name === author).map(a => a.author_id).concat(none));
    const offset = (page - 1) * pageSize;
    const result = await query.order("published_at", { ascending: false }).order("id").range(offset, offset + pageSize - 1);
    if (result.error) throw new Error("Content unavailable");
    const posts = (result.data ?? []).map(row => normalizePost(row as unknown as Record<string, unknown>, kind)).map(p => kind === "article" ? toArticle(p) : toNews(p));
    return { posts, total: result.count ?? 0, libraryTotal: count.count ?? 0, page, pageSize,
      categories: [...new Set(available.map(c => c.category_name))].sort(),
      authors: [...new Set(available.map(a => a.author_name))].sort(), unavailable: false };
  } catch {
    return emptyPublicationResult<ReturnType<typeof toArticle> | ReturnType<typeof toNews>>(true);
  }
}
