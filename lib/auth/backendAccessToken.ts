import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/accessTokenCookie.constants";

const LEGACY_SESSION_KEY = "ghm_access_token";

function decodeJwtExp(token: string): number | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: unknown };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function isTokenUsable(token: string): boolean {
  const exp = decodeJwtExp(token);
  if (exp == null) return false;
  return exp * 1000 > Date.now() + 60_000;
}

function readClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

function clearLegacySessionStorage(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
  localStorage.removeItem(LEGACY_SESSION_KEY);
}

/** Client: read JWT from the frontend auth cookie (for Authorization header). */
export function getBackendAccessToken(): string | null {
  clearLegacySessionStorage();
  const token = readClientCookie(ACCESS_TOKEN_COOKIE);
  if (!token || !isTokenUsable(token)) return null;
  return token;
}

/** @deprecated Token is set via server action `establishSessionAfterVerify`. */
export function setBackendAccessToken(_token: string) {
  clearLegacySessionStorage();
}

/** Client: clear readable cookie copy; server cookie cleared via `clearAccessTokenCookie`. */
export function clearBackendAccessToken() {
  if (typeof document === "undefined") return;
  clearLegacySessionStorage();
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Max-Age=0; path=/; SameSite=Lax${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}
