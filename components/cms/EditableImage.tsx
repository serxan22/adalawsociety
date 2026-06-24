"use client";
import { useContent } from "@/lib/content/ContentContext";
import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  contentKey: string;
  fallback?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function EditableImage({ contentKey, fallback = "", alt, width, height, fill, style, className }: Props) {
  const { getValue, editMode, isSuperAdmin, uploadImage } = useContent();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const src = preview ?? getValue(contentKey, fallback);
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try { const url = await uploadImage(contentKey, file); setPreview(url); }
    catch (err) { console.error(err); }
    finally { setUploading(false); }
  }
  if (!editMode || !isSuperAdmin) {
    return fill
      ? <Image src={src} alt={alt} fill style={style} className={className} />
      : <Image src={src} alt={alt} width={width ?? 800} height={height ?? 600} style={style} className={className} />;
  }
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {fill
        ? <Image src={src} alt={alt} fill className={className} />
        : <Image src={src} alt={alt} width={width ?? 800} height={height ?? 600} className={className} />}
      <div style={{ position: "absolute", inset: 0, background: "rgba(124,58,237,0.3)", border: "2px dashed #7c3aed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "4px" }} onClick={() => inputRef.current?.click()}>
        <span style={{ background: "#7c3aed", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontWeight: 600, fontSize: "14px" }}>{uploading ? "Uploading..." : "🖼 Change Image"}</span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
    </div>
  );
}