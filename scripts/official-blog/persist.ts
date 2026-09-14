import {createClient,type SupabaseClient} from "@supabase/supabase-js";
import {createHash} from "node:crypto";
import {isDeepStrictEqual} from "node:util";
import {getSupabaseProjectUrl} from "../../lib/supabase/url";
import {postSchema} from "../../lib/cms/validation";
import type {RichTextNode} from "../../lib/cms/types";
import {archiveSlug,authorIdentity,chooseSlug,hash,sourceUrl,type SourceArticle} from "./parser";

type Existing={id:string;slug:string;legacy_source_id:string|null;legacy_source_url:string|null;legacy_body_hash:string|null};
export type ImportResult={sourceId:string;sourceUrl:string;id:string;slug:string;status:"imported"|"skipped";sourceChanged?:boolean;referencesCompleted?:boolean};
export interface ImportRepository {
  findExisting(article:SourceArticle):Promise<Existing|null>;
  author(name:string):Promise<string>;
  category():Promise<string>;
  occupiedSlugs():Promise<Set<string>>;
  media(url:string):Promise<string>;
  insert(record:Record<string,unknown>):Promise<{id:string;slug:string}>;
  completeReferences?(article:SourceArticle,existing:Existing):Promise<boolean>;
}
function fail(error:{code?:string;message?:string}|null, operation:string) {
  if(error)throw new Error(`${operation} failed${error.code?" ("+error.code+")":""}`);
}
function cloneDocument(article:SourceArticle){return structuredClone(article.document);}
export function canCompleteReferences(row:Record<string,unknown>,article:SourceArticle){
  const elapsed=new Date(String(row.updated_at)).getTime()-new Date(String(row.created_at)).getTime();
  // The existing insert trigger uses clock_timestamp(), so pristine timestamps can differ by milliseconds.
  return Number.isFinite(elapsed)&&elapsed>=0&&elapsed<=1000&&row.updated_by===null&&row.status==="published"&&row.legacy_body_hash===article.contentHash&&row.title===article.title&&row.summary===article.summary&&isDeepStrictEqual(row.content_json,article.document)&&Array.isArray(row.citations)&&row.citations.length===0;
}
export async function importArticle(article:SourceArticle, repository:ImportRepository, completeReferences=false):Promise<ImportResult> {
  const existing=await repository.findExisting(article);
  if(existing){
    if(existing.legacy_source_id!==article.sourceIdentity || !article.sourceUrls.includes(existing.legacy_source_url??""))throw new Error("Conflicting legacy identities require manual review");
    const sourceChanged=existing.legacy_body_hash!==article.contentHash;
    const referencesCompleted=completeReferences&&!sourceChanged&&article.citations.length>0&&repository.completeReferences ? await repository.completeReferences(article,existing):false;
    return {sourceId:article.sourceId,sourceUrl:article.sourceUrl,id:existing.id,slug:existing.slug,status:"skipped",sourceChanged,referencesCompleted};
  }
  const document=cloneDocument(article);const sourceMedia=[...new Set([...article.images.map(image=>image.sourceUrl),...(article.coverImageUrl?[article.coverImageUrl]:[])])];
  const media=new Map<string,string>();for(const url of sourceMedia)media.set(url,await repository.media(url));
  function replace(node:RichTextNode){if(node.type==="image")node.attrs={...node.attrs,src:media.get(String(node.attrs?.src))!};node.content?.forEach(replace);}document.content.forEach(replace);
  const authorId=await repository.author(article.authorName),categoryId=await repository.category();
  const slug=chooseSlug(archiveSlug(article.title,article.sourceId),article.sourceIdentity,await repository.occupiedSlugs());
  const input={title:article.title,slug,excerpt:article.summary,summary:article.summary,content:document,citations:article.citations,
    coverImage:article.coverImageUrl?media.get(article.coverImageUrl):null,authorId,categoryId,tagIds:[],status:"published",publishedAt:article.publishedAt};
  const validation=postSchema.safeParse(input);if(!validation.success)throw new Error("Article fails CMS validation: "+validation.error.issues.map(issue=>issue.path.join(".")).join(", "));
  const record={title:article.title,slug,excerpt:article.summary,summary:article.summary,content:article.contentText,content_json:document,citations:article.citations,
    cover_image:input.coverImage,author_profile_id:authorId,category_id:categoryId,status:"published",published_at:article.publishedAt,
    legacy_source_id:article.sourceIdentity,legacy_source_url:article.sourceUrl,legacy_source_urls:article.sourceUrls,
    original_language:article.originalLanguage,imported_at:new Date().toISOString(),legacy_body_hash:article.contentHash};
  const saved=await repository.insert(record);
  return {...saved,sourceId:article.sourceId,sourceUrl:article.sourceUrl,status:"imported"};
}

