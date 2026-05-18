"use client";

import Link from "next/link";

import { routes } from "@/config/routes";
import { ProfilePanelContent } from "@/features/profile/components/ProfilePanelContent";

const PAGE_BG = "#fff9f2";

export function ProfileScreen() {
  return (
    <div
      className="min-h-[100dvh] w-full min-w-0 overflow-x-hidden pb-[max(5.5rem,env(safe-area-inset-bottom)+4.5rem)]"
      style={{ backgroundColor: PAGE_BG }}
    >
      <header className="border-b border-neutral-200/60 bg-[#fff9f2]/95 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full min-w-0 max-w-lg items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <Link
            href={routes.map}
            className="text-sm font-semibold text-neutral-600 transition hover:text-neutral-900"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full min-w-0 max-w-lg justify-center px-4 py-6 sm:px-5">
        <ProfilePanelContent />
      </main>
    </div>
  );
}
