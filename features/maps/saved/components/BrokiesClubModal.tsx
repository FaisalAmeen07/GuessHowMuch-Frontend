"use client";

import { MapPin, Medal, Percent, X, type LucideIcon } from "lucide-react";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils/cn";

const ACCENT = "#FF5722";

const PERKS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MapPin,
    title: "Hidden gems",
    description: "spots too good to share for free",
  },
  {
    icon: Percent,
    title: "Early deals",
    description: "first dibs before they hit the feed",
  },
  {
    icon: Medal,
    title: "OG Brokie badge",
    description: "let everyone know you're serious",
  },
];

export type BrokiesClubModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BrokiesClubModal({ open, onClose }: BrokiesClubModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const ui = (
    <>
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        className={cn(
          "fixed inset-0 z-[9998] bg-neutral-950/40 transition-opacity motion-reduce:transition-none",
          "max-sm:bg-neutral-950/25 sm:bg-neutral-950/40",
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed left-1/2 z-[9999] flex w-[calc(100%-2rem)] max-w-[22.5rem] -translate-x-1/2 flex-col overflow-hidden bg-white",
          "top-[max(2.25rem,env(safe-area-inset-top)+1rem)]",
          "bottom-[max(1.25rem,env(safe-area-inset-bottom)+0.75rem)]",
          "rounded-3xl border border-neutral-200/80",
          "shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:max-w-[24rem]",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-2 min-w-0">
            <h2 id={titleId} className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.65rem]">
              Brokies Club
            </h2>
            <p className="mt-1 text-sm leading-snug text-neutral-500">
              For the truly committed cheapskate.
            </p>
          </div>

          <ul className="mt-4 space-y-3 sm:mt-5">
            {PERKS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50"
                  aria-hidden
                >
                  <Icon className="h-4 w-4" style={{ color: ACCENT }} strokeWidth={2} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[15px] font-bold text-neutral-900">{title}</p>
                  <p className="mt-0.5 text-sm leading-snug text-neutral-500">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-auto shrink-0 pt-5 sm:pt-6">
            <p className="mb-3 text-center text-sm text-neutral-500">
              $2.99 / month. Less than a servo pie.
            </p>
            <button
              type="button"
              onClick={() => {
                console.info("Brokies Club join — wire to payments later");
                onClose();
              }}
              className="flex h-12 w-full items-center justify-center rounded-2xl text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(255,87,34,0.35)] transition hover:brightness-105 active:scale-[0.99]"
              style={{ backgroundColor: ACCENT }}
            >
              Join the Club
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(ui, document.body);
}
