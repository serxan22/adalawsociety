import type { CSSProperties } from "react";
import { redirect } from "next/navigation";
import { getAdminSession, canManageAdmins } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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
        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#888", marginBottom: "40px" }}>
          Logged in as <strong style={{ color: "#fff" }}>{session.email}</strong>{" "}
          —{" "}
          <span style={{ color: session.role === "superadmin" ? "#a78bfa" : "#60a5fa" }}>
            {session.role}
          </span>
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <a href="/admin/content" style={cardStyle}>
            <span style={{ fontSize: "24px" }}>✏️</span>
            <span>Edit Content</span>
          </a>

          {canManageAdmins(session.role) && (
            <a href="/admin/users" style={cardStyle}>
              <span style={{ fontSize: "24px" }}>👥</span>
              <span>Manage Admins</span>
            </a>
          )}
        </div>

        <form action="/auth/sign-out" method="POST" style={{ marginTop: "48px" }}>
          <button
            type="submit"
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: "#888",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  background: "#111118",
  border: "1px solid #222",
  borderRadius: "12px",
  padding: "32px 24px",
  textDecoration: "none",
  color: "#fff",
  fontSize: "16px",
  fontWeight: 500,
  cursor: "pointer",
};
