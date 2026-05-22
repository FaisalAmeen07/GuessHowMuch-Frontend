"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  getPopularityScoreFromRow,
  useRestaurantPopularity,
} from "@/features/rankings/hooks/useRestaurantPopularity";
import {
  formatPopularityNetScore,
  getStoredPopularityNetScore,
  POPULARITY_UPDATED_EVENT,
  setStoredPopularityNetScore,
} from "@/lib/rankings/restaurantPopularityStorage";
import { formatRankingScoreBreakdown } from "@/features/rankings/lib/rankingDisplay";
import { useMealVotes } from "@/features/restaurants/hooks/useMealVotes";
import { cn } from "@/lib/utils/cn";

const ACCENT = "#FF5722";

export type MealVoteCardsState = ReturnType<typeof useMealVotes>;

type MealVoteCardsUIProps = {
  vote: MealVoteCardsState;
  variant?: "panel" | "detail";
  className?: string;
  /** Ranking API vote net score label (e.g. +1). */
  rankingNetScoreLabel?: string | null;
  rankingLoading?: boolean;
  scoreBreakdown?: string | null;
};

export function MealVoteCardsUI({
  vote,
  variant = "panel",
  className,
  rankingNetScoreLabel = null,
  rankingLoading = false,
  scoreBreakdown = null,
}: MealVoteCardsUIProps) {
  const {
    totals,
    netScoreLabel,
    hasVoted,
    myVote,
    loading,
    submitting,
    error,
    voteUp,
    voteDown,
  } = vote;

  const isPanel = variant === "panel";
  const usePopularityNet = rankingNetScoreLabel != null || rankingLoading;
  const centerValue =
    usePopularityNet || !isPanel
      ? rankingLoading && rankingNetScoreLabel == null
        ? "…"
        : rankingNetScoreLabel != null
          ? rankingNetScoreLabel
          : loading
            ? "…"
            : netScoreLabel
      : loading
        ? "…"
        : netScoreLabel;
  const cardClass = isPanel
    ? "rounded-xl bg-white px-2 py-3 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition"
    : "text-center";

  const disabled = loading || submitting != null;

  return (
    <div className={className}>
      <div
        className={cn(
          "grid grid-cols-3 gap-2",
          !isPanel && "rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm",
        )}
      >
        <button
          type="button"
          onClick={() => void voteUp()}
          disabled={disabled}
          aria-pressed={myVote === "UP"}
          className={cn(
            cardClass,
            "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
            !disabled && "hover:bg-neutral-50/90 active:scale-[0.98]",
          )}
        >
          <ThumbsUp
            className={cn(
              "mx-auto h-5 w-5",
              isPanel ? "text-amber-400" : "text-emerald-600",
            )}
            strokeWidth={2}
            aria-hidden
          />
          <p className="mt-2 text-xs font-bold text-neutral-900">Worth it</p>
          <p className="mt-1 text-base font-bold tabular-nums text-neutral-900">
            {loading ? "…" : totals.upVotes}
          </p>
        </button>

        <div className={cardClass}>
          <p
            className={cn(
              "font-bold leading-none tabular-nums",
              isPanel ? "text-lg" : "text-lg text-[#FF5722]",
            )}
            style={isPanel ? { color: ACCENT } : undefined}
          >
            {centerValue}
          </p>
          <p
            className={cn(
              "mt-2 font-semibold uppercase tracking-wide text-neutral-500",
              isPanel ? "text-[10px]" : "text-xs font-medium normal-case",
            )}
          >
            Net score
          </p>
        </div>

        <button
          type="button"
          onClick={() => void voteDown()}
          disabled={disabled}
          aria-pressed={myVote === "DOWN"}
          className={cn(
            cardClass,
            "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
            !disabled && "hover:bg-neutral-50/90 active:scale-[0.98]",
          )}
        >
          <ThumbsDown
            className={cn(
              "mx-auto h-5 w-5",
              isPanel ? "text-amber-400" : "text-rose-500",
            )}
            strokeWidth={2}
            aria-hidden
          />
          <p className="mt-2 text-xs font-bold text-neutral-900">Overrated</p>
          <p className="mt-1 text-base font-bold tabular-nums text-neutral-900">
            {loading ? "…" : totals.downVotes}
          </p>
        </button>
      </div>

      {!isPanel && hasVoted && scoreBreakdown ? (
        <p className="mt-3 text-center text-xs leading-snug text-neutral-500">
          {scoreBreakdown}
        </p>
      ) : null}

      {hasVoted ? (
        <p className="mt-2 text-center text-xs text-neutral-500">
          Thanks — your vote was recorded.
        </p>
      ) : null}

      {error ? (
        <p className="mt-2 text-center text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type MealVoteCardsProps = {
  mealId: number;
  variant?: "panel" | "detail";
  className?: string;
  restaurantId?: number;
};

/** Self-contained cards (loads votes internally). */
export function MealVoteCards({
  mealId,
  variant,
  className,
  restaurantId,
}: MealVoteCardsProps) {
  const rid = restaurantId != null && restaurantId > 0 ? restaurantId : 0;
  const useRanking = rid > 0;
  const isDetail = variant === "detail";

  const [popularityNetLabel, setPopularityNetLabel] = useState<string | null>(() => {
    if (!useRanking) return null;
    const stored = getStoredPopularityNetScore(rid);
    return stored != null ? formatPopularityNetScore(stored) : null;
  });

  const syncPopularityLabel = useCallback(
    (score: number) => {
      setPopularityNetLabel(formatPopularityNetScore(score));
    },
    [],
  );

  const vote = useMealVotes(mealId, {
    poll: isDetail,
    restaurantId: useRanking ? rid : undefined,
    onPopularityScore: useRanking ? syncPopularityLabel : undefined,
  });

  const { data: rankingRow, isLoading: popularityLoading } = useRestaurantPopularity(
    useRanking ? rid : 0,
  );

  useEffect(() => {
    const score = getPopularityScoreFromRow(rankingRow);
    if (score == null || !useRanking) return;
    setStoredPopularityNetScore(rid, score);
    setPopularityNetLabel(formatPopularityNetScore(score));
  }, [rankingRow, rid, useRanking]);

  useEffect(() => {
    if (!useRanking) return;
    const onUpdated = (e: Event) => {
      const { restaurantId: updatedId, score } = (
        e as CustomEvent<{ restaurantId: number; score: number }>
      ).detail;
      if (updatedId === rid) syncPopularityLabel(score);
    };
    window.addEventListener(POPULARITY_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(POPULARITY_UPDATED_EVENT, onUpdated);
  }, [rid, useRanking, syncPopularityLabel]);

  return (
    <MealVoteCardsUI
      vote={vote}
      variant={variant}
      className={className}
      rankingNetScoreLabel={useRanking ? popularityNetLabel : undefined}
      rankingLoading={useRanking && popularityLoading}
      scoreBreakdown={
        isDetail && rankingRow ? formatRankingScoreBreakdown(rankingRow) : undefined
      }
    />
  );
}
