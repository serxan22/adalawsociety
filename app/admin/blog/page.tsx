import { CmsShell } from "@/components/admin/CmsShell";
import { PostsManager } from "@/components/admin/PostsManager";
export const dynamic="force-dynamic";
export const metadata={title:"Blog CMS",robots:{index:false,follow:false}};
export default function Page(){return <CmsShell title="Blog posts" active="/admin/blog"><PostsManager kind="blog"/></CmsShell>;}
