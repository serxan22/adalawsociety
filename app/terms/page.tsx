import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = {
  title: "Terms",
};

export default function Page() {
  return (
    <PolicyPage
      policyKey="terms"
      title="Terms and Community Guidelines"
      intro="ALS website spaces should support academic seriousness, respectful discussion, and responsible student publishing."
      sections={[
        {
          heading: "Respectful participation",
          body: "Comments and submissions should address ideas rather than individuals. Harassment, personal attacks, or discriminatory language should not be accepted.",
        },
        {
          heading: "Academic integrity",
          body: "Authors should avoid plagiarism, distinguish their own analysis from cited material, and disclose uncertainty where a claim requires further research.",
        },
        {
          heading: "Student-led platform",
          body: "Content represents student academic engagement unless otherwise stated. Official institutional positions should be published only with appropriate authorization.",
        },
      ]}
    />
  );
}
