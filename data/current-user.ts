import type { AuthUser } from "@/lib/auth/roles";

/**
 * Local frontend preview only.
 *
 * Change this object while testing dashboard states:
 * - set `authenticated: false` to preview the login-required state
 * - set `role: "public"` to preview the no-permission state
 * - set `role: "public"` to preview pending-only submissions
 * - set `role: "public"` or `"admin"` to preview direct publishing controls
 */
export const currentUser: AuthUser = {
  id: "local-preview-editor",
  fullName: "ALS Content Editor (local preview)",
  email: "lawsociety@ada.edu.az",
  role: "public",
  authenticated: true,
};
