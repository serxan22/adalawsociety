import type { AdminRole } from "@/lib/admin/types";

export function canEditSiteContent(role: AdminRole | null | undefined) {
  return role === "admin" || role === "superadmin";
}

export function canManageAdmins(role: AdminRole | null | undefined) {
  return role === "superadmin";
}

export function normalizeAdminRole(value: unknown): AdminRole | null {
  return value === "admin" || value === "superadmin" ? value : null;
}
