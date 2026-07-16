import type { Metadata } from "next";
import { ContentProvider } from "@/lib/content/ContentContext";
import { getAdminSession, canManageAdmins } from "@/lib/admin/auth";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";

export const metadata: Metadata = {
  title: {
    default: "ADA Law Society",
    template: "%s | ADA Law Society",
  },
  description:
    "A professional multilingual website for ADA Law Society, a student-led legal society at ADA University.",
  metadataBase: new URL("https://www.adalawsociety.com"),
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getAdminSession();
  const isSuperAdmin = session ? canManageAdmins(session.role) : false;

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <LanguageProvider>
          <LenisProvider />
          <ScrollProgress />
          <Header />
          <ContentProvider isSuperAdmin={isSuperAdmin}>
            <main className="flex-1">{children}</main>
            <Footer />
          </ContentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
