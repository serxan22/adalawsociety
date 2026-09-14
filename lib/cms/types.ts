export const CMS_POST_STATUSES = ["draft", "published", "unpublished"] as const;

export type CmsPostStatus = (typeof CMS_POST_STATUSES)[number];
export type CmsContentType = "article" | "news";

export type RichTextMark = {
  type: "bold" | "italic" | "underline" | "link" | "code" | "strike" | "superscript";
  attrs?: {
    href?: string;
    target?: string;
  };
};

export type RichTextNode = {
  type: string;
  text?: string;
  attrs?: Record<string, string | number | boolean | null>;
  marks?: RichTextMark[];
  content?: RichTextNode[];
};

export type RichTextDocument = {
  type: "doc";
  content: RichTextNode[];
};

export type CmsAuthor = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  position: string | null;
  social_links: Record<string, string> | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsTag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type CmsPost = {
  id: string;
  content_type: CmsContentType;
  title: string;
  slug: string;
  excerpt: string;
  summary: string;
  content: string;
  content_json: RichTextDocument | null;
  citations: Array<{ label: string; source: string; url?: string }>;
  cover_image: string | null;
  media: Array<{ url: string; alt?: string; caption?: string }>;
  status: CmsPostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  canonical_url: string | null;
  seo_image: string | null;
  author: CmsAuthor | null;
  category: CmsCategory | null;
  tags: CmsTag[];
  original_language?: string | null;
  legacy_source_url?: string | null;
};

export type CmsPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  summary?: string;
  content: RichTextDocument;
  citations?: Array<{ label: string; source: string; url?: string }>;
  coverImage?: string | null;
  media?: Array<{ url: string; alt?: string; caption?: string }>;
  categoryId?: string | null;
  tagIds?: string[];
  authorId?: string | null;
  status: CmsPostStatus;
  publishedAt?: string | null;
  updatedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  canonicalUrl?: string | null;
  seoImage?: string | null;
};

export type CmsPaginatedPosts = {
  posts: CmsPost[];
  total: number;
  page: number;
  pageSize: number;
};

export type CmsLookups = { authors: CmsAuthor[]; categories: CmsCategory[]; tags: CmsTag[] };
