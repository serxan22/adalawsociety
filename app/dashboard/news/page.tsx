import Link from "next/link";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { NewsCard } from "@/components/news/NewsCard";
import { currentUser } from "@/data/current-user";
import { newsItems } from "@/data/news";
import { canCreateContent } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Dashboard News",
};

export default function Page() {
  const canCreate = currentUser.authenticated && canCreateContent(currentUser.role);

  return (
    <DashboardShell active="news">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-als-blue">News</h2>
          <p className="mt-2 text-sm leading-6 text-als-muted">
            Verified public listings and placeholder details are shown here until a CMS or
            Supabase table is connected.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/dashboard/news/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-als-red px-5 text-sm font-semibold text-white"
          >
            Create News
          </Link>
        ) : null}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {newsItems.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>
    </DashboardShell>
  );
}
