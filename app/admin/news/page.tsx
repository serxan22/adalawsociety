import { CmsShell } from "@/components/admin/CmsShell";
import { PostsManager } from "@/components/admin/PostsManager";
export const dynamic="force-dynamic";
export const metadata={title:"News CMS",robots:{index:false,follow:false}};
export default function Page(){return <CmsShell title="News posts" active="/admin/news"><PostsManager kind="news"/></CmsShell>;}
