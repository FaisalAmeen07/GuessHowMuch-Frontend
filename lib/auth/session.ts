import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { roles } from "@/constants/roles";
import type { AuthSession } from "@/lib/auth/types";

export const SESSION_COOKIE = "ghm_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 14;

function parseSession(raw: string | undefined): AuthSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (
      typeof parsed.email === "string" &&
      (parsed.role === roles.user || parsed.role === roles.admin || parsed.role === roles.moderator)
    ) {
      const nickname =
        typeof parsed.nickname === "string" && parsed.nickname.trim()
          ? parsed.nickname.trim()
          : parsed.email.split("@")[0] ?? "User";
      return { email: parsed.email, role: parsed.role, nickname };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const store = await cookies();
  return parseSession(store.get(SESSION_COOKIE)?.value);
}

export function getSessionFromRequest(request: NextRequest): AuthSession | null {
  return parseSession(request.cookies.get(SESSION_COOKIE)?.value);
}

export async function setSession(session: AuthSession): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
