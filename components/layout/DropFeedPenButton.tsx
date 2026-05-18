"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";

import { DropFeedModal } from "@/features/maps/components/DropFeedModal";
import { cn } from "@/lib/utils/cn";

type DropFeedPenButtonProps = {
  className?: string;
};

export function DropFeedPenButton({ className }: DropFeedPenButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200/90 bg-white shadow-sm transition hover:bg-neutral-50",
          className,
        )}
        aria-label="Drop a feed"
      >
        <PenLine className="h-5 w-5 text-neutral-700" />
      </button>
      <DropFeedModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
