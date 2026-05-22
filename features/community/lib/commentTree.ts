import type { FeedPostComment } from "@/features/community/lib/mapCommunityComment";

export function updateCommentInTree(
  comments: FeedPostComment[],
  commentId: string,
  updater: (comment: FeedPostComment) => FeedPostComment,
): FeedPostComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return updater(comment);
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, updater),
      };
    }
    return comment;
  });
}

export function appendReplyToComment(
  comments: FeedPostComment[],
  parentId: string,
  reply: FeedPostComment,
): FeedPostComment[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return { ...comment, replies: [...comment.replies, reply] };
    }
    return comment;
  });
}

export function removeCommentFromTree(
  comments: FeedPostComment[],
  commentId: string,
): FeedPostComment[] {
  return comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) => ({
      ...comment,
      replies: removeCommentFromTree(comment.replies, commentId),
    }));
}

export function appendTopLevelComment(
  comments: FeedPostComment[],
  comment: FeedPostComment,
): FeedPostComment[] {
  return [...comments, comment];
}
