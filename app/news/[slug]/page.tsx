import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsDetailPage } from "@/components/pages/NewsDetailPage";
import { newsItems } from "@/data/news";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return newsItems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = newsItems.find((news) => news.slug === slug);

  return {
    title: item?.title || "News",
    description: item?.excerpt,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const item = newsItems.find((news) => news.slug === slug);

  if (!item) {
    notFound();
  }

  const related = newsItems
    .filter((news) => news.slug !== item.slug && news.category === item.category)
    .slice(0, 3);

  return <NewsDetailPage item={item} related={related} />;
}
