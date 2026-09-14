import { z } from "zod";
import { CMS_POST_STATUSES, type RichTextDocument } from "./types";
import { hasMeaningfulRichText, isRichTextDocument, safeUrl } from "./rich-text";

export const idSchema = z.string().uuid();
const optionalId = z.union([idSchema, z.literal(""), z.null()]).optional().transform(v => v || null);
const url = z.string().max(2000).refine(v => !v || safeUrl(v), "Use a valid http(s) URL or local path.").nullable().optional();
const slug = z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.");
const shortText = z.string().trim().min(1).max(240);
export const postSchema = z.object({
  title: shortText,
  slug,
  excerpt: z.string().trim().min(1, "An excerpt is required.").max(2000),
  summary: z.string().trim().max(8000).optional(),
  content: z.custom<RichTextDocument>(isRichTextDocument, "Invalid rich text.").refine(hasMeaningfulRichText, "Article content is required."),
  citations: z.array(z.object({ label: shortText, source: z.string().trim().min(1).max(8000), url })).max(100).default([]),
  coverImage: url,
  authorId: idSchema,
  categoryId: idSchema,
  tagIds: z.array(idSchema).max(30).default([]),
  status: z.enum(CMS_POST_STATUSES),
  publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
  updatedAt: z.string().datetime({ offset: true }).nullable().optional(),
  seoTitle: z.string().max(70).nullable().optional(),
  seoDescription: z.string().max(200).nullable().optional(),
  seoKeywords: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  canonicalUrl: url,
  seoImage: url,
}).superRefine((data, ctx) => {
  if (data.publishedAt && new Date(data.publishedAt).getTime() > Date.now()) ctx.addIssue({ code: "custom", path: ["publishedAt"], message: "Publication date cannot be in the future." });
});

export const authorSchema = z.object({
  full_name: shortText,
  avatar_url: url,
  bio: z.string().trim().max(3000).nullable().optional().transform(v => v || null),
  position: z.string().trim().max(150).nullable().optional().transform(v => v || null),
  social_links: z.record(z.string().max(40), z.string().refine(safeUrl, "Invalid social URL.")).default({}),
  user_id: optionalId,
});
export const categorySchema = z.object({ name: shortText, slug, description: z.string().trim().max(1000).nullable().optional().transform(v => v || null), image_url: url });
export const tagSchema = z.object({ name: z.string().trim().min(1).max(80), slug });
