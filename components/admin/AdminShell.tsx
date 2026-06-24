import Link from "next/link";
import type { ReactNode } from "react";
import { FilePenLine, LayoutDashboard, LogOut, ShieldCheck, UsersRound } from "lucide-react";
import type { AdminSession } from "@/lib/admin/types";
import { canManageAdmins } from "@/lib/admin/permissions";
import { cn } from "@/lib/utils";

const navItems: Array<{ label: string; href: string; active: string; icon: any; superOnly: boolean }> = [
  { label: "Overview", href: "/admin", active: "overview", icon: LayoutDashboard },
  { label: "Content", href: "/admin/content", active: "content", icon: FilePenLine },
  { label: "Admins", href: "/admin/users", active: "users", icon: UsersRound, superOnly: true },
] as const;

export function AdminShell({
  session,
  active,
  children,
}: {
  session: AdminSession;
  active: "overview" | "content" | "users";
  children: ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-10 text-white">
      <div className="container-wide">
        <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/15 backdrop-blur md:p-7">
          <div className="flex flex-col gap-5 border-b border-white/12 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/70">
                <ShieldCheck className="h-4 w-4 text-als-red" aria-hidden="true" />
                ALS Admin
              </p>
              <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
                Secure content management
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Signed in as {session.email} · {session.role === "superadmin" ? "Super Admin" : "Admin"}
              </p>
            </div>
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-bold text-white transition hover:border-als-red hover:bg-als-red"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Admin navigation">
            {navItems
              .filter((item) => !item.superOnly || canManageAdmins(session.role))
              .map((item) => {
                const Icon = item.icon;
                const isActive = active === item.active;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition",
                      isActive
                        ? "border-als-red bg-als-red text-white shadow-lg shadow-als-red/20"
                        : "border-white/15 bg-white/10 text-white hover:border-white/35 hover:bg-white/15",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
