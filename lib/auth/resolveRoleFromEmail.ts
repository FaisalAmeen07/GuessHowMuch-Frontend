import { DEMO_ADMIN } from "@/constants/demo-users";
import { roles, type Role } from "@/constants/roles";

const ADMIN_EMAILS = new Set([
  DEMO_ADMIN.email,
  "admin@guesshowmuch.com",
  "admin@guesshowmuch.com.au",
]);

/** Demo: fixed admin emails; everyone else is a regular user. */
export function resolveRoleFromEmail(email: string): Role {
  const normalized = email.trim().toLowerCase();
  if (ADMIN_EMAILS.has(normalized) || normalized.endsWith("+admin@guesshowmuch.com")) {
    return roles.admin;
  }
  return roles.user;
}
