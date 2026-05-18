"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import type { SidePanelAnchor } from "@/features/maps/components/MapRestaurantSidePanel";
import { ProfilePanelContent } from "@/features/profile/components/ProfilePanelContent";
import { cn } from "@/lib/utils/cn";

type ProfileSidePanelProps = {
  onClose: () => void;
  anchor: SidePanelAnchor | null;
};

export function ProfileSidePanel({ onClose, anchor }: ProfileSidePanelProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const topPx = anchor?.topPx ?? 0;

  const panel = (
    <>
      <button
        type="button"
        aria-label="Close profile"
        className="fixed inset-0 z-[200] bg-neutral-950/25 backdrop-blur-[2px] animate-[ghm-backdrop-in_0.2s_ease-out] motion-reduce:animate-none"
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed z-[210] flex min-h-0 flex-col overflow-hidden",
          "motion-safe:animate-[ghm-slide-in-right_0.28s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none",
          "right-0 w-[min(22rem,calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)))]",
          "pl-3 pr-[max(0.75rem,env(safe-area-inset-right))]",
        )}
        style={{
          top: `max(${topPx}px, env(safe-area-inset-top))`,
          bottom: 0,
        }}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <ProfilePanelContent variant="sidebar" onClose={onClose} />
        </div>
      </aside>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(panel, document.body);
}
