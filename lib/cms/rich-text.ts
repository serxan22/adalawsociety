import type { RichTextDocument, RichTextNode } from "./types";

const nodes = new Set(["doc", "paragraph", "text", "heading", "bulletList", "orderedList", "listItem", "blockquote", "codeBlock", "hardBreak", "horizontalRule", "image"]);
const marks = new Set(["bold", "italic", "underline", "link", "code", "strike"]);
export const emptyRichTextDocument: RichTextDocument = { type: "doc", content: [{ type: "paragraph" }] };

export function safeUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2000 || /[\s\\\u0000-\u001f]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}

export function isRichTextDocument(value: unknown): value is RichTextDocument {
  let count = 0;
  function valid(item: unknown, depth: number): boolean {
    if (!item || typeof item !== "object" || Array.isArray(item) || depth > 24 || ++count > 20000) return false;
    const node = item as RichTextNode;
    if (!nodes.has(node.type) || (node.type === "doc" && depth !== 0)) return false;
    if (node.text !== undefined && (node.type !== "text" || typeof node.text !== "string" || node.text.length > 100000)) return false;
    if (node.marks && (!Array.isArray(node.marks) || !node.marks.every(mark => mark && marks.has(mark.type) && (mark.type !== "link" || safeUrl(mark.attrs?.href))))) return false;
    if (node.attrs) {
      if (typeof node.attrs !== "object" || Array.isArray(node.attrs) || Object.values(node.attrs).some(v => v !== null && !["string", "number", "boolean"].includes(typeof v))) return false;
      if (node.attrs.textAlign && !["left", "center", "right", "justify"].includes(String(node.attrs.textAlign))) return false;
    }
    if (node.type === "image" && !safeUrl(node.attrs?.src)) return false;
    if (node.type === "heading" && ![1, 2, 3, 4, 5, 6].includes(Number(node.attrs?.level))) return false;
    return node.content === undefined || (Array.isArray(node.content) && node.content.every(child => valid(child, depth + 1)));
  }
  const doc = value as RichTextDocument | null;
  return !!doc && doc.type === "doc" && Array.isArray(doc.content) && valid(value, 0);
}

export function extractPlainText(node: RichTextNode | RichTextDocument): string {
  const text = "text" in node ? node.text ?? "" : "";
  return [text, ...(node.content?.map(extractPlainText) ?? [])].join(" ").replace(/\s+/g, " ").trim();
}
export function hasMeaningfulRichText(value: unknown) {
  return isRichTextDocument(value) && extractPlainText(value).length > 0;
}
