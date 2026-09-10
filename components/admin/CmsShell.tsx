import Link from "next/link";
import { BookOpen, FileText, Images, LayoutDashboard, Newspaper, Tags, Users, UsersRound, ExternalLink, LogOut, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { requireCmsPage } from "@/lib/cms/server";
import { cn } from "@/lib/utils";

const links = [
  ["/admin","Overview",LayoutDashboard],
  ["/admin/news","News posts",Newspaper],
	  ["/admin/blog","Blog posts",BookOpen],
  ["/admin/authors","Authors",Users],
  ["/admin/gallery","Gallery",Images],
  ["/admin/team","ALS Team",UsersRound],
  ["/admin/categories","Categories",FileText],
  ["/admin/tags","Tags",Tags],
] as const;
export async function CmsShell({title,active,children}:{title:string;active:string;children:ReactNode}) {
  const session = await requireCmsPage();
  return <section className="min-h-[75vh] bg-als-blue-soft text-als-ink">
    <div className="mx-auto max-w-[1440px] lg:grid lg:grid-cols-[210px_minmax(0,1fr)]">
      <aside className="border-b border-als-line bg-white p-4 lg:border-b-0 lg:border-r lg:p-5">
        <p className="mb-5 text-xs font-bold uppercase text-als-muted">ALS Editorial</p>
        <nav className="flex gap-1 overflow-x-auto lg:grid" aria-label="Editorial navigation">
          {links.map(([href,label,Icon])=><Link key={href} href={href} aria-current={active===href?"page":undefined} className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-als-blue-soft",active===href && "bg-als-red/10 text-als-red")}><Icon size={17}/>{label}</Link>)}
	          {session.role==="superadmin" && <Link href="/admin/content" aria-current={active==="/admin/content"?"page":undefined} className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-als-blue-soft",active==="/admin/content"&&"bg-als-red/10 text-als-red")}><Settings size={17}/>Site content</Link>}
	          {session.role==="superadmin" && <Link href="/admin/users" aria-current={active==="/admin/users"?"page":undefined} className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-als-blue-soft",active==="/admin/users"&&"bg-als-red/10 text-als-red")}><Users size={17}/>Admin access</Link>}
	        </nav>
	        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-als-line pt-4 text-xs text-als-muted lg:mt-6 lg:grid lg:gap-0">
	          <div className="mr-auto min-w-0 lg:mr-0"><p className="max-w-52 truncate lg:break-all">{session.email}</p><p className="mt-1 capitalize">{session.role}</p></div>
	          <Link href="/" className="flex items-center gap-2 hover:text-als-red lg:mt-4"><ExternalLink size={14}/>View website</Link>
	          <form action="/auth/sign-out" method="POST"><button className="flex items-center gap-2 hover:text-als-red lg:mt-4"><LogOut size={14}/>Sign out</button></form>
        </div>
      </aside>
      <div className="min-w-0 p-4 sm:p-6 lg:p-8"><h1 className="mb-6 text-2xl font-bold text-als-ink">{title}</h1>{children}</div>
    </div>
  </section>;
}
