import { getBackendAccessToken } from "@/lib/auth/backendAccessToken";

/** Reads numeric user id from the backend JWT stored after magic-link verify. */
export function getUserIdFromAccessToken(): number | null {
  const token = getBackendAccessToken();
  if (!token) return null;

  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const payload = JSON.parse(atob(segment)) as { id?: unknown };
    const id = payload.id;
    if (typeof id === "number" && Number.isFinite(id)) return id;
    if (typeof id === "string" && id.trim()) {
      const parsed = Number(id);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  } catch {
    return null;
  }
}
