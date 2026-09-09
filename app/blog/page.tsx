import type { Metadata } from "next";
import { BlogListingPage } from "@/components/pages/BlogListingPage";
import { publicListing } from "@/lib/cms/public";
import { getAdminSession } from "@/lib/admin/auth";
import type { Article } from "@/data/articles";
import type { PublishedResult } from "@/components/cms/usePublishedContent";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Blog"};
export default async function Page(){
  const [data,session]=await Promise.all([publicListing("article",new URLSearchParams()),getAdminSession()]);
  return <BlogListingPage initial={data as PublishedResult<Article>} canCreate={!!session}/>;
}
