export type UserRole = "public" | "als_team" | "editor" | "admin";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  authenticated: boolean;
};

const contentRoles: UserRole[] = ["als_team", "editor", "admin"];
const publishingRoles: UserRole[] = ["editor", "admin"];

export function canCreateContent(role: UserRole) {
  return contentRoles.includes(role);
}

export function canEditContent(userId: string, authorId: string, role: UserRole) {
  return userId === authorId || publishingRoles.includes(role);
}

export function canPublish(role: UserRole) {
  return publishingRoles.includes(role);
}

export function getDefaultContentStatus(role: UserRole) {
  return canPublish(role) ? "draft" : "pending";
}

export function roleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    public: "Public visitor",
    als_team: "ALS team member",
    editor: "Editor",
    admin: "Administrator",
  };

  return labels[role];
}
