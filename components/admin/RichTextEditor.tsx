"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Superscript from "@tiptap/extension-superscript";
import { Bold, Italic, Underline, Superscript as SuperscriptIcon, Link2, Unlink, List, ListOrdered, Quote, Code2, AlignLeft, AlignCenter, AlignRight, Minus, ImagePlus, Undo2, Redo2 } from "lucide-react";
import { useState } from "react";
import type { RichTextDocument } from "@/lib/cms/types";
import { safeUrl } from "@/lib/cms/rich-text";
import { CmsDialog, Field, MediaField, Notice, fieldClass } from "./CmsUi";
import { Button } from "@/components/ui/button";

const CaptionImage=Image.extend({
  addAttributes(){return {...this.parent?.(),caption:{default:"",parseHTML:el=>el.getAttribute("data-caption")??"",renderHTML:attrs=>({"data-caption":attrs.caption})}};},
});
export function RichTextEditor({value,onChange}:{value:RichTextDocument;onChange:(doc:RichTextDocument)=>void}) {
  const [imageOpen,setImageOpen]=useState(false); const [imageUrl,setImageUrl]=useState("");const [alt,setAlt]=useState("");const [caption,setCaption]=useState("");
  const [linkOpen,setLinkOpen]=useState(false);const [href,setHref]=useState("");const [error,setError]=useState("");
  const editor=useEditor({
    extensions:[StarterKit.configure({link:{openOnClick:false},heading:{levels:[1,2,3,4,5,6]}}),Superscript,CaptionImage.configure({allowBase64:false}),TextAlign.configure({types:["heading","paragraph"]}),Placeholder.configure({placeholder:"Write the full article..."})],
    content:value,immediatelyRender:false,shouldRerenderOnTransaction:true,
    editorProps:{attributes:{class:"cms-rich-text min-h-80 p-5 focus:outline-none",role:"textbox","aria-label":"Article content","aria-multiline":"true"}},
    onUpdate:({editor})=>onChange(editor.getJSON() as RichTextDocument),
  });
  if(!editor)return <div className="h-80 animate-pulse rounded-lg bg-als-blue-soft" aria-label="Loading editor"/>;
  const actions=[
    {label:"Bold",Icon:Bold,active:editor.isActive("bold"),run:()=>editor.chain().focus().toggleBold().run()},
    {label:"Italic",Icon:Italic,active:editor.isActive("italic"),run:()=>editor.chain().focus().toggleItalic().run()},
    {label:"Underline",Icon:Underline,active:editor.isActive("underline"),run:()=>editor.chain().focus().toggleUnderline().run()},
    {label:"Superscript",Icon:SuperscriptIcon,active:editor.isActive("superscript"),run:()=>editor.chain().focus().toggleSuperscript().run()},
    {label:"Link",Icon:Link2,active:editor.isActive("link"),run:()=>{setHref(editor.getAttributes("link").href??"");setLinkOpen(true);}},
    {label:"Remove link",Icon:Unlink,run:()=>editor.chain().focus().unsetLink().run()},
    {label:"Bullet list",Icon:List,active:editor.isActive("bulletList"),run:()=>editor.chain().focus().toggleBulletList().run()},
    {label:"Numbered list",Icon:ListOrdered,active:editor.isActive("orderedList"),run:()=>editor.chain().focus().toggleOrderedList().run()},
    {label:"Blockquote",Icon:Quote,active:editor.isActive("blockquote"),run:()=>editor.chain().focus().toggleBlockquote().run()},
    {label:"Code block",Icon:Code2,active:editor.isActive("codeBlock"),run:()=>editor.chain().focus().toggleCodeBlock().run()},
    {label:"Align left",Icon:AlignLeft,run:()=>editor.chain().focus().setTextAlign("left").run()},
    {label:"Align center",Icon:AlignCenter,run:()=>editor.chain().focus().setTextAlign("center").run()},
    {label:"Align right",Icon:AlignRight,run:()=>editor.chain().focus().setTextAlign("right").run()},
    {label:"Separator",Icon:Minus,run:()=>editor.chain().focus().setHorizontalRule().run()},
    {label:"Image and caption",Icon:ImagePlus,run:()=>setImageOpen(true)},
    {label:"Undo",Icon:Undo2,run:()=>editor.chain().focus().undo().run()},
    {label:"Redo",Icon:Redo2,run:()=>editor.chain().focus().redo().run()},
  ];
  return <div className="overflow-hidden rounded-lg border border-als-line bg-white">
    <div className="flex flex-wrap items-center gap-1 border-b border-als-line bg-als-blue-soft p-2" role="toolbar" aria-label="Text formatting">
      <select aria-label="Paragraph style" className="h-8 rounded border border-als-line bg-white px-2 text-sm" value={editor.isActive("heading")?String(editor.getAttributes("heading").level):"paragraph"} onChange={e=>e.target.value==="paragraph"?editor.chain().focus().setParagraph().run():editor.chain().focus().toggleHeading({level:Number(e.target.value) as 1|2|3|4|5|6}).run()}>
        <option value="paragraph">Paragraph</option>{[1,2,3,4,5,6].map(level=><option key={level} value={level}>Heading {level}</option>)}
      </select>
      {actions.map(({label,Icon,run,active})=><button type="button" key={label} title={label} aria-label={label} aria-pressed={!!active} onClick={run} className={"grid h-8 w-8 place-items-center rounded hover:bg-als-red/10 "+(active?"bg-als-red/15 text-als-red":"text-als-ink")}><Icon size={16}/></button>)}
    </div><EditorContent editor={editor}/>
    {linkOpen&&<CmsDialog title="Insert link" onClose={()=>setLinkOpen(false)}><div className="space-y-4"><Field label="URL"><input autoFocus className={fieldClass} value={href} onChange={e=>{setHref(e.target.value);setError("");}} placeholder="https://"/></Field>{error&&<Notice error>{error}</Notice>}<Button type="button" onClick={()=>{if(!safeUrl(href)){setError("Enter a valid http(s) URL.");return;}editor.chain().focus().extendMarkRange("link").setLink({href}).run();setLinkOpen(false);}}>Apply link</Button></div></CmsDialog>}
    {imageOpen&&<CmsDialog title="Insert image" onClose={()=>setImageOpen(false)}><div className="space-y-4"><MediaField value={imageUrl} onChange={setImageUrl} label="Article image"/><Field label="Image description"><input className={fieldClass} value={alt} onChange={e=>setAlt(e.target.value)}/></Field><Field label="Caption"><input className={fieldClass} value={caption} onChange={e=>setCaption(e.target.value)}/></Field><Button type="button" disabled={!imageUrl} onClick={()=>{editor.chain().focus().insertContent({type:"image",attrs:{src:imageUrl,alt,caption}}).run();setImageOpen(false);setImageUrl("");setAlt("");setCaption("");}}>Insert image</Button></div></CmsDialog>}
  </div>;
}
