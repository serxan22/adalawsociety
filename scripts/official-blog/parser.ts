import {createHash} from "node:crypto";
import {load, type CheerioAPI} from "cheerio";
import type {AnyNode, Element} from "domhandler";
import type {Citation} from "../../data/articles";
import {isRichTextDocument, safeUrl} from "../../lib/cms/rich-text";
import type {RichTextDocument, RichTextMark, RichTextNode} from "../../lib/cms/types";

export const SOURCE_ORIGIN = "https://www.adalawsociety.com";
export type ListingEntry = {sourceId:string; sourceUrl:string; locale:string; title:string; authorName:string; publicationLabel:string};
export type SourceImage = {sourceUrl:string; alt:string; caption:string};
export type SourceArticle = {
  sourceId:string; sourceIdentity:string; sourceUrl:string; sourceUrls:string[];
  title:string; authorName:string; publicationLabel:string; publishedAt:string;
  summary:string; document:RichTextDocument; contentText:string; contentHash:string;
  originalLanguage:"az"|"en"; images:SourceImage[]; coverImageUrl:string|null;
  citations:Citation[]; warnings:string[];
};
export const normalizeText = (text:string) => text.replace(/\s+/gu, " ").trim();
export const hash = (text:string) => createHash("sha256").update(text).digest("hex");
const forbidden = new Set(["script","style","iframe","object","embed","form","input","button","noscript"]);
const blockTags = new Set(["p","div","section","article","h1","h2","h3","h4","h5","h6","li","ul","ol","blockquote","pre","figure","figcaption","hr","br"]);
const tag = (node:AnyNode) => "tagName" in node ? node.tagName.toLowerCase() : "";

export function sourceUrl(value:string, base=SOURCE_ORIGIN) {
  const url = new URL(value, base);
  if (!safeUrl(url.href)) throw new Error("Unsafe source URL");
  return url.href;
}
export function articleIdentity(value:string) {
  const url = new URL(value, SOURCE_ORIGIN);
  if (!['www.adalawsociety.com','adalawsociety.com'].includes(url.hostname) || url.protocol !== "https:") return null;
  const match = url.pathname.match(/^\/(en|az)\/blogs\/(\d+)\/?$/);
  return match ? {sourceId:match[2],locale:match[1],sourceUrl:SOURCE_ORIGIN+`/${match[1]}/blogs/${match[2]}`} : null;
}
export function parseListing(html:string, url:string) {
  const $=load(html); const main=$("main");
  if (main.length!==1) throw new Error("Expected one archive main element");
  const entries:ListingEntry[]=[];
  main.find("a[href]").each((_,element)=>{
    const a=$(element); if (!/Continue reading|Oxumağa davam edin/i.test(a.text())) return;
    const identity=articleIdentity(sourceUrl(a.attr("href")!,url));
    if (!identity) throw new Error("Unrecognized article link in archive");
    const card=a.parent(); const title=normalizeText(card.children("h2").text());
    const authorName=normalizeText(card.children("p").first().text());
    let parent=card.parent(); let publicationLabel="";
    for(let depth=0;depth<4&&!publicationLabel;depth++,parent=parent.parent()) publicationLabel=normalizeText(parent.children("h3").first().text());
    if (!title || !authorName || !publicationLabel) throw new Error("Incomplete archive card metadata");
    entries.push({...identity,title,authorName,publicationLabel});
  });
  const pagination=new Set<string>();
  main.find("a[href]").each((_,element)=>{
    const href=sourceUrl($(element).attr("href")!,url); const next=new URL(href);
    if (next.origin===SOURCE_ORIGIN && /^\/(en|az)\/blogs\/?$/.test(next.pathname) && next.search && href!==url) pagination.add(href);
  });
  return {entries,pagination:[...pagination]};
}

