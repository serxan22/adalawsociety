import type { Metadata } from "next";
import { TeamArchivePage } from "@/components/pages/TeamArchivePage";

export const metadata: Metadata = {
  title: "ALS Team Archive",
  description:
    "ADA Law Society team archive with early leadership records and recent ALS team years.",
};

export default function TeamPage() {
  return <TeamArchivePage />;
}
