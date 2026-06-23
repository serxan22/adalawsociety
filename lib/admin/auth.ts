import { redirect } from "next/navigation";
import type { AdminRecord, AdminSession } from "@/lib/admin/types";
import { normalizeAdminRole } from "@/lib/admin/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminRow = {
  email: string;
  role: string;
  added_at: string;
  added_by: string | null;
};

function toAdminRecord(row: AdminRow): AdminRecord | null {
  const role = normalizeAdminRole(row.role);

  if (!role) {
    return null;
  }

  return {
    email: row.email,
    role,
    addedAt: row.added_at,
    addedBy: row.added_by,
  };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();

  if (!user || !email) {
    return null;
  }

  const { data, error } = await supabase
    .from("admins")
    .select("email, role, added_at, added_by")
    .eq("email", email)
    .maybeSingle<AdminRow>();

  if (error || !data) {
    return null;
  }

  const record = toAdminRecord(data);

  if (!record) {
    return null;
  }

  return {
    email: record.email,
    role: record.role,
    name:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null,
    avatarUrl:
      typeof user.user_metadata?.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null,
  };
}

export async function requireAdmin(next = "/admin") {
  const session = await getAdminSession();

  if (!session) {
    redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  }

  return session;
}

export async function requireSuperAdmin(next = "/admin/users") {
  const session = await requireAdmin(next);

  if (session.role !== "superadmin") {
    redirect("/admin?error=superadmin-required");
  }

  return session;
}

export async function listAdmins(): Promise<AdminRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("admins")
    .select("email, role, added_at, added_by")
    .order("added_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data
    .map((row) => toAdminRecord(row as AdminRow))
    .filter((record): record is AdminRecord => Boolean(record));
}
