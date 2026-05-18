import { roles, type Role } from "./roles";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

/** Single demo admin — replace with Supabase auth when wired up. */
export const DEMO_ADMIN: DemoUser = {
  id: "admin-1",
  name: "Admin",
  email: "admin@guesshowmuch.app",
  role: roles.admin,
};

/** Demo sign-in only (not for production). */
export const DEMO_ADMIN_CREDENTIALS = {
  email: DEMO_ADMIN.email,
  password: "guess-admin",
} as const;
