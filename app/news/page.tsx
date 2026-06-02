import type { Metadata } from "next";
import { NewsListingPage } from "@/components/pages/NewsListingPage";

export const metadata: Metadata = {
  title: "News",
};

export default function Page() {
  return <NewsListingPage />;
}
