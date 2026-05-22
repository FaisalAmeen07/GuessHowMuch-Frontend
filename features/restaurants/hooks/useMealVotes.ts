"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/api/inspector";
import { getMealVoteTotals, submitMealVote } from "@/api/routes/votes.api";
import type { MealVoteTotals, VoteType } from "@/api/types/votes";
import { getOrCreateDeviceId } from "@/lib/votes/deviceId";
import { getVotePopularityDelta } from "@/lib/rankings/popularityAdjust";
import { adjustStoredPopularityNetScore } from "@/lib/rankings/restaurantPopularityStorage";
import { getMealVoteChoice, setMealVoteChoice } from "@/lib/votes/mealVoteStorage";

const EMPTY: MealVoteTotals = {
  upVotes: 0,
  downVotes: 0,
  totalVotes: 0,
  score: 0,
};

export function formatNetScore(score: number): string {
  if (score > 0) return `+${score}`;
  if (score === 0) return "+0";
  return String(score);
}

const VOTE_POLL_MS = 15_000;

export function useMealVotes(
  mealId: number,
  options?: {
    poll?: boolean;
    restaurantId?: number;
    onPopularityScore?: (score: number) => void;
  },
) {
  const queryClient = useQueryClient();
  const [totals, setTotals] = useState<MealVoteTotals>(EMPTY);
  const [myVote, setMyVote] = useState<"UP" | "DOWN" | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<"UP" | "DOWN" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    if (!Number.isFinite(mealId) || mealId <= 0) {
      setTotals(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getMealVoteTotals(mealId);
      if (res.success && res.data) {
        setTotals(res.data);
      }
      const stored = getMealVoteChoice(mealId);
      setMyVote(stored);
    } catch (err) {
      setTotals(EMPTY);
      setError(err instanceof ApiError ? err.message : "Could not load votes.");
    } finally {
      setLoading(false);
    }
  }, [mealId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!options?.poll || !Number.isFinite(mealId) || mealId <= 0) return;
    const id = window.setInterval(() => void refresh(), VOTE_POLL_MS);
    return () => window.clearInterval(id);
  }, [mealId, options?.poll, refresh]);

  const vote = useCallback(
    async (voteType: VoteType) => {
      if (submitting) return;
      if (myVote === voteType) return;

      setSubmitting(voteType);
      setError(null);

      try {
        const res = await submitMealVote(mealId, voteType, getOrCreateDeviceId());
        if (res.success && res.data) {
          setTotals(res.data);
          setMealVoteChoice(mealId, voteType);
          const prevVote = myVote;
          setMyVote(voteType);
          void queryClient.invalidateQueries({ queryKey: ["meal-vote-totals", mealId] });
          if (options?.restaurantId) {
            const delta = getVotePopularityDelta(prevVote, voteType);
            if (delta !== 0) {
              const score = adjustStoredPopularityNetScore(
                options.restaurantId,
                delta,
              );
              options.onPopularityScore?.(score);
            }
            void queryClient.invalidateQueries({
              queryKey: ["restaurant-popularity", options.restaurantId],
            });
          }
        }
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Could not submit your vote.",
        );
        void refresh();
      } finally {
        setSubmitting(null);
      }
    },
    [
      mealId,
      myVote,
      submitting,
      refresh,
      queryClient,
      options?.restaurantId,
      options?.onPopularityScore,
    ],
  );

  const hasVoted = myVote != null;

  return {
    totals,
    netScoreLabel: formatNetScore(totals.score),
    myVote,
    hasVoted,
    loading,
    submitting,
    error,
    voteUp: () => vote("UP"),
    voteDown: () => vote("DOWN"),
    refresh,
  };
}
