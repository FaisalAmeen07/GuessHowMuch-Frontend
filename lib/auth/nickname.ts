import { DEMO_ADMIN } from "@/constants/demo-users";
import { roles, type Role } from "@/constants/roles";

export function defaultNicknameForEmail(email: string, role: Role): string {
  const normalized = email.trim().toLowerCase();
  if (role === roles.admin && normalized === DEMO_ADMIN.email) {
    return DEMO_ADMIN.name;
  }
  const local = normalized.split("@")[0] ?? "foodie";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