const months:Record<string,number> = {
  january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,
  yanvar:1,fevral:2,mart:3,aprel:4,iyun:6,iyul:7,avqust:8,sentyabr:9,oktyabr:10,noyabr:11,dekabr:12,
};
export function parsePublicationDate(label:string) {
  const match=normalizeText(label).toLocaleLowerCase("az").match(/^(\d{1,2})\s+(\p{L}+)\s+(\d{4})$/u);
  if (!match || !months[match[2]]) throw new Error("Unknown publication date: "+label);
  const day=Number(match[1]),month=months[match[2]],year=Number(match[3]); const date=new Date(Date.UTC(year,month-1,day));
  if (date.getUTCFullYear()!==year || date.getUTCMonth()!==month-1 || date.getUTCDate()!==day) throw new Error("Invalid publication date: "+label);
  return date.toISOString();
}
export function detectLanguage(text:string):"az"|"en" {
  const words=text.toLocaleLowerCase("az").match(/\p{L}+/gu)??[];
  const en=new Set(["the","and","of","to","in","is","that","for","with","this","as","a","are","be"]);
  const az=new Set(["və","bir","bu","ilə","üçün","kimi","olan","hüquq","daha","lakin","isə","həmçinin","üzrə"]);
  const score=(dictionary:Set<string>)=>words.filter(word=>dictionary.has(word)).length;
  const e=score(en),a=score(az);
  if(Math.max(e,a)<3 || Math.abs(e-a)<3) throw new Error("Content language requires manual confirmation");
  return a>e?"az":"en";
}
function domText(node:AnyNode):string {
  if (node.type==="text") return node.data;
  const name=tag(node); if(forbidden.has(name))return "";
  const value="children" in node?node.children.map(domText).join(""):"";
  return blockTags.has(name)?" "+value+" ":value;
}
export function documentText(node:RichTextNode|RichTextDocument):string {
  if(node.type==="text")return node.text??"";
  if(node.type==="image")return " "+(node.attrs?.caption??"")+" ";
  if(node.type==="hardBreak")return " ";
  return " "+(node.content?.map(documentText).join("")??"")+" ";
}
function inlineText(nodes:RichTextNode[]) {
  return nodes.map(node=>node.type==="text"?node.text??"":node.type==="hardBreak"?" ":"").join("");
}
function trimInline(nodes:RichTextNode[]) {
  const result=nodes.map(node=>({...node}));
  while(result.length && (result[0].type==="hardBreak" || result[0].type==="text"&&!result[0].text?.trim()))result.shift();
  while(result.length && (result.at(-1)!.type==="hardBreak" || result.at(-1)!.type==="text"&&!result.at(-1)!.text?.trim()))result.pop();
  if(result[0]?.type==="text")result[0].text=result[0].text?.trimStart();
  if(result.at(-1)?.type==="text")result.at(-1)!.text=result.at(-1)!.text?.trimEnd();
  return result;
}
function styles(value:string) {
  return Object.fromEntries(value.split(";").map(rule=>{const colon=rule.indexOf(":");return [rule.slice(0,colon).trim().toLowerCase(),rule.slice(colon+1).trim().toLowerCase()];}).filter(([key])=>key));
}

