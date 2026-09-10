import Link from "next/link";
import {ExternalLink} from "lucide-react";
import {CmsShell} from "@/components/admin/CmsShell";
import {buttonVariants} from "@/components/ui/button";
import {requireCmsPage} from "@/lib/cms/server";
import {canManageAdmins} from "@/lib/admin/auth";
import {redirect} from "next/navigation";
export const dynamic="force-dynamic";
export default async function AdminContentPage(){
 const session=await requireCmsPage();if(!canManageAdmins(session.role))redirect("/admin?error=not-authorized");
 return <CmsShell title="Site content" active="/admin/content"><div className="max-w-2xl rounded-lg border border-als-line bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-als-ink">Inline page content</h2><p className="mt-3 text-sm leading-7 text-als-muted">Open the public website and use the pencil control to edit approved page copy and images. Blog, News, Gallery, and ALS Team media are managed from their dedicated sections.</p><Link href="/" className={buttonVariants({className:"mt-5"})}><ExternalLink size={16}/>Open website editor</Link></div></CmsShell>;
}
