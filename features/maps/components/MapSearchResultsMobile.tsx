"use client";

import { ChevronLeft } from "lucide-react";

import { MapSearchResultsList } from "@/features/maps/components/MapSearchResultsList";
import type { RestaurantWithDistance } from "@/features/restaurants/types/restaurant";
import { cn } from "@/lib/utils/cn";

type MapSearchResultsMobileProps = {
  query: string;
  results: RestaurantWithDistance[];
  onBack: () => void;
  onSelect: (id: string) => void;
};

export function MapSearchResultsMobile({
  query,
  results,
  onBack,
  onSelect,
}: MapSearchResultsMobileProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto fixed inset-0 z-[150] flex flex-col bg-white",
        "pt-[max(0px,env(safe-area-inset-top))] pb-[max(0px,env(safe-area-inset-bottom))]",
      )}
    >
      <header className="flex shrink-0 items-center gap-2 border-b border-neutral-200/80 px-3 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100"
          aria-label="Close search results"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} />
        </button>
        <h2 className="min-w-0 flex-1 truncate text-lg font-semibold text-neutral-900">{query}</h2>
      </header>

      <div className="ghm-scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <MapSearchResultsList results={results} onSelect={onSelect} />
      </div>
    </div>
  );
}
