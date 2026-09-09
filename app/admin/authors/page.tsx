import { CmsShell } from "@/components/admin/CmsShell";
import { EntityManager } from "@/components/admin/EntityManager";
export const dynamic="force-dynamic";
export const metadata={title:"Manage authors",robots:{index:false,follow:false}};
export default function Page(){return <CmsShell title="Authors" active="/admin/authors"><EntityManager entity="authors"/></CmsShell>;}
