import type { ApiCommunityPostComment } from "@/api/types/community";
import { displayCommunityAuthor } from "@/features/community/lib/displayAuthor";
import { formatFeedAgo } from "@/features/community/lib/mapCommunityPost";

export type FeedPostComment = {
  id: string;
  authorUserId: number;
  author: string;
  initial: string;
  ago: string;
  body: string;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  replies: FeedPostComment[];
};

export function mapApiCommunityComment(comment: ApiCommunityPostComment): FeedPostComment {
  const author = displayCommunityAuthor(comment.user);
  const authorUserId = comment.user?.id ?? comment.userId;

  return {
    id: comment.id,
    authorUserId,
    author,
    initial: author.slice(0, 1).toUpperCase(),
    ago: formatFeedAgo(comment.createdAt),
    body: comment.body,
    createdAt: comment.createdAt,
    likesCount: comment.likesCount ?? 0,
    likedByMe: Boolean(comment.likedByMe),
    replies: (comment.replies ?? []).map((reply) => mapApiCommunityComment(reply)),
  };
}
