import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {join} from "node:path";
import {getSchema} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import {articleIdentity,archiveSlug,authorIdentity,chooseSlug,deduplicateLocaleArticles,detectLanguage,documentText,htmlToDocument,normalizeText,parseArticle,parseListing,parsePublicationDate} from "../scripts/official-blog/parser";
import {fetchSource} from "../scripts/official-blog/crawl";
import {canCompleteReferences,importArticle,type ImportRepository} from "../scripts/official-blog/persist";
import {formatDate} from "../lib/format";

const fixture=(name:string)=>readFile(join(process.cwd(),"tests/fixtures/official-blog",name),"utf8");
const enUrl="https://www.adalawsociety.com/en/blogs/19";
test("discover both locale listings and real pagination without page chrome",async()=>{
  const en=parseListing(await fixture("listing-en.html"),"https://www.adalawsociety.com/en/blogs");
  const az=parseListing(await fixture("listing-az.html"),"https://www.adalawsociety.com/az/blogs");
  assert.equal(en.entries.length,1);assert.equal(az.entries.length,1);
  assert.equal(en.entries[0].sourceId,az.entries[0].sourceId);assert.equal(en.entries[0].authorName,"İnci Açak");
  assert.deepEqual(en.pagination,["https://www.adalawsociety.com/en/blogs?page=2"]);
  assert.equal(articleIdentity("https://evil.example/en/blogs/19"),null);
});
test("preserve exact Unicode metadata, original date, summary and full structured body",async()=>{
  const article=parseArticle(await fixture("article-az.html"),enUrl);
  assert.equal(article.title,"Bərabərlik və hüquq");assert.equal(article.authorName,"İnci Açak");
  assert.equal(article.publishedAt,"2026-09-07T00:00:00.000Z");assert.equal(article.summary,"Bu yazı hüquq və bir prinsip ilə bağlıdır.");
  assert.equal(article.originalLanguage,"az");assert.equal(article.document.content[0].type,"heading");
  assert.ok(article.document.content.some(node=>node.type==="orderedList"&&node.attrs?.start===3));
  assert.ok(article.document.content.some(node=>node.type==="bulletList"));assert.ok(article.document.content.some(node=>node.type==="blockquote"));
  assert.ok(JSON.stringify(article.document).includes('"superscript"'));assert.ok(JSON.stringify(article.document).includes('"bold"'));
  assert.ok(JSON.stringify(article.document).includes('"italic"'));assert.ok(JSON.stringify(article.document).includes("https://www.adalawsociety.com/documents/reference.pdf"));
  assert.deepEqual(article.citations,[{label:"1",source:"Mənbənin dəqiq mətni, 2025."}]);
  assert.ok(article.contentText.includes("İstinadlar:"));assert.ok(article.contentText.includes("Mənbənin dəqiq mətni"));assert.ok(!article.contentText.includes("Newsletter"));
});
test("locale interface copies deduplicate only after body/metadata equality",async()=>{
  const html=await fixture("article-az.html");const en=parseArticle(html,enUrl);
  const az=parseArticle(html.replace("By İnci","Tərəfindən İnci").replace("September","Sentyabr").replace("Summary:","Xülasə:"),enUrl.replace("/en/","/az/"));
  const combined=deduplicateLocaleArticles([en,az]);assert.equal(combined.length,1);assert.equal(combined[0].sourceUrls.length,2);
  assert.throws(()=>deduplicateLocaleArticles([en,{...az,contentHash:"different"}]),/differs/);
  assert.equal(deduplicateLocaleArticles([en,{...az,sourceId:"21",sourceIdentity:"adalawsociety.com/blogs/21"}]).length,2);
  assert.notEqual(authorIdentity("İnci Açak"),authorIdentity("İnji Achak"));
});
test("English uppercase and Azerbaijani reference labels are not confused by locale case folding",async()=>{
  const html=await fixture("article-az.html");
  for(const label of ["BIBLIOGRAPHY:","BİBLİOQRAFİYA","VI. Bibliography:","İSTİNADLAR","İstinad edilən Qanunvericilik və Qərarlar:"]){
    assert.equal(parseArticle(html.replace("İstinadlar:",label),enUrl).citations.length,1);
  }
});
test("dates, actual content language and safe deterministic slug collisions",()=>{
  assert.equal(parsePublicationDate("13 Sentyabr 2026"),"2026-09-13T00:00:00.000Z");assert.throws(()=>parsePublicationDate("31 February 2026"));
  assert.equal(formatDate("2026-09-07T00:00:00+00:00"),"Sep 7, 2026");assert.equal(formatDate("2026-09-07"),"Sep 7, 2026");
  assert.equal(detectLanguage("The law is a rule and the article is for the court in a legal system."),"en");assert.throws(()=>detectLanguage("Uncertain"));
  const slug=archiveSlug("Əmək, Şərait və Hüquq: ı, ö, ü, ç, ğ","8");assert.match(slug,/^emek-serait-ve-huquq/);assert.match(slug,/^[a-z0-9]+(-[a-z0-9]+)*$/);
  const occupied=new Set([slug]);assert.equal(chooseSlug(slug,"source/8",occupied),chooseSlug(slug,"source/8",occupied));assert.notEqual(chooseSlug(slug,"source/8",occupied),slug);
});
test("unsafe HTML is removed, real image URLs/captions and references are retained",()=>{
  const html='<p onclick="bad()">Text <a href="javascript:bad()">words</a><script>bad()</script><em> emphasis</em>.</p><figure><img src="/uploads/real.jpg" alt="Original alt" onerror="bad()"><figcaption>Original caption</figcaption></figure>';
  const result=htmlToDocument(html,enUrl);const json=JSON.stringify(result.document);
  assert.ok(!json.includes("javascript:"));assert.ok(!json.includes("onclick"));assert.ok(!json.includes("bad()"));
  assert.equal(result.images[0].sourceUrl,"https://www.adalawsociety.com/uploads/real.jpg");assert.equal(result.images[0].caption,"Original caption");
  assert.ok(normalizeText(documentText(result.document)).includes("Text words emphasis. Original caption"));
  assert.throws(()=>htmlToDocument('<table><tr><td>Do not silently flatten</td></tr></table>',enUrl),/Unsupported/);
});
test("legacy multi-paragraph heading normalization loses no words",()=>{
  const body="Bu hüquq və bir prinsip ilə bağlıdır. ".repeat(80);
  const doc=htmlToDocument(`<h2><br><strong>1. Giriş</strong><br><br>${body}<br><br><strong>2. Nəticə</strong><br><br>Son fikir.</h2>`,enUrl);
  assert.equal(doc.document.content[0].type,"heading");assert.equal(doc.document.content[1].type,"paragraph");
  assert.equal(normalizeText(documentText(doc.document)),normalizeText("1. Giriş "+body+"2. Nəticə Son fikir."));assert.ok(doc.warnings.length);
});
test("the existing editor schema retains imported headings, lists and superscript",async()=>{
  const article=parseArticle(await fixture("article-az.html"),enUrl);
  const schema=getSchema([StarterKit.configure({heading:{levels:[1,2,3,4,5,6]}}),Superscript,TextAlign.configure({types:["heading","paragraph"]})]);
  const output=schema.nodeFromJSON(article.document).toJSON();assert.equal(normalizeText(documentText(output)),article.contentText);assert.ok(JSON.stringify(output).includes('"superscript"'));
});
test("import is resumable and idempotent without title-based overwrites or engagement data",async()=>{
  const article=parseArticle(await fixture("article-az.html"),enUrl);let saved:Record<string,unknown>|null=null;let inserts=0;
  const repository:ImportRepository={
    async findExisting(){return saved?{id:"post-id",slug:String(saved.slug),legacy_source_id:String(saved.legacy_source_id),legacy_source_url:String(saved.legacy_source_url),legacy_body_hash:String(saved.legacy_body_hash)}:null;},
    async author(){return "10000000-0000-4000-8000-000000000001";},async category(){return "10000000-0000-4000-8000-000000000002";},
    async occupiedSlugs(){return new Set([archiveSlug(article.title,article.sourceId)]);},async media(){throw new Error("Unexpected media");},
    async insert(record){saved=record;inserts++;return {id:"post-id",slug:String(record.slug)};},
  };
  assert.equal((await importArticle(article,repository)).status,"imported");assert.equal((await importArticle(article,repository)).status,"skipped");assert.equal(inserts,1);
  let completions=0;repository.completeReferences=async()=>{completions++;return true;};
  await importArticle(article,repository);assert.equal(completions,0);
  assert.equal((await importArticle(article,repository,true)).referencesCompleted,true);assert.equal(completions,1);
  await importArticle({...article,contentHash:"changed"},repository,true);assert.equal(completions,1);
  assert.equal(saved?.["status"],"published");assert.equal(saved?.["published_at"],article.publishedAt);
  for(const field of ["likes","saves","comments","views"])assert.equal(field in saved!,false);
  await assert.rejects(()=>importArticle({...article,summary:""}, {...repository,findExisting:async()=>null}),/validation/);
});
test("malformed and unavailable pages fail safely",async()=>{
  assert.throws(()=>parseArticle("<main><h1>Incomplete</h1></main>",enUrl),/Expected/);assert.throws(()=>parseListing("<div>Bad archive</div>",enUrl),/Expected/);
  const original=globalThis.fetch;let attempts=0;globalThis.fetch=async()=>{attempts++;return new Response("Unavailable",{status:503});};
  try{await assert.rejects(()=>fetchSource("https://www.adalawsociety.com/en/blogs",2),/HTTP 503/);assert.equal(attempts,2);}finally{globalThis.fetch=original;}
});
test("reference completion cannot overwrite an edited or nonempty target post",async()=>{
  const article=parseArticle(await fixture("article-az.html"),enUrl);
  const pristine={created_at:"2026-09-14T00:00:00.000Z",updated_at:"2026-09-14T00:00:00.010Z",updated_by:null,status:"published",legacy_body_hash:article.contentHash,title:article.title,summary:article.summary,content_json:article.document,citations:[]};
  assert.equal(canCompleteReferences(pristine,article),true);
  for(const change of [{updated_at:"2026-09-14T00:00:02.000Z"},{updated_by:"editor@example.com"},{status:"draft"},{citations:article.citations},{summary:"Editorial change"},{content_json:{type:"doc",content:[]}},{legacy_body_hash:"different"}]){
    assert.equal(canCompleteReferences({...pristine,...change},article),false);
  }
});
