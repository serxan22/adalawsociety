import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login?error=login-required");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#fff",
        padding: "48px 32px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <a href="/admin" style={{ color: "#888", fontSize: "14px", textDecoration: "none" }}>
          ← Back
        </a>
        <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "16px 0 12px" }}>
          Edit Content
        </h1>
        <p style={{ color: "#888", lineHeight: 1.7, maxWidth: "620px" }}>
          You are signed in as {session.email}. This protected page is ready for the future
          content editor. Public page editing should save changes through server actions or API
          routes that check this admin session before writing to Supabase.
        </p>
      </div>
    </main>
  );
}
