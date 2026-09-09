import "server-only";
import { articles } from "@/data/articles";
import { newsItems } from "@/data/news";
import { databaseError, normalizePost, postSelect, publicDb, tableFor } from "./server";
import { toArticle, toNews } from "./public-adapter";
import type { CmsContentType, CmsPost } from "./types";

export async function publicPost(kind:CmsContentType,slug:string):Promise<CmsPost|null> {
  const result=await publicDb().from(tableFor(kind)).select(postSelect(kind)).eq("slug",slug).eq("status","published").lte("published_at",new Date().toISOString()).maybeSingle();
  if(result.error) { if(["PGRST205","42703","PGRST200"].includes(result.error.code))return null;throw databaseError(result.error); }
  return result.data?normalizePost(result.data as unknown as Record<string,unknown>,kind):null;
}
export async function publicListing(kind:CmsContentType,params:URLSearchParams) {
  const page=Math.max(1,Math.min(10000,Number(params.get("page"))||1));const pageSize=12;
  const search=(params.get("q")??"").replace(/[%_,().]/g," ").trim().slice(0,120);
  const category=params.get("category")??"All";const author=params.get("author")??"All";
  const db=publicDb();
  const [categories,authors]=await Promise.all([
    db.from("categories").select("id,name").order("name").limit(500),
    db.from("authors").select("id,full_name").order("full_name").limit(500),
  ]);
  const legacy=kind==="article"?articles:newsItems;
  const filteredLegacy=legacy.filter(p=>(category==="All"||p.category===category)&&(author==="All"||("author" in p&&p.author?.name===author))&&(!search||[p.title,p.excerpt,...("tags" in p?p.tags:[])].join(" ").toLowerCase().includes(search.toLowerCase())));
  let query=db.from(tableFor(kind)).select(postSelect(kind,false),{count:"exact"}).eq("status","published").lte("published_at",new Date().toISOString());
  if(search)query=query.or("title.ilike.%"+search+"%,excerpt.ilike.%"+search+"%");
  if(category!=="All") query=query.eq("category_id",categories.data?.find(c=>c.name===category)?.id??"00000000-0000-0000-0000-000000000000");
  if(author!=="All") query=query.eq("author_profile_id",authors.data?.find(a=>a.full_name===author)?.id??"00000000-0000-0000-0000-000000000000");
  const offset=(page-1)*pageSize;
  const result=await query.order("published_at",{ascending:false}).order("id").range(offset,offset+pageSize-1);
  if(result.error&&!["PGRST205","42703","PGRST200"].includes(result.error.code))throw databaseError(result.error);
  const count=result.count??0;
  const rows=(result.data??[]).map(row=>normalizePost(row as unknown as Record<string,unknown>,kind));
  const posts=rows.map(p=>kind==="article"?toArticle(p):toNews(p));
  if(posts.length<pageSize) posts.push(...filteredLegacy.slice(Math.max(0,offset-count),Math.max(0,offset-count)+(pageSize-posts.length)));
  return {posts,total:count+filteredLegacy.length,page,pageSize,
    categories:[...new Set([...legacy.map(p=>p.category),...(categories.data??[]).map(c=>c.name)])],
    authors:[...new Set([...articles.map(p=>p.author.name),...(authors.data??[]).map(a=>a.full_name)])],
  };
}
