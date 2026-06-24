"use client";
import React, { useRef, useState } from "react";
import { useContent } from "@/lib/content/ContentContext";

interface Props {
  contentKey: string;
  fallback?: string;
  tag?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function EditableText({ contentKey, fallback = "", tag = "span", style, className }: Props) {
  const { getValue, editMode, isSuperAdmin, updateContent } = useContent();
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const value = getValue(contentKey, fallback);

  async function handleBlur() {
    const newValue = ref.current?.innerText ?? "";
    if (newValue !== value) { setSaving(true); await updateContent(contentKey, newValue); setSaving(false); }
  }

  const editStyle: React.CSSProperties = editMode && isSuperAdmin
    ? { ...style, outline: "2px dashed #7c3aed", borderRadius: "4px", padding: "2px 4px", cursor: "text", minWidth: "20px", display: "inline-block", opacity: saving ? 0.6 : 1 }
    : style ?? {};

  return React.createElement(
    tag,
    {
      ref,
      style: editStyle,
      className,
      ...(editMode && isSuperAdmin ? { contentEditable: true, suppressContentEditableWarning: true, onBlur: handleBlur } : {}),
    },
    value
  );
}
