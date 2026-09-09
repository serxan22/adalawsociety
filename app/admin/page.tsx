import { CmsShell } from "@/components/admin/CmsShell";
import { CmsOverview } from "@/components/admin/CmsOverview";
export const dynamic="force-dynamic";
export const metadata={title:"Editorial dashboard",robots:{index:false,follow:false}};
export default function Page(){return <CmsShell title="Editorial overview" active="/admin"><CmsOverview/></CmsShell>;}
