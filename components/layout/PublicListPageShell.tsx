"use client";

import { DropFeedPenButton } from "@/components/layout/DropFeedPenButton";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export const PUBLIC_PAGE_ACCENT = "#FF5722";
export const PUBLIC_PAGE_BG = "#fff9f2";
/** Shared top inset for list-style public pages (rankings → submissions queue). */
export const PUBLIC_PAGE_HEADER_PT =
  "pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.75rem))]";

type PublicListPageShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  titleAddon?: React.ReactNode;
  /** Custom header action (e.g. comment button on Feed). Overrides default drop-feed pencil. */
  headerAction?: React.ReactNode;
  showEditButton?: boolean;
};

export function PublicListPageShell({
  title,
  subtitle,
  children,
  titleAddon,
  headerAction,
  showEditButton = true,
}: PublicListPageShellProps) {
  return (
    <div
      className="min-h-[100dvh] w-full min-w-0 overflow-x-hidden pb-[max(5.5rem,env(safe-area-inset-bottom)+4.5rem)]"
      style={{ backgroundColor: PUBLIC_PAGE_BG }}
    >
      <header
        className={cn(
          "sticky top-0 z-10 backdrop-blur-md",
          "bg-[#fff9f2]/95",
          PUBLIC_PAGE_HEADER_PT,
        )}
      >
        <div className="mx-auto flex w-full min-w-0 max-w-xl items-start justify-between gap-3 px-4 sm:px-5">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-black/[0.04]"
              style={{ backgroundColor: PUBLIC_PAGE_ACCENT }}
            >
              <span className="text-lg font-bold">G</span>
            </div>
            <div className="min-w-0 pt-0.5">
              <h1 className="text-base font-bold leading-snug text-neutral-900">{siteConfig.name}</h1>
              <p className="text-xs text-neutral-500 sm:text-sm">{siteConfig.tagline}</p>
            </div>
          </div>
          {headerAction ?? (showEditButton ? <DropFeedPenButton /> : null)}
        </div>
        <div className="mx-auto mt-5 w-full min-w-0 max-w-xl px-4 sm:mt-6 sm:px-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.65rem]">{title}</h2>
            {titleAddon}
          </div>
          <p className="mt-1 inline-block w-fit max-w-full text-balance text-sm leading-snug text-neutral-600">
            {subtitle}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-xl px-4 pb-6 pt-5 sm:px-5">{children}</main>
    </div>
  );
}
