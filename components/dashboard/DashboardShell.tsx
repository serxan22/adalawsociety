import Link from "next/link";
import type { ReactNode } from "react";
import { FileText, LayoutDashboard, Newspaper, ShieldCheck } from "lucide-react";
import { currentUser } from "@/data/current-user";
import { canCreateContent, roleLabel } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const dashboardLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Articles", href: "/dashboard/articles", icon: FileText },
  { label: "News", href: "/dashboard/news", icon: Newspaper },
];

export function DashboardShell({
  children,
  active,
}: {
  children: ReactNode;
  active: "overview" | "articles" | "news";
}) {
  const authorized = currentUser.authenticated && canCreateContent(currentUser.role);

  return (
    <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-12">
      <div className="container-wide">
        <div className="mb-8 rounded-lg border border-als-line bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-als-red">ALS Content Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-als-blue">
                Role-based publishing preview
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-als-muted">
                This local dashboard previews the intended UX. Real authorization must be
                enforced server-side through Supabase Auth, API routes, server actions, and RLS.
              </p>
            </div>
            <div className="rounded-lg border border-als-line bg-als-blue-soft p-4 text-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-als-red" />
                <div>
                  <p className="font-bold text-als-blue">{currentUser.fullName}</p>
                  <p className="text-als-muted">
                    {currentUser.authenticated ? roleLabel(currentUser.role) : "Not logged in"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Dashboard navigation">
            {dashboardLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                (active === "overview" && link.href === "/dashboard") ||
                (active === "articles" && link.href.includes("articles")) ||
                (active === "news" && link.href.includes("news"));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                    isActive
                      ? "border-als-red bg-als-red text-white"
                      : "border-als-line bg-white text-als-blue hover:border-als-red/40",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {!currentUser.authenticated ? (
          <PermissionPanel title="Login required">
            Sign in with the future ADA Law Society authentication system to create or edit
            content.
          </PermissionPanel>
        ) : !authorized ? (
          <PermissionPanel title="You do not have permission to publish ALS content.">
            Public users can read published articles and news, but cannot create blog or news
            posts.
          </PermissionPanel>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function PermissionPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-als-line bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-bold text-als-blue">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-als-muted">{children}</p>
    </div>
  );
}
