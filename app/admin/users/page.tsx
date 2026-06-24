import { redirect } from "next/navigation";
import { getAdminSession, canManageAdmins } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AdminRow = {
  id: string;
  email: string;
  role: "admin" | "superadmin";
  added_at: string;
};

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login?error=login-required");
  if (!canManageAdmins(session.role)) redirect("/admin");

  const supabase = await createSupabaseServerClient();
  const { data: admins } = await supabase
    .from("admins")
    .select("*")
    .order("added_at", { ascending: true });
  const adminRows = (admins ?? []) as AdminRow[];

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
        <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "16px 0 32px" }}>
          Manage Admins
        </h1>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #222", color: "#888" }}>
              <th style={{ textAlign: "left", padding: "10px 0" }}>Email</th>
              <th style={{ textAlign: "left", padding: "10px 0" }}>Role</th>
              <th style={{ textAlign: "left", padding: "10px 0" }}>Added</th>
            </tr>
          </thead>
          <tbody>
            {adminRows.map((admin) => (
              <tr key={admin.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "12px 0", color: "#e5e5e5" }}>{admin.email}</td>
                <td style={{ padding: "12px 0" }}>
                  <span
                    style={{
                      background: admin.role === "superadmin" ? "#2e1065" : "#1e3a5f",
                      color: admin.role === "superadmin" ? "#a78bfa" : "#60a5fa",
                      padding: "2px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {admin.role}
                  </span>
                </td>
                <td style={{ padding: "12px 0", color: "#666" }}>
                  {new Date(admin.added_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
