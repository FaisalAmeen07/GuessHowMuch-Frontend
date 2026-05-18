"use client";

import { MapSearchResultsList } from "@/features/maps/components/MapSearchResultsList";
import type { RestaurantWithDistance } from "@/features/restaurants/types/restaurant";
import { cn } from "@/lib/utils/cn";

type MapSearchResultsPanelProps = {
  results: RestaurantWithDistance[];
  onSelect: (id: string) => void;
  className?: string;
  /** Flush under header search — no top gap, shared width */
  attached?: boolean;
};

export function MapSearchResultsPanel({
  results,
  onSelect,
  className,
  attached = false,
}: MapSearchResultsPanelProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex flex-col overflow-hidden bg-white",
        attached
          ? "w-full max-w-none rounded-t-none rounded-b-2xl border border-t-0 border-neutral-200/90 shadow-[0_10px_28px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-inset ring-neutral-200/40"
          : "w-[min(20rem,calc(100vw-2rem))] max-w-[20rem] rounded-2xl border border-neutral-200/85 shadow-[0_8px_40px_rgba(0,0,0,0.12),0_2px_12px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      <div className="ghm-scrollbar-hidden min-h-0 max-h-[inherit] overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <MapSearchResultsList results={results} onSelect={onSelect} />
      </div>
    </div>
  );
}
