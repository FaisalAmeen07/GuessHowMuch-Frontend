const STORAGE_KEY = "ghm-restaurant-popularity-net";

type Store = Record<string, number>;

function readAll(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Store = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/** Popularity score from ranking API — shown as “Net score”. */
export function getStoredPopularityNetScore(restaurantId: number): number | null {
  const v = readAll()[String(restaurantId)];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export function setStoredPopularityNetScore(restaurantId: number, score: number) {
  if (!Number.isFinite(score)) return;
  const all = readAll();
  all[String(restaurantId)] = score;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  dispatchPopularityUpdated(restaurantId, score);
}

/** Apply vote/comment delta to cached net score (instant UI before API refresh). */
export function adjustStoredPopularityNetScore(
  restaurantId: number,
  delta: number,
): number {
  const base = getStoredPopularityNetScore(restaurantId) ?? 0;
  const next = base + delta;
  setStoredPopularityNetScore(restaurantId, next);
  return next;
}

export const POPULARITY_UPDATED_EVENT = "ghm-popularity-updated";

export function dispatchPopularityUpdated(restaurantId: number, score: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<{ restaurantId: number; score: number }>(
      POPULARITY_UPDATED_EVENT,
      { detail: { restaurantId, score } },
    ),
  );
}

export function formatPopularityNetScore(score: number): string {
  return String(score);
}
