import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRole = "admin" | "superadmin";

export interface AdminSession {
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

    if (!adminRow) return null;

    return {
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
