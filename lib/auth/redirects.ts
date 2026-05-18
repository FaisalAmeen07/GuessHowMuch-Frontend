import { roles } from "@/constants/roles";
import { routes } from "@/config/routes";
import type { AuthSession } from "@/lib/auth/types";

export function homeRouteForSession(session: AuthSession | null): string {
  if (!session) return routes.login;
  if (canAccessAdminRoute(session)) return routes.submissions;
  return routes.map;
}

export function canAccessAdminRoute(session: AuthSession | null): boolean {
  return session?.role === roles.admin;
}
