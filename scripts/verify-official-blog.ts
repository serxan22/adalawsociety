import assert from "node:assert/strict";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import {join} from "node:path";
import {chromium} from "@playwright/test";
import {load} from "cheerio";
import {getSchema} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import {documentText,htmlToDocument,normalizeText,parseArticle} from "./official-blog/parser";
import {formatDate} from "../lib/format";
import {earlyTeamPeriods,teamYears} from "../data/team";
import {dictionaries} from "../dictionaries";

// Read-only verification: no authenticated actions or database/storage writes.
async function main(){
  const production=process.argv.includes("--production");
  const url=new URL(process.env.BLOG_REVIEW_URL??"http://localhost:3000");
  assert.equal(url.username+url.password,"","Do not put credentials in the review URL");
  if(production){
    assert.equal(url.protocol,"https:");
    assert.equal(url.hostname,"adalawsociety-phi.vercel.app","Production verification is restricted to the existing public deployment");
  }else assert.equal(url.hostname,"localhost","Use --production explicitly for the production review");
  const base=url.origin;
  const report=JSON.parse(await readFile("reports/official-blog/import.json","utf8")) as {
    completed:boolean;articles:{sourceId:string;sourceUrl:string;title:string;authorName:string;publishedAt:string;language:string}[];
    results:{sourceId:string;slug:string}[];
  };
  assert.ok(report.completed,"Import must be confirmed before verification");
  const output={base,checkedAt:new Date().toISOString(),routes:[] as {sourceId:string;path:string;status:number;editorRoundTrip:boolean}[],
    api:{} as Record<string,unknown>,viewports:[] as {path:string;width:number;overflow:number;brokenImages:number}[],galleryChecks:[] as number[],localeChecks:[] as string[],browserErrors:[] as string[],networkErrors:[] as string[],completed:false};
  const schema=getSchema([StarterKit.configure({heading:{levels:[1,2,3,4,5,6]}}),Superscript,TextAlign.configure({types:["heading","paragraph"]})]);
  const knownPaths=new Set(report.results.map(r=>"/blog/"+r.slug));
  for(const result of report.results){
    const article=report.articles.find(a=>a.sourceId===result.sourceId)!;
    const source=parseArticle(await readFile(join(".cache/official-blog",`source-en-${article.sourceId}.html`),"utf8"),article.sourceUrl);
    const editorDoc=schema.nodeFromJSON(source.document).toJSON();
    assert.equal(normalizeText(documentText(editorDoc)),source.contentText,"Editor round-trip text "+result.sourceId);
    const path="/blog/"+result.slug;
    const response=await fetch(base+path,{signal:AbortSignal.timeout(60000)});
    assert.equal(response.status,200,path);
    const $=load(await response.text());
    assert.equal($("h1").first().text(),source.title);
    assert.ok($("aside").text().includes(source.authorName));
    assert.ok($("article").text().includes(formatDate(source.publishedAt)));
    assert.equal($("article[lang]").attr("lang"),source.originalLanguage);
    assert.equal($("article > img").length,0,"No fabricated article cover");
    const rendered=htmlToDocument($(".cms-rich-text").html()!,base+path);
    assert.ok(normalizeText(documentText(rendered.document))===source.contentText,"Public body text differs for source "+result.sourceId);
    assert.equal($("ol.mt-5").children("li").length,source.citations.length,"Public citations "+result.sourceId);
    for(const link of $("a[href^='/blog/']").toArray())assert.ok(knownPaths.has($(link).attr("href")!),"Related link must be a genuine imported post");
    output.routes.push({sourceId:result.sourceId,path,status:response.status,editorRoundTrip:true});
  }
  async function api(query=""){
    const response=await fetch(base+"/api/editorial/blog"+query);assert.equal(response.status,200);
    return response.json() as Promise<{posts:{slug:string;author:{name:string};date:string;coverImage?:string}[];total:number;authors:string[];categories:string[];unavailable:boolean}>;
  }
  const first=await api();assert.equal(first.unavailable,false);assert.equal(first.total,16);assert.equal(first.posts.length,12);assert.equal(first.authors.length,14);
  const second=await api("?page=2");assert.equal(second.posts.length,4);
  assert.equal(new Set([...first.posts,...second.posts].map(p=>p.slug)).size,16);
  assert.ok([...first.posts,...second.posts].every(p=>!p.coverImage),"No fabricated cover in the archive");
  assert.deepEqual(first.categories,["Legal Articles"]);
  const author=await api("?author="+encodeURIComponent("Asim Zülfüqarlı"));assert.equal(author.total,2);assert.ok(author.posts.every(p=>p.author.name==="Asim Zülfüqarlı"));
  const category=await api("?category=Legal%20Articles");assert.equal(category.total,16);
  const noMatches=await api("?q=zzzz-unmatched-official-blog-check");assert.equal(noMatches.total,0);
  const news=await (await fetch(base+"/api/editorial/news")).json();assert.equal(news.total,0);assert.deepEqual(news.posts,[]);
  const galleryResponse=await fetch(base+"/api/gallery");assert.equal(galleryResponse.status,200);
  const gallery=await galleryResponse.json() as {items:{id:string;image_url:string}[];unavailable:boolean};
  assert.equal(gallery.unavailable,false);
  assert.ok(gallery.items.every(item=>!item.image_url.includes("/images/placeholders/")),"Gallery does not fall back to demo images");
  for(const team of teamYears){
    const response=await fetch(base+"/team/"+team.year);assert.equal(response.status,200);
    const $=load(await response.text());
    for(const member of team.members){
      const card=$("article").filter((_,element)=>$(element).find("h3").text()===member.name);
      assert.equal(card.length,1,"Year-specific member appears exactly once: "+team.year+" "+member.name);
      assert.ok(card.text().includes(member.role),"Historical role preserved: "+member.name);
    }
    assert.ok(!/Links pending|Year Story|Featured Leadership|Profile pending/.test($("main").text()),"Rejected Team scaffolding remains absent");
  }
  const archive=load(await (await fetch(base+"/team")).text());
  for(const period of earlyTeamPeriods)for(const member of period.members)assert.ok(archive("main").text().includes(member.name));
  const home=load(await (await fetch(base)).text());
  for(const post of first.posts.slice(0,3))assert.ok(home(`a[href='/blog/${post.slug}']`).length,"Homepage features newest genuine Blog posts");
  for(const slug of ["the-role-of-moot-courts-in-legal-education","introduction-to-legal-research-for-law-students"]){
    assert.equal((await fetch(base+"/blog/"+slug)).status,404);
  }
  const protectedRoutes=[];
  for(const path of ["/admin/blog","/admin/authors","/admin/gallery","/admin/team","/admin/blog/new","/admin/blog/"+report.results[0].sourceId+"/edit"]){
    const response=await fetch(base+path,{redirect:"manual"});assert.ok([302,303,307,308].includes(response.status),"Anonymous admin route status "+path+": "+response.status);
    assert.ok(response.headers.get("location")?.includes("/admin/login"),"Anonymous redirect destination "+path);protectedRoutes.push(path);
  }
  for(const path of ["/api/admin/editorial/blog","/api/admin/editorial/lookups/all","/api/admin/gallery","/api/admin/team/photos"]){
    const response=await fetch(base+path,{redirect:"manual"});assert.ok([401,403].includes(response.status),"Anonymous admin API status "+path+": "+response.status);
  }
  output.api={articles:16,authors:14,pageSizes:[12,4],authorFilterCount:2,categoryFilterCount:16,news:0,homepageLatestGenuinePosts:true,relatedLinksGenuine:true,retiredExamples404:true,protectedRoutes};
  output.api.galleryItems=gallery.items.length;output.api.teamYears=teamYears.map(team=>team.year);
  const directory=production?".cache/official-blog/production-qa":".cache/official-blog/qa";await mkdir(directory,{recursive:true});
  const browser=await chromium.launch();
  try{
    for(const width of [375,768,1440]){
      const context=await browser.newContext({viewport:{width,height:960},reducedMotion:"reduce"});
      const page=await context.newPage();page.on("pageerror",error=>output.browserErrors.push(error.message));
      page.on("console",message=>{if(message.type()==="error")output.browserErrors.push(message.text());});
      page.on("requestfailed",request=>{if(request.failure()?.errorText!=="net::ERR_ABORTED")output.networkErrors.push(request.method()+" "+request.url()+" "+request.failure()?.errorText);});
      page.on("response",response=>{if(response.status()>=400)output.networkErrors.push(response.status()+" "+response.url());});
      for(const path of ["/","/blog","/news","/gallery","/team",...teamYears.map(team=>"/team/"+team.year),...output.routes.filter(r=>["20","19","3","6"].includes(r.sourceId)).map(r=>r.path)]){
        const response=await page.goto(base+path,{waitUntil:"networkidle",timeout:60000});assert.equal(response?.status(),200);
        await page.waitForTimeout(700);
        const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.getBoundingClientRect().width>0).length}));
        output.viewports.push({path,width,...layout});
        assert.ok(layout.overflow<=1,"Horizontal overflow "+width+" "+path+": "+layout.overflow);
        assert.equal(layout.brokenImages,0,"Broken images "+path);
        const visibleText=await page.locator("main").innerText();
        assert.ok(!/ALS Blog Placeholder Author|Placeholder author|Links pending|Add upcoming|Guest Reader|\bmin read\b/i.test(visibleText),"No visitor-facing demo content: "+path);
        if(path.startsWith("/team/")||path==="/"||path==="/news")await page.screenshot({path:join(directory,`${path.slice(1).replaceAll("/","-")||"home"}-${width}.png`)});
        if(path==="/gallery"&&gallery.items.length){
          const trigger=page.locator("main button").filter({has:page.locator("img")}).first();
          await trigger.scrollIntoViewIfNeeded();await trigger.click();
          const dialog=page.getByRole("dialog");await dialog.waitFor({state:"visible"});
          assert.equal(await page.evaluate(()=>document.body.style.overflow),"hidden");
          const image=dialog.locator("img");await image.waitFor({state:"visible"});
          await page.waitForFunction(()=>{const image=document.querySelector("dialog img") as HTMLImageElement|null;return !!image?.complete&&image.naturalWidth>0;});
          assert.equal(await image.evaluate(element=>getComputedStyle(element).objectFit),"contain");
          const beforeWheel=await page.evaluate(()=>scrollY);
          await page.mouse.wheel(0,600);await page.waitForTimeout(500);
          assert.ok(Math.abs(await page.evaluate(()=>scrollY)-beforeWheel)<=1,"Gallery locks background wheel scrolling");
          await page.keyboard.press("Tab");
          assert.ok(await dialog.evaluate(element=>element.contains(document.activeElement)),"Gallery traps keyboard focus");
          await page.keyboard.press("Shift+Tab");
          assert.ok(await dialog.evaluate(element=>element.contains(document.activeElement)),"Gallery traps reverse keyboard focus");
          await page.keyboard.press("ArrowRight");await page.keyboard.press("ArrowLeft");
          await page.waitForTimeout(500);
          await page.screenshot({path:join(directory,`gallery-dialog-${width}.png`)});
          await page.keyboard.press("Escape");await dialog.waitFor({state:"detached"});
          assert.notEqual(await page.evaluate(()=>document.body.style.overflow),"hidden");
          assert.ok(await trigger.evaluate(element=>element===document.activeElement),"Gallery restores keyboard focus");
          output.galleryChecks.push(width);
        }
        if(path==="/blog"){
          await page.screenshot({path:join(directory,`blog-${width}.png`)});
          const featured=page.locator("h2").filter({hasText:report.articles[0].title}).first();
          await featured.scrollIntoViewIfNeeded();await page.waitForTimeout(500);
          await page.screenshot({path:join(directory,`featured-${width}.png`)});
          const readLinks=page.locator('a[href^="/blog/"]').filter({hasText:"Read blog"});
          assert.equal(await readLinks.count(),12);
          await page.getByRole("navigation",{name:"Pagination"}).getByRole("button",{name:"Next",exact:true}).click();
          await page.waitForFunction(()=>document.querySelector('nav[aria-label="Pagination"]')?.textContent?.includes("2 / 2"));
          await page.waitForTimeout(1200);assert.equal(await readLinks.count(),4);
          await page.getByRole("navigation",{name:"Pagination"}).getByRole("button",{name:"Previous",exact:true}).click();
          await page.waitForFunction(()=>document.querySelector('nav[aria-label="Pagination"]')?.textContent?.includes("1 / 2"));
          await page.waitForTimeout(1200);
          const select=page.locator("select");await select.selectOption("Asim Zülfüqarlı");await page.waitForTimeout(1500);
          assert.equal(await page.locator('a[href^="/blog/"]').filter({hasText:"Read blog"}).count(),2);
        }
        if(path.endsWith(report.results.find(r=>r.sourceId==="3")!.slug)){
          await page.locator(".cms-rich-text").scrollIntoViewIfNeeded();await page.waitForTimeout(500);
          await page.screenshot({path:join(directory,`oldest-${width}.png`)});
        }
      }
      await context.close();
    }
    const context=await browser.newContext({viewport:{width:375,height:960},reducedMotion:"reduce"});
    try{
      const page=await context.newPage();page.on("pageerror",error=>output.browserErrors.push(error.message));
      page.on("console",message=>{if(message.type()==="error")output.browserErrors.push(message.text());});
      for(const locale of ["az","ru","en"] as const){
        await page.goto(base+"/news",{waitUntil:"networkidle"});
        const name={az:"Azerbaijani",ru:"Russian",en:"English"}[locale];
        const current=await page.locator("html").getAttribute("lang") as keyof typeof dictionaries;
        await page.getByRole("button",{name:dictionaries[current].nav.menu,exact:true}).click();
        await page.getByRole("button",{name:"Switch to "+name,exact:true}).last().click();
        await page.waitForFunction(expected=>document.documentElement.lang===expected,locale);
        assert.ok((await page.locator("main").innerText()).includes(dictionaries[locale].publication.emptyNews));
        await page.reload({waitUntil:"networkidle"});assert.equal(await page.locator("html").getAttribute("lang"),locale);
        await page.goto(base+output.routes.find(route=>route.sourceId==="19")!.path,{waitUntil:"networkidle"});
        assert.equal(await page.locator("article[lang]").getAttribute("lang"),"az","Original article language is independent of interface locale");
        assert.ok((await page.locator("main").innerText()).includes(report.articles.find(article=>article.sourceId==="19")!.title));
        output.localeChecks.push(locale);
      }
    }finally{await context.close();}
    assert.deepEqual(output.browserErrors,[]);
    assert.deepEqual(output.networkErrors,[]);
    output.completed=true;
  }finally{await browser.close();await writeFile(production?"reports/official-blog/production-verification.json":"reports/official-blog/public-verification.json",JSON.stringify(output,null,2)+"\n","utf8");}
  console.log(JSON.stringify(output));
}
main().catch(error=>{console.error(error instanceof Error?error.stack:"Verification failed");process.exitCode=1;});
