import type { Metadata } from "next";
import { NewsListingPage } from "@/components/pages/NewsListingPage";
import { publicListing } from "@/lib/cms/public";
import { getAdminSession } from "@/lib/admin/auth";
import type { NewsItem } from "@/data/news";
import type { PublishedResult } from "@/components/cms/usePublishedContent";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"News"};
export default async function Page(){
  const [data,session]=await Promise.all([publicListing("news",new URLSearchParams()),getAdminSession()]);
  return <NewsListingPage initial={data as PublishedResult<NewsItem>} canCreateNews={!!session}/>;
}
