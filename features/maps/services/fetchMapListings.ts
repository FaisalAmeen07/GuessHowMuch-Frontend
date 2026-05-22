import { filterListings, getListings } from "@/api/routes/listings.api";
import { nearbySearchConfig } from "@/config/nearbySearch";
import type {
  CuisineFilterId,
  LatLng,
  PriceFilterId,
  Restaurant,
} from "@/features/restaurants/types/restaurant";
import { haversineKm } from "@/features/restaurants/utils/distance";
import {
  cuisineFilterToApi,
  isTopRatedFilter,
  maxPriceForFilter,
  showOnlyFeedsToListingsApi,
} from "@/features/restaurants/utils/listingFilters";
import type { ShowOnlyFeedsId } from "@/features/restaurants/types/restaurant";
import { ensureTopRatedRankingCache } from "@/features/maps/services/ensureTopRatedRankingCache";
import { mapFilterListingToRestaurants } from "@/features/restaurants/utils/mapListingFilter";
import { mapListingRowsToRestaurants } from "@/features/restaurants/utils/mapListings";
import { filterRestaurantsToTopRatedLeaderboard } from "@/lib/rankings/topRatedRankingStorage";

function withinRadiusKm(list: Restaurant[], center: LatLng, radiusKm: number): Restaurant[] {
  return list.filter((r) => haversineKm(center, r.position) <= radiusKm);
}

export type MapListingsFilterParams = {
  priceFilterId: PriceFilterId;
  cuisineId: CuisineFilterId;
  showOnlyFeeds?: ShowOnlyFeedsId;
};

export async function fetchMapListings(
  searchCenter: LatLng,
  filters: MapListingsFilterParams,
): Promise<Restaurant[]> {
  const { radiusKm } = nearbySearchConfig;
  const maxPrice = maxPriceForFilter(filters.priceFilterId);
  const cuisine = cuisineFilterToApi(filters.cuisineId);
  const topRatedChip = isTopRatedFilter(filters.priceFilterId);
  const showTopRated = filters.showOnlyFeeds === "top50";
  const applyTopRated = topRatedChip || showTopRated;
  const showOnlyApi = showOnlyFeedsToListingsApi(filters.showOnlyFeeds ?? "all");
  const useFilterApi =
    maxPrice != null ||
    cuisine != null ||
    applyTopRated ||
    Object.keys(showOnlyApi).length > 0;

  let topRatedIds = new Set<number>();
  if (applyTopRated) {
    topRatedIds = await ensureTopRatedRankingCache(searchCenter, radiusKm);
  }

  let list: Restaurant[] = [];

  if (useFilterApi) {
    const filterRes = await filterListings({
      ...(maxPrice != null ? { maxPrice } : {}),
      ...(cuisine ? { cuisine } : {}),
      ...showOnlyApi,
    });
    if (!filterRes.success) return [];
    list = mapFilterListingToRestaurants(
      filterRes.data,
      maxPrice,
      filters.showOnlyFeeds === "hotDeals",
    );
  } else {
    const listingsRes = await getListings();
    if (!listingsRes.success) return [];
    list = mapListingRowsToRestaurants(listingsRes.data);
  }

  if (applyTopRated) {
    list = filterRestaurantsToTopRatedLeaderboard(list, topRatedIds);
  }

  return withinRadiusKm(list, searchCenter, radiusKm);
}
