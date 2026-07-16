import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function Page() {
  return (
    <PolicyPage
      policyKey="privacy"
      title="Privacy Policy"
      intro="This first version uses local mock interactions and is prepared for a future backend integration."
      sections={[
        {
          heading: "Data collection",
          body: "The current website does not send contact forms, likes, saves, or comments to a database. These interactions are local UI states prepared for future integration.",
        },
        {
          heading: "Future integrations",
          body: "If ALS connects the site to a CMS, Supabase, Firebase, or another service, this policy should be updated to explain what data is collected, why it is collected, and how long it is retained.",
        },
        {
          heading: "Contact",
          body: "Questions about privacy or website content can be sent to lawsociety@ada.edu.az.",
        },
      ]}
    />
  );
}
