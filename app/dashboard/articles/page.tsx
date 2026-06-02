import Link from "next/link";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { currentUser } from "@/data/current-user";
import { articles } from "@/data/articles";
import { canCreateContent } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Dashboard Articles",
};

export default function Page() {
  const canCreate = currentUser.authenticated && canCreateContent(currentUser.role);

  return (
    <DashboardShell active="articles">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-als-blue">Articles</h2>
          <p className="mt-2 text-sm leading-6 text-als-muted">
            Public mock article data is shown here until a CMS or Supabase table is connected.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/dashboard/articles/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-als-red px-5 text-sm font-semibold text-white"
          >
            Write Article
          </Link>
        ) : null}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </DashboardShell>
  );
}
