import type { RichTextDocument } from "@/lib/cms/types";
export type NewsCategory = string;

export type NewsItem = {
  id?: string;
  richContent?: RichTextDocument;
  author?: {name:string;image:string;bio:string};
  slug: string;
  title: string;
  category: NewsCategory;
  date: string;
  excerpt: string;
  image: string;
  content: string[];
  sourceUrl?: string;
};

// Publications are loaded exclusively from Supabase. Never seed public examples.
export const newsItems: NewsItem[] = [];
