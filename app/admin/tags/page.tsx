import { CmsShell } from "@/components/admin/CmsShell";
import { EntityManager } from "@/components/admin/EntityManager";
export const dynamic="force-dynamic";
export const metadata={title:"Manage tags",robots:{index:false,follow:false}};
export default function Page(){return <CmsShell title="Tags" active="/admin/tags"><EntityManager entity="tags"/></CmsShell>;}
