import { createElement, type CSSProperties, type ReactNode } from "react";
import { isRichTextDocument, safeUrl } from "@/lib/cms/rich-text";
import type { RichTextDocument, RichTextNode } from "@/lib/cms/types";

function render(node:RichTextNode,key:string):ReactNode {
  if(node.type==="text") {
    let text:ReactNode=node.text??"";
    for(const mark of node.marks??[]) {
      const tag={bold:"strong",italic:"em",underline:"u",code:"code",strike:"s"}[mark.type as string];
      if(tag)text=createElement(tag,{key:mark.type},text);
      if(mark.type==="link"&&safeUrl(mark.attrs?.href))text=<a key="link" href={mark.attrs?.href} rel="noopener noreferrer" target="_blank">{text}</a>;
    }
    return <span key={key}>{text}</span>;
  }
  const content=node.content?.map((child,i)=>render(child,key+"-"+i));
  const style:CSSProperties={textAlign:(node.attrs?.textAlign??"left") as CSSProperties["textAlign"]};
  if(node.type==="image")return <figure key={key}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={String(node.attrs?.src??"")} alt={String(node.attrs?.alt??"")} loading="lazy"/>
    {node.attrs?.caption&&<figcaption>{String(node.attrs.caption)}</figcaption>}
  </figure>;
  if(node.type==="codeBlock")return <pre key={key}><code>{content}</code></pre>;
  const tags:Record<string,string>={paragraph:"p",bulletList:"ul",orderedList:"ol",listItem:"li",blockquote:"blockquote",horizontalRule:"hr",hardBreak:"br"};
  const tag=node.type==="heading"?"h"+Math.max(2,Number(node.attrs?.level??2)):tags[node.type];
  if(!tag)return null;
  return createElement(tag,{key,style,...(node.type==="orderedList"?{start:Number(node.attrs?.start??1)}:{})},...(content??[]));
}
export function RichTextRenderer({document}:{document:RichTextDocument}) {
  if(!isRichTextDocument(document))return null;
  return <div className="cms-rich-text">{document.content.map((node,i)=>render(node,String(i)))}</div>;
}
