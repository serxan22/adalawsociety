import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRole = "admin" | "superadmin";

export interface AdminSession {
  userId: string;
  email: string;
  role: AdminRole;
}

type AdminRoleRow = {
  role: AdminRole;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return null;

    const { data: adminRow } = await supabase
      .from("admins")
      .select("role")
      .eq("email", user.email)
      .single<AdminRoleRow>();

    if (!adminRow || !canManageEditorialContent(adminRow.role)) return null;

    return {
      userId: user.id,
      email: user.email,
      role: adminRow.role,
    };
  } catch {
    return null;
  }
}

export function canManageAdmins(role: AdminRole) {
  return role === "superadmin";
}

/** Both allowlisted ALS roles may operate the editorial CMS. */
export function canManageEditorialContent(role: AdminRole) {
  return role === "admin" || role === "superadmin";
}
