import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamYearPage } from "@/components/pages/TeamYearPage";
import { getTeamYear, teamYears } from "@/data/team";

type PageProps = {
  params: Promise<{
    year: string;
  }>;
};

export function generateStaticParams() {
  return teamYears.map((team) => ({
    year: team.year,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  const team = getTeamYear(year);

  return {
    title: team?.title || "ALS Team",
    description: team?.intro,
  };
}

export default async function Page({ params }: PageProps) {
  const { year } = await params;
  const team = getTeamYear(year);

  if (!team) {
    notFound();
  }

  return <TeamYearPage team={team} />;
}
