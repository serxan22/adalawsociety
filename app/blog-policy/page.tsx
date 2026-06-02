import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = {
  title: "Blog Policy",
};

export default function Page() {
  return (
    <PolicyPage
      title="Blog Policy"
      intro="The ALS Blog is a student-edited platform for careful legal writing, research summaries, citations, and respectful discussion."
      sections={[
        {
          heading: "Summary-first workflow",
          body: "Authors should submit a short summary before drafting a full article. The summary should state the legal question, core argument, intended sources, and expected contribution.",
        },
        {
          heading: "Editorial review",
          body: "Editors may request revisions for clarity, source quality, structure, tone, and legal accuracy. Publication is based on editorial readiness and alignment with ALS standards.",
        },
        {
          heading: "Citations",
          body: "Articles should identify statutes, cases, treaties, academic sources, institutional materials, or reputable commentary where relevant. Unsupported legal claims may be returned for revision.",
        },
      ]}
    />
  );
}
