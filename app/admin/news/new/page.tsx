import { CmsShell } from "@/components/admin/CmsShell";
import { PostEditor } from "@/components/admin/PostEditor";
export const dynamic="force-dynamic";
export const metadata={title:"Create post",robots:{index:false,follow:false}};
export default function Page(){return <CmsShell title="Create news post" active="/admin/news"><PostEditor kind="news"/></CmsShell>;}
