"use client";
import { EditableText } from "@/components/cms/EditableText";
import { useContent } from "@/lib/content/ContentContext";

interface Props {
  contentKey: string;
  value: string;
  tag?: string;
}

export function EditableI18nText({ contentKey, value, tag = "span" }: Props) {
  const { editMode, isSuperAdmin } = useContent();
  if (editMode && isSuperAdmin) {
    return <EditableText contentKey={contentKey} fallback={value} tag={tag} />;
  }
  return <>{value}</>;
}
