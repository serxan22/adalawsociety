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
      intro="This policy explains how ADA Law Society handles information submitted through this website."
      sections={[
        {
          heading: "Data collection",
	          body: "The website stores an interface-language preference in the visitor's browser. Messages sent through the contact page are opened in the visitor's own email application.",
        },
        {
	          heading: "Editorial administration",
	          body: "Authorized administrators use a protected content-management service. Authentication and editorial records are processed only for operating and securing the website.",
        },
        {
          heading: "Contact",
          body: "Questions about privacy or website content can be sent to lawsociety@ada.edu.az.",
        },
      ]}
    />
  );
}
