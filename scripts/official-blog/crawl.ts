import {mkdir,readFile,writeFile} from "node:fs/promises";
import {join} from "node:path";
import {chromium} from "@playwright/test";
import {articleIdentity,deduplicateLocaleArticles,hash,parseArticle,parseListing,parsePublicationDate,SOURCE_ORIGIN,type ListingEntry,type SourceArticle} from "./parser";

export const cacheDirectory=join(process.cwd(),".cache/official-blog");
export type Failure={sourceUrl:string;message:string};
export type Discovery={locale:string;listingUrls:string[];entries:ListingEntry[];browserEntries:number;paginationLinks:number;loadMoreClicks:number};
const delay=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
export async function fetchSource(url:string, attempts=3):Promise<{html:string;url:string}> {
  for(let attempt=0;attempt<attempts;attempt++){
    try {
      const response=await fetch(url,{signal:AbortSignal.timeout(30000),cache:"no-store",headers:{"User-Agent":"ADA-Law-Society-Authorized-Archive-Migration/1.0"}});
      if(!response.ok){if(response.status!==429&&response.status<500)throw new Error("HTTP "+response.status);if(attempt===attempts-1)throw new Error("HTTP "+response.status);}
      else {
        if(new URL(response.url).origin!==SOURCE_ORIGIN)throw new Error("Unexpected source redirect");
        const html=await response.text();if(html.length>5000000)throw new Error("Source page is unexpectedly large");
        if(!response.headers.get("content-type")?.includes("text/html"))throw new Error("Source response is not HTML");
        return {html,url:response.url};
      }
    }catch(error){
      if(error instanceof Error && /^HTTP 4(?!29)|Unexpected|Source /.test(error.message))throw error;
      if(attempt===attempts-1)throw new Error(error instanceof Error?error.message:"Source request failed");
    }
    await delay(600*(attempt+1));
  }
  throw new Error("Source request failed");
}

async function discover(locale:string):Promise<Discovery> {
  const first=SOURCE_ORIGIN+`/${locale}/blogs`;const pending=[first];const visited=new Set<string>();const entries=new Map<string,ListingEntry>();
  let browserEntries=0,paginationLinks=0,loadMoreClicks=0;
  const browser=await chromium.launch({headless:true});
  try {
    const context=await browser.newContext();
    await context.route("**/*",route=>["image","font","media"].includes(route.request().resourceType())?route.abort():route.continue());
    const page=await context.newPage();
    while(pending.length){
      if(visited.size>=100)throw new Error("Archive pagination exceeds safety limit");
      const url=pending.shift()!;if(visited.has(url))continue;visited.add(url);
      const raw=await fetchSource(url);const server=parseListing(raw.html,raw.url);
      for(const entry of server.entries)entries.set(entry.sourceUrl,entry);
      const response=await page.goto(url,{waitUntil:"networkidle",timeout:45000});
      if(!response?.ok() || new URL(page.url()).origin!==SOURCE_ORIGIN)throw new Error("Browser archive request failed");
      let stable=0,last="";
      for(let step=0;step<100;step++){
        await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(350);
        const rendered=parseListing(await page.content(),page.url());
        for(const entry of rendered.entries)entries.set(entry.sourceUrl,entry);
        const more=page.getByRole("button",{name:/^(load more|show more|daha çox|daha çox yüklə|daha çox göstər)$/i});
        if(await more.count() && await more.first().isVisible() && await more.first().isEnabled()){
          await more.first().click();await page.waitForTimeout(500);loadMoreClicks++;stable=0;continue;
        }
        const fingerprint=rendered.entries.map(e=>e.sourceUrl).join("|")+await page.evaluate(()=>document.body.scrollHeight);
        stable=fingerprint===last?stable+1:0;last=fingerprint;
        if(stable>=2){
          browserEntries+=rendered.entries.length;
          const next=[...new Set([...server.pagination,...rendered.pagination])];paginationLinks+=next.length;
          pending.push(...next.filter(link=>!visited.has(link)));break;
        }
        if(step===99)throw new Error("Lazy archive did not stabilize");
      }
    }
  } finally {await browser.close();}
  if(!entries.size)throw new Error("Official archive unexpectedly contains no article links");
  return {locale,listingUrls:[...visited],entries:[...entries.values()],browserEntries,paginationLinks,loadMoreClicks};
}
export async function crawlArchive(resume=false) {
  await mkdir(cacheDirectory,{recursive:true});const discovery:Discovery[]=[];const failures:Failure[]=[];
  for(const locale of ["en","az"]){
    try {discovery.push(await discover(locale));}catch(error){failures.push({sourceUrl:SOURCE_ORIGIN+`/${locale}/blogs`,message:(error as Error).message});}
  }
  const urls=[...new Set(discovery.flatMap(listing=>listing.entries.map(entry=>entry.sourceUrl)))];const parsed:SourceArticle[]=[];let cursor=0;
  async function worker(){
    while(cursor<urls.length){
      const url=urls[cursor++];try {
        const identity=articleIdentity(url)!;const filename=join(cacheDirectory,`source-${identity.locale}-${identity.sourceId}.html`);let html:string;
        if(resume){try{html=await readFile(filename,"utf8");}catch{html=(await fetchSource(url)).html;}}
        else html=(await fetchSource(url)).html;
        await writeFile(filename,html,"utf8");const article=parseArticle(html,url);
        const card=discovery.flatMap(d=>d.entries).find(entry=>entry.sourceUrl===url);
        if(!card || card.title!==article.title || card.authorName!==article.authorName || parsePublicationDate(card.publicationLabel)!==article.publishedAt)throw new Error("Detail metadata differs from its listing card");
        parsed.push(article);
      }catch(error){failures.push({sourceUrl:url,message:(error as Error).message});}
      await delay(150);
    }
  }
  await Promise.all([worker(),worker()]);let articles:SourceArticle[]=[];
  try{articles=deduplicateLocaleArticles(parsed);}catch(error){failures.push({sourceUrl:SOURCE_ORIGIN+"/en/blogs",message:(error as Error).message});}
  // An incomplete locale copy is a failure, even if its other representation parsed.
  const uniqueSourceIds=new Set(urls.map(url=>articleIdentity(url)!.sourceId));
  return {discovery,articles,failures,uniqueSourceIds:uniqueSourceIds.size,uniqueDetailUrls:urls.length,
    duplicateLocaleEntries:parsed.length-articles.length,snapshotHash:hash(JSON.stringify(articles.map(a=>[a.sourceIdentity,a.contentHash])))};
}
