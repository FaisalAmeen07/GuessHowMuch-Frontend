/** Same weights as backend `computeScores` in rankingSystem.model.js */
export const POPULARITY_VOTE_WEIGHT = 3;
export const POPULARITY_ACTIVITY_WEIGHT = 2;
export const POPULARITY_ENGAGEMENT_WEIGHT = 1;

function voteUnit(vote: "UP" | "DOWN"): number {
  return vote === "UP" ? 1 : -1;
}

/** Worth it adds, overrated subtracts; new vote also bumps recent activity. */
export function getVotePopularityDelta(
  previousVote: "UP" | "DOWN" | null,
  nextVote: "UP" | "DOWN",
): number {
  const prev = previousVote ? voteUnit(previousVote) : 0;
  const next = voteUnit(nextVote);
  const voteDelta = (next - prev) * POPULARITY_VOTE_WEIGHT;
  const activityDelta = previousVote == null ? 1 : 0;
  return voteDelta + activityDelta * POPULARITY_ACTIVITY_WEIGHT;
}

export function getTopLevelCommentPopularityDelta(): number {
  return (
    2 * POPULARITY_ENGAGEMENT_WEIGHT + 1 * POPULARITY_ACTIVITY_WEIGHT
  );
}

export function getReplyCommentPopularityDelta(): number {
  return (
    1 * POPULARITY_ENGAGEMENT_WEIGHT + 1 * POPULARITY_ACTIVITY_WEIGHT
  );
}

export function getCommentLikePopularityDelta(): number {
  return POPULARITY_ENGAGEMENT_WEIGHT;
}
