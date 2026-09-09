import { CmsShell } from "@/components/admin/CmsShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { idSchema } from "@/lib/cms/validation";
import { notFound } from "next/navigation";
export const dynamic="force-dynamic";
export const metadata={title:"Edit post",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!idSchema.safeParse(id).success)notFound();return <CmsShell title="Edit blog post" active="/admin/blog"><PostEditor kind="blog" id={id}/></CmsShell>;}
