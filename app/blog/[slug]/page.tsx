import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { BlogDetailPage } from "@/components/pages/BlogDetailPage";
import { articles } from "@/data/articles";
import { publicPost,publicListing } from "@/lib/cms/public";
import { toArticle } from "@/lib/cms/public-adapter";
import type { Article } from "@/data/articles";
export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
const resolve=cache(async(slug:string)=>{
  const post=await publicPost("article",slug);
  return {post,item:post?toArticle(post):articles.find(item=>item.slug===slug)};
});
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {post,item}=await resolve((await params).slug);
  if(!item)return {title:"Not found",robots:{index:false}};
  const title=post?.seo_title||item.title;const description=post?.seo_description||item.excerpt;
  const image=post?.seo_image||post?.cover_image;
  return {title,description,keywords:post?.seo_keywords,alternates:{canonical:post?.canonical_url||"/blog/"+item.slug},openGraph:{title,description,...(image?{images:[image]}:{})}};
}
export default async function Page({params}:Props){
  const {item}=await resolve((await params).slug);if(!item)notFound();
  const result=await publicListing("article",new URLSearchParams({category:item.category}));
  const related=(result.posts as Article[]).filter(p=>p.slug!==item.slug).slice(0,3);
  return <BlogDetailPage article={item} related={related}/>;
}
