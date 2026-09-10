import { redirect } from "next/navigation";
import { CmsShell } from "@/components/admin/CmsShell";
import { getAdminSession, canManageAdmins } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin access", robots: { index: false, follow: false } };

type AdminRow = {
  uid: string;
  email: string;
  role: "admin" | "superadmin";
  added_at: string;
};

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login?error=login-required");
  if (!canManageAdmins(session.role)) redirect("/admin");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admins")
    .select("uid,email,role,added_at")
    .order("added_at", { ascending: true });
  const admins = (data ?? []) as AdminRow[];

  return (
    <CmsShell title="Admin access" active="/admin/users">
      <div className="space-y-5">
        <p className="max-w-2xl text-sm leading-6 text-als-muted">
          Accounts in the existing ALS admin allowlist can access the editorial system. Role changes remain restricted to superadmins and database policy checks.
        </p>
        {error ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            The admin allowlist could not be loaded.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-als-line bg-white">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="border-b border-als-line bg-als-blue-soft text-xs text-als-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-als-line">
                {admins.map((admin) => (
                  <tr key={admin.uid}>
                    <td className="px-4 py-4 font-semibold text-als-ink">{admin.email}</td>
                    <td className="px-4 py-4">
                      <span className={admin.role === "superadmin" ? "rounded-md bg-als-red/10 px-2 py-1 text-xs font-semibold text-als-red" : "rounded-md bg-als-blue-light px-2 py-1 text-xs font-semibold text-als-blue-dark"}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-als-muted">{new Date(admin.added_at).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {admins.length === 0 && <p className="p-8 text-center text-sm text-als-muted">No admin accounts were returned.</p>}
          </div>
        )}
      </div>
    </CmsShell>
  );
}
