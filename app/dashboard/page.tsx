import Link from "next/link";
import type { Metadata } from "next";
import { FileText, Newspaper, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { currentUser } from "@/data/current-user";
import { canCreateContent, canPublish, roleLabel } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page() {
  const canCreate = currentUser.authenticated && canCreateContent(currentUser.role);

  return (
    <DashboardShell active="overview">
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: "Authentication",
            text: currentUser.authenticated
              ? `Logged in as ${roleLabel(currentUser.role)}.`
              : "No user is logged in.",
            icon: ShieldCheck,
          },
          {
            title: "Create content",
            text: canCreate
              ? "This role can create article and news drafts."
              : "This role cannot create ALS content.",
            icon: FileText,
          },
          {
            title: "Publish content",
            text: canPublish(currentUser.role)
              ? "This role can publish directly."
              : "This role can submit draft or pending content only.",
            icon: Newspaper,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-lg border border-als-line bg-white p-6 shadow-sm">
              <Icon className="h-6 w-6 text-als-red" />
              <h2 className="mt-4 text-xl font-bold text-als-blue">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-als-muted">{item.text}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-als-line bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-als-blue">Publishing workflow</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-als-muted">
          Public visitors can read published content. ALS team members can draft and submit.
          Editors and admins can publish. Admins manage roles. The frontend preview mirrors that
          model, while the Supabase migration enforces it with RLS for production.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/articles/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-als-red px-5 text-sm font-semibold text-white"
          >
            Write Article
          </Link>
          <Link
            href="/dashboard/news/new"
            className="inline-flex h-11 items-center justify-center rounded-full border border-als-line bg-white px-5 text-sm font-semibold text-als-blue hover:border-als-red/40"
          >
            Create News
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
