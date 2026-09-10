import {HomePage} from "@/components/home/HomePage";
import {publicListing} from "@/lib/cms/public";
import {getGallery} from "@/lib/cms/gallery";
import type {Article} from "@/data/articles";
import type {NewsItem} from "@/data/news";
export const dynamic="force-dynamic";
export default async function Page(){
 const [blog,news,gallery]=await Promise.all([publicListing("article"),publicListing("news"),getGallery(false)]);
 return <HomePage featuredArticles={blog.posts.slice(0,3) as Article[]} featuredNews={news.posts.slice(0,3) as NewsItem[]} galleryItems={gallery.items.slice(0,4)}/>;
}
