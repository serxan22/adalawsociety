import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompetitionPage } from "@/components/pages/CompetitionPage";
import { competitions, getCompetition } from "@/data/competitions";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return competitions.map((competition) => ({
    slug: competition.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const competition = getCompetition(slug);

  return {
    title: competition?.title || "Competitions",
    description: competition?.intro,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const competition = getCompetition(slug);

  if (!competition) {
    notFound();
  }

  return <CompetitionPage competition={competition} />;
}
