import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { NewsDetailPage } from "@/components/pages/NewsDetailPage";
import { publicPost,publicListing } from "@/lib/cms/public";
import { toNews } from "@/lib/cms/public-adapter";
import type { NewsItem } from "@/data/news";
export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
const resolve=cache(async(slug:string)=>{
  const post=await publicPost("news",slug);
  return {post,item:post?toNews(post):undefined};
});
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {post,item}=await resolve((await params).slug);
  if(!item)return {title:"Not found",robots:{index:false}};
  const title=post?.seo_title||item.title;const description=post?.seo_description||item.excerpt;
  const image=post?.seo_image||post?.cover_image;
  return {title,description,keywords:post?.seo_keywords,alternates:{canonical:post?.canonical_url||"/news/"+item.slug},openGraph:{title,description,...(image?{images:[image]}:{})}};
}
export default async function Page({params}:Props){
  const {item}=await resolve((await params).slug);if(!item)notFound();
  const result=await publicListing("news",new URLSearchParams({category:item.category}));
  const related=(result.posts as NewsItem[]).filter(p=>p.slug!==item.slug).slice(0,3);
  return <NewsDetailPage item={item} related={related}/>;
}
