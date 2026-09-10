import type { RichTextDocument } from "@/lib/cms/types";
export type ArticleCategory = string;

export type Citation = {
  label: string;
  source: string;
  url?: string;
};

export type Article = {
  id?: string;
  richContent?: RichTextDocument;
  slug: string;
  title: string;
  author: {
    bio?: string;
    socialLinks?: Record<string,string>;
    name: string;
    role: string;
    image: string;
  };
  date: string;
  category: ArticleCategory;
  tags: string[];
  summary: string;
  excerpt: string;
  coverImage: string;
  citations: Citation[];
  content: string[];
};

// Publications are loaded exclusively from Supabase. Never seed public examples.
export const articles: Article[] = [];
