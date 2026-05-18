"use client";

import { formatPriceCompact } from "@/lib/utils/formatCurrency";
import { formatDistanceKm } from "@/features/restaurants/utils/distance";
import type { RestaurantWithDistance } from "@/features/restaurants/types/restaurant";
import { cn } from "@/lib/utils/cn";

const ACCENT = "#FF5722";

type MapSearchResultRowProps = {
  restaurant: RestaurantWithDistance;
  onSelect: () => void;
  className?: string;
};

export function MapSearchResultRow({ restaurant, onSelect, className }: MapSearchResultRowProps) {
  const r = restaurant;
  const dist =
    r.distanceKm != null && Number.isFinite(r.distanceKm) && r.distanceKm >= 0
      ? formatDistanceKm(r.distanceKm, r.distanceIsDriving ? "drive" : "straight")
      : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition hover:bg-neutral-50 active:bg-neutral-100/80 sm:gap-3 sm:px-3.5 sm:py-3",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[13px] font-bold leading-snug text-neutral-900 sm:text-sm">
          {r.name}
          {dist ? <span className="font-medium text-neutral-500"> · {dist}</span> : null}
        </p>
        <p className="truncate text-[12px] leading-snug text-neutral-600 sm:text-[13px]">{r.dish}</p>
        <p className="truncate text-[12px] font-bold leading-snug text-neutral-900 sm:text-[13px]">
          {r.suburb}
        </p>
      </div>
      <span
        className="shrink-0 self-start pt-0.5 text-lg font-bold tabular-nums leading-none sm:text-xl"
        style={{ color: ACCENT }}
        aria-label={`Price ${formatPriceCompact(r.price)}`}
      >
        {formatPriceCompact(r.price)}
      </span>
    </button>
  );
}
