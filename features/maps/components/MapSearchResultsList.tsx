"use client";

import { MapSearchResultRow } from "@/features/maps/components/MapSearchResultRow";
import type { RestaurantWithDistance } from "@/features/restaurants/types/restaurant";
import { cn } from "@/lib/utils/cn";

type MapSearchResultsListProps = {
  results: RestaurantWithDistance[];
  onSelect: (id: string) => void;
  className?: string;
  emptyMessage?: string;
};

export function MapSearchResultsList({
  results,
  onSelect,
  className,
  emptyMessage = "No matches for this search.",
}: MapSearchResultsListProps) {
  if (results.length === 0) {
    return (
      <p className={cn("px-4 py-8 text-center text-sm text-neutral-500", className)}>{emptyMessage}</p>
    );
  }

  return (
    <ul className={cn("divide-y divide-dotted divide-neutral-300/55", className)}>
      {results.map((r) => (
        <li key={r.id}>
          <MapSearchResultRow restaurant={r} onSelect={() => onSelect(r.id)} />
        </li>
      ))}
    </ul>
  );
}
