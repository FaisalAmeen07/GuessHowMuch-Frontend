import "server-only";

import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/accessTokenCookie.constants";

/** Match backend JWT (`expiresIn: "7d"`). */
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

export async function setAccessTokenCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, token, {
    // Readable on the client so Bearer can be attached to cross-origin API calls.
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function getAccessTokenCookie(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(ACCESS_TOKEN_COOKIE)?.value;
  return raw?.trim() || null;
}

export async function clearAccessTokenCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
}
