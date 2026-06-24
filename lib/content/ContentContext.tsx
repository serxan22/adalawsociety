"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type ContentMap = Record<string, { value: string; type: string }>;
interface ContentContextType {
  content: ContentMap;
  editMode: boolean;
  isSuperAdmin: boolean;
  toggleEditMode: () => void;
  updateContent: (key: string, value: string) => Promise<void>;
  uploadImage: (key: string, file: File) => Promise<string>;
  getValue: (key: string, fallback?: string) => string;
}
const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children, isSuperAdmin }: { children: React.ReactNode; isSuperAdmin: boolean }) {
  const [content, setContent] = useState<ContentMap>({});
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(setContent).catch(console.error);
  }, []);
  const getValue = useCallback((key: string, fallback = "") => content[key]?.value ?? fallback, [content]);
  const updateContent = useCallback(async (key: string, value: string) => {
    const res = await fetch("/api/content/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
    if (res.ok) setContent(prev => ({ ...prev, [key]: { value, type: prev[key]?.type ?? "text" } }));
  }, []);
  const uploadImage = useCallback(async (key: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);
    const res = await fetch("/api/content/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) { setContent(prev => ({ ...prev, [key]: { value: data.url, type: "image" } })); return data.url; }
    throw new Error(data.error ?? "Upload failed");
  }, []);
  const toggleEditMode = useCallback(() => setEditMode(v => !v), []);
  return (
    <ContentContext.Provider value={{ content, editMode, isSuperAdmin, toggleEditMode, updateContent, uploadImage, getValue }}>
      {children}
      {isSuperAdmin && <EditToolbar editMode={editMode} onToggle={toggleEditMode} />}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

function EditToolbar({ editMode, onToggle }: { editMode: boolean; onToggle: () => void }) {
  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", alignItems: "center", gap: "10px" }}>
      {editMode && <span style={{ background: "#1e1b4b", color: "#a5b4fc", fontSize: "13px", padding: "6px 12px", borderRadius: "999px", border: "1px solid #3730a3" }}>Edit Mode ON</span>}
      <button onClick={onToggle} style={{ background: editMode ? "#7c3aed" : "#1e1b4b", border: "1px solid #3730a3", color: "#fff", fontWeight: 700, fontSize: "20px", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 4px 24px rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }} title={editMode ? "Exit Edit Mode" : "Enter Edit Mode"}>✏️</button>
    </div>
  );
}