export function configuredClients() {
  const url=getSupabaseProjectUrl();const parsed=new URL(url);
  if(!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url) || parsed.pathname!=="/")throw new Error("Expected a configured Supabase project URL");
  if(!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)throw new Error("Configured Supabase credentials are required");
  const options={auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input:RequestInfo|URL,init?:RequestInit)=>fetch(input,{...init,signal:AbortSignal.timeout(30000)})}};
  return {projectRef:parsed.hostname.split(".")[0],url,db:createClient(url,process.env.SUPABASE_SERVICE_ROLE_KEY,options),publicDb:createClient(url,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,options)};
}
export async function preflight(db:SupabaseClient) {
  const counts=await Promise.all(["articles","authors","news"].map(table=>db.from(table).select("id",{count:"exact",head:true})));
  counts.forEach(r=>fail(r.error,"Target count query"));
  const schema=await Promise.all([
    db.from("articles").select("legacy_source_id,legacy_source_url,legacy_source_urls,original_language,imported_at,legacy_body_hash").limit(1),
    db.from("authors").select("legacy_author_key").limit(1),
  ]);
  const bucket=await db.storage.getBucket("editorial-images");fail(bucket.error,"Editorial storage check");
  if(bucket.data?.public!==false)throw new Error("Expected the existing private editorial-images bucket");
  return {articles:counts[0].count??0,authors:counts[1].count??0,news:counts[2].count??0,schemaReady:schema.every(r=>!r.error),storageReady:true};
}
async function allRows<T>(db:SupabaseClient,table:string,columns:string):Promise<T[]> {
  const rows:T[]=[];
  for(let offset=0;;offset+=500){const r=await db.from(table).select(columns).order("id").range(offset,offset+499);fail(r.error,"Target pagination");rows.push(...(r.data??[]) as T[]);if((r.data?.length??0)<500)return rows;}
}
export class SupabaseImportRepository implements ImportRepository {
  constructor(private db:SupabaseClient){}
  async findExisting(article:SourceArticle){
    const byId=await this.db.from("articles").select("id,slug,legacy_source_id,legacy_source_url,legacy_body_hash").eq("legacy_source_id",article.sourceIdentity).maybeSingle();fail(byId.error,"Legacy ID lookup");
    const byUrl=await this.db.from("articles").select("id,slug,legacy_source_id,legacy_source_url,legacy_body_hash").in("legacy_source_url",article.sourceUrls).maybeSingle();fail(byUrl.error,"Legacy URL lookup");
    if(byId.data && byUrl.data && byId.data.id!==byUrl.data.id)throw new Error("Legacy ID and URL resolve to different target records");
    return (byId.data??byUrl.data) as Existing|null;
  }
  async author(name:string,retries=1):Promise<string>{
    const key=authorIdentity(name);const found=await this.db.from("authors").select("id").eq("legacy_author_key",key).maybeSingle();fail(found.error,"Author lookup");if(found.data)return found.data.id;
    const created=await this.db.from("authors").insert({full_name:name,legacy_author_key:key,bio:null,position:null,avatar_url:null,social_links:{}}).select("id").single();
    if(created.error?.code==="23505"&&retries>0)return this.author(name,retries-1);fail(created.error,"Author creation");return created.data!.id;
  }
  async category(retries=1):Promise<string>{
    const found=await this.db.from("categories").select("id,name").eq("slug","legal-articles").maybeSingle();fail(found.error,"Category lookup");
    if(found.data){if(found.data.name!=="Legal Articles")throw new Error("Migration category slug is already used by a different category");return found.data.id;}
    const created=await this.db.from("categories").insert({name:"Legal Articles",slug:"legal-articles"}).select("id").single();
    if(created.error?.code==="23505"&&retries>0)return this.category(retries-1);fail(created.error,"Category creation");return created.data!.id;
  }
  async occupiedSlugs(){return new Set((await allRows<{slug:string}>(this.db,"articles","id,slug")).map(row=>row.slug));}
  async completeReferences(article:SourceArticle,existing:Existing){
    const result=await this.db.from("articles").select("title,summary,content_json,citations,status,created_at,updated_at,updated_by,legacy_body_hash").eq("id",existing.id).single();fail(result.error,"Reference completion check");
    const row=result.data!;
    // Only fill an empty field on an untouched, byte-equivalent import. Never replace editorial work.
    if(!canCompleteReferences(row,article))return false;
    const saved=await this.db.from("articles").update({citations:article.citations}).eq("id",existing.id).eq("legacy_source_id",article.sourceIdentity).eq("legacy_body_hash",article.contentHash).eq("updated_at",row.updated_at).is("updated_by",null).eq("status","published").select("id").maybeSingle();fail(saved.error,"Reference completion");return !!saved.data;
  }
  async media(url:string){
    const image=new URL(sourceUrl(url));if(image.protocol!=="https:" || !["www.adalawsociety.com","adalawsociety.com"].includes(image.hostname))throw new Error("Source media host requires explicit review before download");
    const response=await fetch(image,{signal:AbortSignal.timeout(30000),redirect:"error"});if(!response.ok)throw new Error("Source image unavailable (HTTP "+response.status+")");
    const expected=Number(response.headers.get("content-length")??0);if(expected>5242880)throw new Error("Source image exceeds the existing 5 MB media limit");
    const chunks:Uint8Array[]=[];let length=0;const reader=response.body?.getReader();if(!reader)throw new Error("Empty source image");
    while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>5242880){await reader.cancel();throw new Error("Source image exceeds the existing 5 MB media limit");}chunks.push(value);}
    const bytes=Buffer.concat(chunks);const mime=response.headers.get("content-type")?.split(";")[0];let extension="";
    if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff&&mime==="image/jpeg")extension="jpg";
    if(bytes.subarray(0,8).join(",")==="137,80,78,71,13,10,26,10"&&mime==="image/png")extension="png";
    if(bytes.subarray(0,4).toString()==="RIFF"&&bytes.subarray(8,12).toString()==="WEBP"&&mime==="image/webp")extension="webp";
    if(!extension)throw new Error("Source media is not a valid JPEG, PNG or WebP");
    const digest=createHash("sha256").update(url).update(bytes).digest("hex");const id=`${digest.slice(0,8)}-${digest.slice(8,12)}-4${digest.slice(13,16)}-a${digest.slice(17,20)}-${digest.slice(20,32)}`;const path=`official-blog/${id}.${extension}`;
    const found=await this.db.from("editorial_media").select("path,mime_type,size").eq("id",id).maybeSingle();fail(found.error,"Media lookup");
    if(found.data){if(found.data.path!==path||found.data.mime_type!==mime||found.data.size!==bytes.length)throw new Error("Conflicting media identity");return "/api/editorial/media/"+id;}
    const uploaded=await this.db.storage.from("editorial-images").upload(path,bytes,{contentType:mime,upsert:false});
    if(uploaded.error){const existing=await this.db.storage.from("editorial-images").download(path);if(existing.error||!existing.data||hash(Buffer.from(await existing.data.arrayBuffer()).toString("base64"))!==hash(bytes.toString("base64")))throw new Error("Media upload failed");}
    const saved=await this.db.from("editorial_media").insert({id,path,mime_type:mime,size:bytes.length});fail(saved.error,"Media persistence");return "/api/editorial/media/"+id;
  }
  async insert(record:Record<string,unknown>){const result=await this.db.from("articles").insert(record).select("id,slug").single();fail(result.error,"Article persistence");return result.data!;}
}
export async function verifyImport(db:SupabaseClient, publicDb:SupabaseClient, articles:SourceArticle[]) {
  const rows=await allRows<Record<string,unknown>>(db,"articles","id,title,slug,summary,content,content_json,citations,status,published_at,author_profile_id,legacy_source_id,legacy_source_url,legacy_body_hash,original_language");
  const imported=rows.filter(row=>articles.some(article=>article.sourceIdentity===row.legacy_source_id));const errors:string[]=[];
  const comparableDocument=(value:unknown)=>{
    const document=structuredClone(value) as {content?:RichTextNode[]};
    const strip=(node:RichTextNode)=>{if(node.type==="image"&&node.attrs)node.attrs.src="";node.content?.forEach(strip);};document.content?.forEach(strip);return document;
  };
  for(const article of articles){
    const matches=imported.filter(row=>row.legacy_source_id===article.sourceIdentity);if(matches.length!==1){errors.push("Missing/duplicate source identity "+article.sourceId);continue;}
    const row=matches[0];if(row.title!==article.title||row.summary!==article.summary||row.content!==article.contentText||new Date(String(row.published_at)).toISOString()!==article.publishedAt||row.status!=="published"||row.original_language!==article.originalLanguage||!row.author_profile_id)errors.push("Persisted data differs for "+article.sourceId);
    if(!isDeepStrictEqual(comparableDocument(row.content_json),comparableDocument(article.document)))errors.push("Persisted rich-text structure differs for "+article.sourceId);
    if(!isDeepStrictEqual(row.citations,article.citations))errors.push("Persisted citations differ for "+article.sourceId);
  }
  const authorRows=await allRows<{id:string;full_name:string;legacy_author_key:string|null}>(db,"authors","id,full_name,legacy_author_key");
  for(const article of articles){const row=imported.find(row=>row.legacy_source_id===article.sourceIdentity);const author=authorRows.find(a=>a.id===row?.author_profile_id);if(author?.full_name!==article.authorName)errors.push("Author mismatch for "+article.sourceId);}
  const visible=await allRows<{id:string;legacy_source_id:string|null}>(publicDb,"articles","id,legacy_source_id");
  if(imported.some(row=>!visible.some(publicRow=>publicRow.id===row.id)))errors.push("Imported publications are missing from anonymous reads");
  return {importedCount:imported.length,uniqueSourceIdentities:new Set(imported.map(row=>row.legacy_source_id)).size,uniqueSourceUrls:new Set(imported.map(row=>row.legacy_source_url)).size,
    importedAuthors:authorRows.filter(a=>a.legacy_author_key).length,publicArticleCount:visible.length,errors};
}
