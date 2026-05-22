import { getRestaurantRankings } from "@/api/routes/ranking.api";
import type { LatLng } from "@/features/restaurants/types/restaurant";
import { TOP_RATED_LEADERBOARD_LIMIT } from "@/constants/limits";
import {
  getTopRatedRestaurantIdSet,
  isTopRatedRankingCacheFresh,
  syncTopRatedRanking,
} from "@/lib/rankings/topRatedRankingStorage";

/** Load popularity leaderboard into localStorage for Top rated map filter. */
export async function ensureTopRatedRankingCache(
  searchCenter: LatLng,
  radiusKm: number,
): Promise<Set<number>> {
  if (isTopRatedRankingCacheFresh()) {
    return getTopRatedRestaurantIdSet();
  }

  try {
    const res = await getRestaurantRankings({
      sortBy: "popularity",
      limit: TOP_RATED_LEADERBOARD_LIMIT,
      lat: searchCenter.lat,
      lng: searchCenter.lng,
      radiusKm,
    });
    if (res.success && res.data.length > 0) {
      syncTopRatedRanking(res.data);
    }
  } catch {
    /* use existing cache if any */
  }

  return getTopRatedRestaurantIdSet();
}
