import type { Role } from "@/constants/roles";

export type AuthSession = {
  email: string;
  role: Role;
  nickname: string;
};
