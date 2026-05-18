"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Info, ThumbsUp } from "lucide-react";

import { BrokiesClubModal } from "@/features/maps/saved/components/BrokiesClubModal";

import {
  PUBLIC_PAGE_ACCENT,
  PublicListPageShell,
} from "@/components/layout/PublicListPageShell";
import { routes } from "@/config/routes";
import { MOCK_RESTAURANTS } from "@/features/restaurants/data/mock-restaurants";
import { formatPriceCompact } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";

const VOTE_YELLOW = "#facc15";
const DEMO_DISTANCES = ["500m", "850m", "320m", "1.2km"] as const;

const SAVED_IDS = ["momo-house", "sushi-dlite", "hello-banh-mi", "cheap-dumplings"] as const;

export default function SavedPage() {
  const [brokiesOpen, setBrokiesOpen] = useState(false);
  const saved = SAVED_IDS.map((id) => MOCK_RESTAURANTS.find((r) => r.id === id)).filter(
    (r): r is NonNullable<typeof r> => Boolean(r),
  );

  return (
    <PublicListPageShell
      title="Saved feeds"
      subtitle="Your secret stash of cheap wins."
      showEditButton={false}
    >
      <section className="mb-5">
        <h3 className="text-lg font-bold tracking-tight text-neutral-900">Brokies Club</h3>
        <button
          type="button"
          onClick={() => setBrokiesOpen(true)}
          className="mt-3 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(255,87,34,0.35)] transition hover:brightness-105 active:scale-[0.99]"
          style={{ backgroundColor: PUBLIC_PAGE_ACCENT }}
        >
          Join the Club
        </button>
      </section>

      <BrokiesClubModal open={brokiesOpen} onClose={() => setBrokiesOpen(false)} />

      <div className="mb-5 flex gap-2.5 rounded-2xl border border-orange-200/50 bg-[#ffe8d9]/80 px-4 py-3.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-900/70" aria-hidden />
        <p className="text-sm leading-snug text-amber-950/80">
          Your saved places are stored on this device only. No account needed.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {saved.map((r, index) => (
          <li key={r.id}>
            <Link
              href={routes.restaurant(r.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-sm",
                "transition hover:border-neutral-300 hover:shadow-md active:scale-[0.995]",
              )}
            >
              <div
                className="h-16 w-16 shrink-0 rounded-xl border border-neutral-200/70 bg-neutral-100"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-1.5">
                  <span className="text-[15px] font-bold text-neutral-900">{r.name}</span>
                  <span className="text-sm font-medium text-neutral-500">
                    · {DEMO_DISTANCES[index % DEMO_DISTANCES.length]}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-neutral-500">{r.dish}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold text-neutral-900">{r.suburb}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-bold">
                    <ThumbsUp className="h-3.5 w-3.5 shrink-0" style={{ color: VOTE_YELLOW }} aria-hidden />
                    <span className="tabular-nums" style={{ color: VOTE_YELLOW }}>
                      +{r.netScore}
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 self-stretch justify-between py-0.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50"
                  aria-hidden
                >
                  <Heart className="h-4 w-4 fill-current" style={{ color: PUBLIC_PAGE_ACCENT }} />
                </span>
                <span
                  className="text-2xl font-bold leading-none tabular-nums tracking-tight"
                  style={{ color: PUBLIC_PAGE_ACCENT }}
                >
                  {formatPriceCompact(r.price)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-5 w-full rounded-full border border-neutral-200/90 bg-white py-3.5 text-sm font-bold text-neutral-900 shadow-sm transition hover:bg-neutral-50 active:scale-[0.99]"
      >
        Clear all
      </button>
    </PublicListPageShell>
  );
}