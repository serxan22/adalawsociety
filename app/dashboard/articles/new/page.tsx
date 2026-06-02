import type { Metadata } from "next";
import { ContentForm } from "@/components/dashboard/ContentForms";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Write Article",
};

export default function Page() {
  return (
    <DashboardShell active="articles">
      <ContentForm kind="article" />
    </DashboardShell>
  );
}
