export type AdminRole = "admin" | "superadmin";

export type AdminRecord = {
  email: string;
  role: AdminRole;
  addedAt: string;
  addedBy: string | null;
};

export type AdminSession = {
  email: string;
  role: AdminRole;
  name: string | null;
  avatarUrl: string | null;
};