export function htmlToDocument(html:string, base:string) {
  const $=load(html,null,false); const warnings:string[]=[]; const images:SourceImage[]=[];
  function image(element:Element):RichTextNode {
    const e=$(element); const src=e.attr("src"); if(!src)throw new Error("Article image has no source");
    const url=sourceUrl(src,base); const caption=e.closest("figure").children("figcaption").text() || e.attr("data-caption") || "";
    const attrs={src:url,alt:e.attr("alt")??"",caption:normalizeText(caption)};
    images.push({sourceUrl:url,alt:attrs.alt,caption:attrs.caption}); return {type:"image",attrs};
  }
  function inline(node:AnyNode, inherited:RichTextMark[]=[]):RichTextNode[] {
    if(node.type==="text")return node.data?[{type:"text",text:node.data.replace(/\s+/gu," "),...(inherited.length?{marks:inherited}:{})}]:[];
    const name=tag(node); if(forbidden.has(name)){warnings.push("Removed unsafe/unrelated "+name+" element");return [];}
    if(name==="br")return [{type:"hardBreak"}]; if(name==="img")return [image(node as Element)];
    const e=$(node); const css=styles(e.attr("style")??""); const marks=[...inherited];
    const mark:Record<string,RichTextMark["type"]>={b:"bold",strong:"bold",i:"italic",em:"italic",u:"underline",sup:"superscript",s:"strike",strike:"strike",del:"strike",code:"code"};
    if(mark[name])marks.push({type:mark[name]});
    if(css["font-weight"]==="bold" || Number(css["font-weight"])>=600)marks.push({type:"bold"});
    if(css["font-style"]==="italic")marks.push({type:"italic"});
    if(css["text-decoration"]?.includes("underline"))marks.push({type:"underline"});
    if(name==="sub")throw new Error("Subscript requires editor support before import");
    if(name==="a" && e.attr("href")) {
      try {marks.push({type:"link",attrs:{href:sourceUrl(e.attr("href")!,base)}});} catch {warnings.push("Removed unsafe link while preserving its text");}
    }
    const unique=[...new Map(marks.map(mark=>[mark.type,mark])).values()];
    return "children" in node?node.children.flatMap(child=>inline(child,unique)):[];
  }
  function paragraph(element:Element):RichTextNode[] {
    const name=tag(element),level=/^h[1-6]$/.test(name)?Number(name[1]):null;
    const css=styles($(element).attr("style")??""); const align=["left","right","center","justify"].includes(css["text-align"])?css["text-align"]:null;
    const content=element.children.flatMap(child=>inline(child));
    // The oldest source wraps multiple break-separated paragraphs in one h2.
    // Reflow only explicit double breaks; never infer or rewrite the author's words.
    if(level && inlineText(content).length>1500 && content.filter(n=>n.type==="hardBreak").length>2) {
      warnings.push("Source has a multi-paragraph heading wrapper; explicit double-break blocks were restored without changing text");
      const groups:RichTextNode[][]=[[]];
      for(let i=0;i<content.length;i++){
        if(content[i].type==="hardBreak" && content[i+1]?.type==="hardBreak"){groups.push([]);while(content[i+1]?.type==="hardBreak")i++;}
        else groups.at(-1)!.push(content[i]);
      }
      return groups.map(trimInline).filter(group=>group.length).map((group):RichTextNode=>{
        const heading=group.filter(n=>n.type==="text").every(n=>!n.text?.trim()||n.marks?.some(m=>m.type==="bold"));
        const attrs:RichTextNode["attrs"]=heading?{level}:align?{textAlign:align}:undefined;
        return {type:heading?"heading":"paragraph",...(attrs?{attrs}:{}),content:group};
      });
    }
    const result:RichTextNode[]=[]; let buffer:RichTextNode[]=[];
    const flush=()=>{const text=trimInline(buffer);if(text.length)result.push({type:level?"heading":"paragraph",...(level?{attrs:{level,...(align?{textAlign:align}:{})}}:align?{attrs:{textAlign:align}}:{}),content:text});buffer=[];};
    for(const node of content){if(node.type==="image"){flush();result.push(node);}else buffer.push(node);}flush();return result;
  }
  function block(node:AnyNode):RichTextNode[] {
    const name=tag(node); if(forbidden.has(name)){warnings.push("Removed unsafe/unrelated "+name+" element");return [];}
    if(name==="p" || /^h[1-6]$/.test(name))return paragraph(node as Element);
    if(name==="img")return [image(node as Element)];
    if(name==="figure") {const imgs=$(node).children("img");if(imgs.length!==1)throw new Error("Unrecognized article figure");return [image(imgs[0] as Element)];}
    if(name==="hr")return [{type:"horizontalRule"}];
    if(name==="ul"||name==="ol"){
      const content=$(node).children("li").toArray().map(li=>({type:"listItem",content:blocks((li as Element).children)}));
      if(!content.length)throw new Error("Empty/invalid source list");
      const start=Number($(node).attr("start")??1);if(!Number.isInteger(start)||start<1)throw new Error("Invalid list start");
      return [{type:name==="ul"?"bulletList":"orderedList",...(name==="ol"?{attrs:{start}}:{}),content}];
    }
    if(name==="blockquote")return [{type:"blockquote",content:blocks((node as Element).children)}];
    if(name==="pre")return [{type:"codeBlock",content:[{type:"text",text:$(node).text()}]}];
    if(name==="table"||name==="video"||name==="audio")throw new Error("Unsupported article structure: "+name);
    if(["div","article","section"].includes(name))return blocks((node as Element).children);
    const content=trimInline(inline(node));return content.length?[{type:"paragraph",content}]:[];
  }
  function blocks(children:AnyNode[]):RichTextNode[] {
    const result:RichTextNode[]=[];let buffer:AnyNode[]=[];
    const flush=()=>{const content=trimInline(buffer.flatMap(node=>inline(node)));if(content.length)result.push({type:"paragraph",content});buffer=[];};
    for(const node of children){if(blockTags.has(tag(node)) || tag(node)==="img" || tag(node)==="table"){flush();result.push(...block(node));}else buffer.push(node);}flush();return result;
  }
  const document:RichTextDocument={type:"doc",content:blocks($.root().contents().toArray())};
  if(!isRichTextDocument(document) || !normalizeText(documentText(document)))throw new Error("Invalid or empty converted body");
  const original=normalizeText($.root().contents().toArray().map(domText).join(""));
  if(original!==normalizeText(documentText(document)))throw new Error("Converted body does not preserve all source text");
  return {document,warnings:[...new Set(warnings)],images};
}

