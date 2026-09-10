import type {Metadata} from "next";
import {GalleryPage} from "@/components/pages/GalleryPage";
import {getGallery} from "@/lib/cms/gallery";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Gallery",description:"ADA Law Society gallery."};
export default async function Page(){const result=await getGallery(false);return <GalleryPage initial={result}/>;}
