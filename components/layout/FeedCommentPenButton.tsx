"use client";

import { PenLine } from "lucide-react";

import { FeedCommentModal } from "@/features/community/components/FeedCommentModal";
import { cn } from "@/lib/utils/cn";

type FeedCommentPenButtonProps = {
  defaultTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPenClick?: () => void;
  className?: string;
};

export function FeedCommentPenButton({
  defaultTitle,
  open,
  onOpenChange,
  onPenClick,
  className,
}: FeedCommentPenButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          onPenClick?.();
          onOpenChange(true);
        }}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200/90 bg-white shadow-sm transition hover:bg-neutral-50",
          className,
        )}
        aria-label="Add a comment"
      >
        <PenLine className="h-5 w-5 text-neutral-700" />
      </button>
      <FeedCommentModal
        open={open}
        onClose={() => onOpenChange(false)}
        defaultTitle={defaultTitle}
      />
    </>
  );
}