function extractCitations(document:RichTextDocument,warnings:string[]):Citation[] {
  const rows=document.content.map(node=>normalizeText(documentText(node)));
  const marker=/^(?:[ivx]+\.\s*)?(bibliography|biblioqrafiya|references|istinadlar|istinad edilən qanunvericilik və qərarlar|ədəbiyyat(?: siyahısı)?|mənbələr)\s*[.:]?$/u;
  const folded=(text:string)=>text.replace(/İ/g,"I").replace(/ı/g,"i").toLowerCase();
  let index=-1;for(let i=0;i<rows.length;i++)if(marker.test(folded(rows[i])))index=i;
  if(index<0){warnings.push("No separately marked reference section; any inline references remain in the full body");return [];}
  const sources=rows.slice(index+1).filter(Boolean);const parsed=sources.map(row=>row.match(/^\[?(\d+)\]?[.)]?\s*(.+)$/u));
  if(!sources.length || parsed.some(row=>!row)){warnings.push("Reference section has ambiguous boundaries; preserved in body only");return [];}
  return parsed.map(row=>({label:row![1],source:row![2]}));
}
export function parseArticle(html:string, url:string):SourceArticle {
  const identity=articleIdentity(url);if(!identity)throw new Error("Invalid source article URL");
  const $:CheerioAPI=load(html);const main=$("main");const heading=main.find("h1");const body=main.find(".prose");
  if(main.length!==1 || heading.length!==1 || body.length!==1)throw new Error("Expected one article title and one rich-text body");
  const title=normalizeText(heading.text());const author=normalizeText(heading.next("p").text());
  const authorName=author.replace(/^(By|Tərəfindən|Müəllif)\s*:?\s+/u,"");
  if(authorName===author || !authorName)throw new Error("Missing credited author");
  const publicationLabel=normalizeText(heading.next("p").next("p").text());const publishedAt=parsePublicationDate(publicationLabel);
  const summaryPanel=body.prev();if(!/^(Summary|Xülasə)\s*:$/iu.test(normalizeText(summaryPanel.children("h3").text())))throw new Error("Missing explicit source summary");
  const summary=normalizeText(summaryPanel.children("p").text());if(!summary || !title)throw new Error("Incomplete article metadata");
  const converted=htmlToDocument(body.html()??"",url);const contentText=normalizeText(documentText(converted.document));
  const originalLanguage=detectLanguage(contentText);const citations=extractCitations(converted.document,converted.warnings);
  const cover=body.parent().children("img");if(cover.length>1)throw new Error("Ambiguous cover image");
  const coverImageUrl=cover.length?sourceUrl(cover.attr("src")!,url):null;
  const result={sourceId:identity.sourceId,sourceIdentity:"adalawsociety.com/blogs/"+identity.sourceId,sourceUrl:identity.sourceUrl,sourceUrls:[identity.sourceUrl],title,authorName,publicationLabel,publishedAt,summary,document:converted.document,contentText,originalLanguage,images:converted.images,coverImageUrl,citations,warnings:converted.warnings};
  const contentHash=hash(JSON.stringify({title,authorName,publishedAt,summary,document:result.document,originalLanguage}));
  return {...result,contentHash};
}
export function deduplicateLocaleArticles(articles:SourceArticle[]) {
  const unique=new Map<string,SourceArticle>();
  for(const article of articles){
    const current=unique.get(article.sourceIdentity);
    if(current && current.contentHash!==article.contentHash)throw new Error("Locale content differs for source ID "+article.sourceId+"; manual confirmation required");
    if(current)current.sourceUrls=[...new Set([...current.sourceUrls,...article.sourceUrls])].sort();
    else unique.set(article.sourceIdentity,{...article,sourceUrls:[...article.sourceUrls]});
  }
  return [...unique.values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)||Number(b.sourceId)-Number(a.sourceId));
}
export function authorIdentity(name:string) {return "adalawsociety.com/name/"+hash(name);}
export function archiveSlug(title:string, sourceId:string) {
  const ascii=title.replace(/[əƏ]/g,"e").replace(/[ıİ]/g,"i").normalize("NFKD").replace(/\p{M}/gu,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  return (ascii||"blog").slice(0,100).replace(/-$/g,"")+"-als-"+sourceId;
}
export function chooseSlug(base:string, identity:string, occupied:Set<string>) {
  if(!occupied.has(base))return base;
  const suffix=hash(identity).slice(0,10);const alternate=base.slice(0,108).replace(/-$/g,"")+"-"+suffix;
  if(occupied.has(alternate))throw new Error("Deterministic slug collision requires manual confirmation");
  return alternate;
}
