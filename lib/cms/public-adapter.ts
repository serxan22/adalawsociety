import type { Article } from "@/data/articles";
import type { NewsItem } from "@/data/news";
import type { CmsPost } from "./types";
export function toArticle(post:CmsPost):Article {
  return { id:post.id, slug:post.slug,title:post.title,summary:post.summary,excerpt:post.excerpt,
    author:{name:post.author?.full_name??"",role:post.author?.position??"",image:post.author?.avatar_url??"",bio:post.author?.bio??"",socialLinks:post.author?.social_links??{}},
    date:post.published_at??post.created_at,category:post.category?.name??"",tags:post.tags.map(t=>t.name),
    coverImage:post.cover_image??"",citations:post.citations??[],
    content:post.content ? [post.content] : [],richContent:post.content_json??undefined,originalLanguage:post.original_language??undefined };
}
export function toNews(post:CmsPost):NewsItem {
  return { id:post.id,slug:post.slug,title:post.title,excerpt:post.excerpt,date:post.published_at??post.created_at,
    category:post.category?.name??"",image:post.cover_image??"",content:post.content?[post.content]:[],
    richContent:post.content_json??undefined,author:post.author?{name:post.author.full_name,image:post.author.avatar_url??"",bio:post.author.bio??""}:undefined };
}
