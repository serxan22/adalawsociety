import type { Metadata } from "next";
import { BlogListingPage } from "@/components/pages/BlogListingPage";

export const metadata: Metadata = {
  title: "Blog",
};

export default function Page() {
  return <BlogListingPage />;
}
