"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

import {
  PUBLIC_PAGE_ACCENT,
  PublicListPageShell,
} from "@/components/layout/PublicListPageShell";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

const HOT_DEALS = [
  {
    id: "hello-banh-mi",
    headline: "$5",
    dish: "PORK ROLL",
    venue: "Hello Banh Mi · West End",
    note: "First 50 rolls today. Cash only.",
    endsIn: "2h 12m",
  },
  {
    id: "cheap-dumplings",
    headline: "2-for-1",
    dish: "LAKSA",
    venue: "Laksa Lane · Fortitude Valley",
    note: "Dine-in only before 3pm. One per person.",
    endsIn: "4h 05m",
  },
  {
    id: "momo-house",
    headline: "$8",
    dish: "BIBIMBAP",
    venue: "Seoul Bowl · South Bank",
    note: "Lunch special. Mention this app at counter.",
    endsIn: "1h 30m",
  },
] as const;

export default function HotDealsPage() {
  return (
    <PublicListPageShell
      title="Hot Deals"
      subtitle="Time-limited specials. A little gift from your local."
      showEditButton={false}
      titleAddon={
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">
          <Flame className="h-3 w-3 shrink-0" aria-hidden />
          12 live now
        </span>
      }
    >
      <ul className="flex flex-col gap-4">
        {HOT_DEALS.map((deal) => (
          <li key={deal.id}>
            <article className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
              <div
                className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5"
                style={{ backgroundColor: PUBLIC_PAGE_ACCENT }}
              >
                <div className="min-w-0">
                  <p className="text-3xl font-bold leading-none tracking-tight text-white sm:text-[2rem]">
                    {deal.headline}
                  </p>
                  <p className="mt-1.5 text-xs font-bold tracking-[0.12em] text-white/95">{deal.dish}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white sm:text-xs">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: PUBLIC_PAGE_ACCENT }}
                    aria-hidden
                  />
                  Ends in {deal.endsIn}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-[15px] font-bold leading-snug text-neutral-900">{deal.venue}</p>
                  <p className="mt-1 text-sm leading-snug text-neutral-500">{deal.note}</p>
                </div>
                <Link
                  href={routes.restaurant(deal.id)}
                  className={cn(
                    "shrink-0 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800",
                    "shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98]",
                  )}
                >
                  View
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </PublicListPageShell>
  );
}