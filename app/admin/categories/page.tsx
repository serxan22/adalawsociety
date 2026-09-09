import { CmsShell } from "@/components/admin/CmsShell";
import { EntityManager } from "@/components/admin/EntityManager";
export const dynamic="force-dynamic";
export const metadata={title:"Manage categories",robots:{index:false,follow:false}};
export default function Page(){return <CmsShell title="Categories" active="/admin/categories"><EntityManager entity="categories"/></CmsShell>;}
