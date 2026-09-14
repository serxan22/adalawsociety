import {mkdir,writeFile} from "node:fs/promises";
import {dirname,join,resolve} from "node:path";
import {cacheDirectory,crawlArchive} from "./official-blog/crawl";
import {archiveSlug} from "./official-blog/parser";
import {configuredClients,importArticle,preflight,SupabaseImportRepository,verifyImport,type ImportResult} from "./official-blog/persist";
import {postSchema} from "../lib/cms/validation";

async function main(){
  const args=process.argv.slice(2);const importing=args.includes("--import");const dry=args.includes("--dry-run");
  const value=(flag:string)=>{const i=args.indexOf(flag);return i>=0?args[i+1]:undefined;};
  const allowed=new Set(["--import","--dry-run","--resume","--complete-references","--target-project","--report","--help"]);
  for(let i=0;i<args.length;i++){if(!allowed.has(args[i]))throw new Error("Unknown option: "+args[i]);if(["--target-project","--report"].includes(args[i])){if(!args[++i]||args[i].startsWith("--"))throw new Error("Missing option value");}}
  if(args.includes("--help")){console.log("npm run migrate:blogs -- --dry-run\nnpm run migrate:blogs -- --import --target-project <configured-project-ref>\nOptional: --resume (reuse validated source snapshots), --report <path>");return;}
  if(importing===dry)throw new Error("Choose exactly one of --dry-run or --import");
  if(args.includes("--complete-references")&&!importing)throw new Error("Reference completion requires explicit --import");
  const clients=configuredClients();if(importing&&value("--target-project")!==clients.projectRef)throw new Error("Explicit --target-project must match the configured Supabase project");
  const targetBefore=await preflight(clients.db);
  console.log(JSON.stringify({mode:importing?"import":"dry-run",targetProject:clients.projectRef,targetBefore}));
  const crawl=await crawlArchive(args.includes("--resume"));
  for(const article of crawl.articles){
    const validation=postSchema.safeParse({title:article.title,slug:archiveSlug(article.title,article.sourceId),excerpt:article.summary,summary:article.summary,content:article.document,citations:article.citations,
      authorId:"10000000-0000-4000-8000-000000000001",categoryId:"10000000-0000-4000-8000-000000000002",status:"published",publishedAt:article.publishedAt});
    if(!validation.success)crawl.failures.push({sourceUrl:article.sourceUrl,message:"CMS validation: "+validation.error.issues.map(issue=>issue.path.join(".")).join(", ")});
  }
  const names=[...new Set(crawl.articles.map(article=>article.authorName))].sort();
  const reportPath=resolve(value("--report")??`reports/official-blog/${importing?"import":"dry-run"}.json`);
  const report={generatedAt:new Date().toISOString(),mode:importing?"import":"dry-run",source:"https://www.adalawsociety.com",targetProject:clients.projectRef,targetBefore,
    discovery:crawl.discovery,uniqueDetailUrls:crawl.uniqueDetailUrls,uniqueOfficialArticles:crawl.uniqueSourceIds,duplicateLocaleEntries:crawl.duplicateLocaleEntries,
    validatedArticles:crawl.articles.length,snapshotHash:crawl.snapshotHash,sourceSnapshotsReused:args.includes("--resume"),
    authors:names,authorSpellingAmbiguities:names.includes("İnci Açak")&&names.includes("İnji Achak")?[["İnci Açak","İnji Achak"]]:[],
    technicalCategory:"Legal Articles (source has no explicit category)",dateNormalization:"Source gives calendar dates, not times; stored at 00:00 UTC on the original date.",
    deduplication:"Same numeric legacy ID on en/az routes is one record only after exact normalized metadata and structured-body hashes match. Different IDs remain separate. Exact credited author spelling is the only available source author identity; no similarity merging.",
    existingRecordPolicy:"Skip exact legacy ID/URL matches and never overwrite posts or Author profiles. Only explicit --complete-references may fill empty citations on an untouched import with identical source hash, title, summary and rich text, guarded by updated_at. Source drift requires review.",
    articles:crawl.articles.map(a=>({sourceId:a.sourceId,sourceIdentity:a.sourceIdentity,sourceUrl:a.sourceUrl,sourceUrls:a.sourceUrls,title:a.title,authorName:a.authorName,publicationLabel:a.publicationLabel,
      publishedAt:a.publishedAt,language:a.originalLanguage,summaryExists:!!a.summary,coverImage:a.coverImageUrl,inlineImages:a.images,citations:a.citations.length,referenceHandling:a.citations.length?"References retained in body and extracted separately":"All reference material remains in the body; separate extraction is absent or ambiguous",bodyCharacters:a.contentText.length,contentHash:a.contentHash,warnings:a.warnings})),
    failures:crawl.failures,results:[] as ImportResult[],verification:null as Awaited<ReturnType<typeof verifyImport>>|null,authorsCreated:0,redirectMap:[] as {sourceUrl:string;targetPath:string}[],completed:false};
  const saveReport=async()=>{await mkdir(dirname(reportPath),{recursive:true});await writeFile(reportPath,JSON.stringify(report,null,2)+"\n","utf8");};
  await saveReport();
  console.log(JSON.stringify({listingEntries:Object.fromEntries(crawl.discovery.map(d=>[d.locale,d.entries.length])),uniqueOfficialArticles:crawl.uniqueSourceIds,validated:crawl.articles.length,
    localeDuplicates:crawl.duplicateLocaleEntries,uniqueAuthors:names.length,articlesWithoutImages:crawl.articles.filter(a=>!a.coverImageUrl&&!a.images.length).length,failures:report.failures,reportPath}));
  if(report.failures.length)throw new Error("Archive validation failed. No content was imported; inspect the report.");
  if(!importing){report.completed=true;await saveReport();return;}
  if(!targetBefore.schemaReady)throw new Error("Apply the additive official_blog_archive migration before import. No content was imported.");
  const repository=new SupabaseImportRepository(clients.db);
  for(const article of crawl.articles){
    try {const result=await importArticle(article,repository,args.includes("--complete-references"));report.results.push(result);console.log(JSON.stringify({sourceId:result.sourceId,status:result.status,slug:result.slug,referencesCompleted:result.referencesCompleted}));}
    catch(error){report.failures.push({sourceUrl:article.sourceUrl,message:(error as Error).message});}
    await writeFile(join(cacheDirectory,"checkpoint.json"),JSON.stringify(report.results,null,2),"utf8");await saveReport();
  }
  report.verification=await verifyImport(clients.db,clients.publicDb,crawl.articles);const after=await preflight(clients.db);report.authorsCreated=after.authors-targetBefore.authors;
  report.redirectMap=report.results.flatMap(result=>crawl.articles.find(a=>a.sourceId===result.sourceId)!.sourceUrls.map(sourceUrl=>({sourceUrl,targetPath:"/blog/"+result.slug})));
  report.completed=report.failures.length===0&&report.verification.errors.length===0;await saveReport();
  console.log(JSON.stringify({imported:report.results.filter(r=>r.status==="imported").length,skipped:report.results.filter(r=>r.status==="skipped").length,referencesCompleted:report.results.filter(r=>r.referencesCompleted).length,failed:report.failures.length,authorsCreated:report.authorsCreated,verification:report.verification,reportPath}));
  if(!report.completed)throw new Error("Import or verification needs review. Completed records are preserved; rerun with --resume to continue safely.");
}
main().catch(error=>{console.error("Migration stopped:",error instanceof Error?error.message:"Unexpected migration error");process.exitCode=1;});
