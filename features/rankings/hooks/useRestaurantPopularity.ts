"use client";

import { useQuery } from "@tanstack/react-query";

import { getRestaurantPopularity } from "@/api/routes/ranking.api";
import type { RankedRestaurantRow } from "@/api/types/ranking";

/** Ranking API popularity for one restaurant (votes + activity + engagement). */
export function useRestaurantPopularity(restaurantId: number) {
  return useQuery({
    queryKey: ["restaurant-popularity", restaurantId],
    queryFn: async () => {
      const res = await getRestaurantPopularity(restaurantId);
      if (!res.success) return null;
      return res.data;
    },
    enabled: restaurantId > 0,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function getPopularityScoreFromRow(
  row: RankedRestaurantRow | null | undefined,
): number | null {
  return row?.popularityScore ?? null;
}

/** Vote net score from ranking API (e.g. +1) — for detail screen “Net score” card. */
export function getRankingNetScoreLabel(
  row: RankedRestaurantRow | null | undefined,
): string | null {
  if (!row?.votes) return null;
  const display = row.votes.displayScore?.trim();
  if (display) return display;
  const n = row.votes.netScore;
  if (n > 0) return `+${n}`;
  if (n === 0) return "+0";
  return String(n);
}
