import type { Metadata } from "next";
import { ContentForm } from "@/components/dashboard/ContentForms";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Create News",
};

export default function Page() {
  return (
    <DashboardShell active="news">
      <ContentForm kind="news" />
    </DashboardShell>
  );
}
