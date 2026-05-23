"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronDown, MoreHorizontal, Send, ThumbsUp, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

import { ApiError } from "@/api/inspector";
import {
  createCommunityPostComment,
  deleteCommunityPostComment,
  getCommunityPostComments,
  patchCommunityPostComment,
  toggleCommunityCommentLike,
} from "@/api/routes/community.api";
import { routes } from "@/config/routes";
import {
  appendReplyToComment,
  appendTopLevelComment,
  removeCommentFromTree,
  updateCommentInTree,
} from "@/features/community/lib/commentTree";
import {
  mapApiCommunityComment,
  type FeedPostComment,
} from "@/features/community/lib/mapCommunityComment";
import type { FeedPostCard } from "@/features/community/lib/mapCommunityPost";
import { getUserIdFromAccessToken } from "@/lib/auth/jwtUserId";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils/cn";

const ACCENT = "#FF5722";

type CommunityCommentsPanelProps = {
  open: boolean;
  post: FeedPostCard | null;
  onClose: () => void;
};

type CommentSort = "relevant" | "newest";

type CommentRowProps = {
  comment: FeedPostComment;
  isReply?: boolean;
  canManage: boolean;
  isEditing: boolean;
  editDraft: string;
  menuOpen: boolean;
  busy: boolean;
  liking: boolean;
  isSignedIn: boolean;
  expandedReplies: boolean;
  onToggleExpandedReplies: () => void;
  onToggleMenu: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onEditDraftChange: (value: string) => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  onLike: () => void;
  onReply: () => void;
  renderReply?: (reply: FeedPostComment) => React.ReactNode;
};

function UserAvatar({
  initial,
  className,
}: {
  initial: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
        className,
      )}
      style={{ backgroundColor: ACCENT }}
      aria-hidden
    >
      {initial.slice(0, 1).toUpperCase()}
    </span>
  );
}

function CommentLikeButton({
  likedByMe,
  likesCount,
  liking,
  disabled,
  onLike,
}: {
  likedByMe: boolean;
  likesCount: number;
  liking: boolean;
  disabled: boolean;
  onLike: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onLike}
      disabled={disabled || liking}
      className={cn(
        "inline-flex items-center gap-1 transition disabled:opacity-50",
        likedByMe ? "text-[#FF5722]" : "text-neutral-500 hover:text-neutral-700",
      )}
      aria-pressed={likedByMe}
      aria-label={likedByMe ? `Unlike comment (${likesCount})` : `Like comment (${likesCount})`}
    >
      {likedByMe ? (
        <ThumbsUp className="h-3.5 w-3.5 fill-current" aria-hidden />
      ) : (
        <span>Like</span>
      )}
      {likesCount > 0 ? <span>{likesCount}</span> : null}
    </button>
  );
}

function CommentRow({
  comment,
  isReply = false,
  canManage,
  isEditing,
  editDraft,
  menuOpen,
  busy,
  liking,
  isSignedIn,
  expandedReplies,
  onToggleExpandedReplies,
  onToggleMenu,
  onStartEdit,
  onCancelEdit,
  onEditDraftChange,
  onSaveEdit,
  onDelete,
  onLike,
  onReply,
  renderReply,
}: CommentRowProps) {
  const visibleReplies =
    comment.replies.length <= 1 || expandedReplies
      ? comment.replies
      : comment.replies.slice(0, 1);
  const hiddenReplyCount = comment.replies.length - visibleReplies.length;

  return (
    <li className={cn("py-2.5", isReply && "pl-9")}>
      <div className="flex gap-2.5">
        <UserAvatar initial={comment.initial} className="mt-0.5 h-8 w-8 text-xs" />
        <div className="relative min-w-0 flex-1">
          {isEditing ? (
            <div className="rounded-2xl bg-neutral-100 px-3 py-2.5">
              <textarea
                value={editDraft}
                onChange={(e) => onEditDraftChange(e.target.value)}
                rows={2}
                className="w-full resize-none bg-transparent text-sm text-neutral-800 outline-none"
                aria-label="Edit comment"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onSaveEdit}
                  disabled={busy || !editDraft.trim()}
                  className="text-xs font-semibold text-[#FF5722] disabled:opacity-40"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onCancelEdit}
                  disabled={busy}
                  className="text-xs font-semibold text-neutral-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="inline-block max-w-[calc(100%-2rem)] rounded-2xl bg-neutral-100 px-3 py-2">
                <p className="text-[13px] font-semibold leading-tight text-neutral-900">
                  {comment.author}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-neutral-800">{comment.body}</p>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 pl-1 text-xs font-semibold">
                <span className="text-neutral-500">{comment.ago}</span>
                <CommentLikeButton
                  likedByMe={comment.likedByMe}
                  likesCount={comment.likesCount}
                  liking={liking}
                  disabled={!isSignedIn}
                  onLike={onLike}
                />
                <button
                  type="button"
                  onClick={onReply}
                  disabled={!isSignedIn}
                  className="text-neutral-500 transition hover:text-neutral-700 disabled:opacity-50"
                >
                  Reply
                </button>
              </div>
            </>
          )}

          {canManage && !isEditing ? (
            <div className="absolute right-0 top-0">
              <button
                type="button"
                onClick={onToggleMenu}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Comment options"
                aria-expanded={menuOpen}
              >
                <MoreHorizontal className="h-4 w-4" aria-hidden />
              </button>
              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-9 z-10 min-w-[7.5rem] overflow-hidden rounded-xl border border-neutral-200/90 bg-white py-1 shadow-lg"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={onStartEdit}
                    className="block w-full px-3 py-2 text-left text-sm text-neutral-800 hover:bg-neutral-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={onDelete}
                    className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {!isReply && comment.replies.length > 0 && renderReply ? (
        <ul className="mt-0.5">
          {visibleReplies.map((reply) => renderReply(reply))}
          {hiddenReplyCount > 0 ? (
            <li className="py-1 pl-9">
              <button
                type="button"
                onClick={onToggleExpandedReplies}
                className="text-xs font-semibold text-neutral-600 hover:underline"
              >
                View all {comment.replies.length} replies
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </li>
  );
}

export function CommunityCommentsPanel({ open, post, onClose }: CommunityCommentsPanelProps) {
  const titleId = useId();
  const queryClient = useQueryClient();
  const { isSignedIn, session } = useAuth();
  const myUserId = isSignedIn ? getUserIdFromAccessToken() : null;

  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<FeedPostComment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<CommentSort>("relevant");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [menuCommentId, setMenuCommentId] = useState<string | null>(null);
  const [commentBusyId, setCommentBusyId] = useState<string | null>(null);
  const [likingCommentId, setLikingCommentId] = useState<string | null>(null);
  const [expandedReplyThreads, setExpandedReplyThreads] = useState<Set<string>>(
    () => new Set(),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const postId = post?.id ?? "";
  const loginHref = `${routes.login}?returnTo=${encodeURIComponent(routes.community)}`;
  const commentAsName = session?.nickname?.trim() || "you";
  const inputPlaceholder = replyingTo
    ? `Reply to ${replyingTo.author}`
    : `Comment as ${commentAsName}`;

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["community-post-comments", postId],
    queryFn: async () => {
      const res = await getCommunityPostComments(postId);
      return res.data.comments.map((c) => mapApiCommunityComment(c));
    },
    enabled: open && postId.length > 0,
    staleTime: 15_000,
  });

  const sortedComments = useMemo(() => {
    if (sort === "relevant") return comments;
    return [...comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [comments, sort]);

  useEffect(() => {
    if (!open) {
      setDraft("");
      setReplyingTo(null);
      setError(null);
      setSort("relevant");
      setSortMenuOpen(false);
      setEditingCommentId(null);
      setEditDraft("");
      setMenuCommentId(null);
      setExpandedReplyThreads(new Set());
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 320);
    return () => window.clearTimeout(t);
  }, [open, postId]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting && !commentBusyId) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, submitting, commentBusyId]);

  useEffect(() => {
    if (!sortMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target || sortMenuRef.current?.contains(target)) return;
      setSortMenuOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [sortMenuOpen]);

  const setCommentsCache = (updater: (prev: FeedPostComment[]) => FeedPostComment[]) => {
    queryClient.setQueryData<FeedPostComment[]>(
      ["community-post-comments", postId],
      (prev) => updater(prev ?? []),
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !postId) return;

    if (!isSignedIn) {
      setError("Login to comment.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await createCommunityPostComment(
        postId,
        text,
        replyingTo?.id ?? null,
      );
      const mapped = mapApiCommunityComment(res.data);

      if (replyingTo) {
        setCommentsCache((prev) => appendReplyToComment(prev, replyingTo.id, mapped));
        setExpandedReplyThreads((prev) => new Set(prev).add(replyingTo.id));
      } else {
        setCommentsCache((prev) => appendTopLevelComment(prev, mapped));
      }

      setDraft("");
      setReplyingTo(null);
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not post comment. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (comment: FeedPostComment) => {
    if (!isSignedIn) {
      setError("Login to like comments.");
      return;
    }

    setLikingCommentId(comment.id);
    setError(null);
    try {
      const res = await toggleCommunityCommentLike(comment.id);
      setCommentsCache((prev) =>
        updateCommentInTree(prev, comment.id, (c) => ({
          ...c,
          likedByMe: res.liked,
          likesCount: res.likesCount,
        })),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not like comment.");
    } finally {
      setLikingCommentId(null);
    }
  };

  const saveEdit = async (commentId: string) => {
    const text = editDraft.trim();
    if (!text) return;

    setCommentBusyId(commentId);
    setError(null);
    try {
      const res = await patchCommunityPostComment(commentId, text);
      const mapped = mapApiCommunityComment(res.data);
      setCommentsCache((prev) =>
        updateCommentInTree(prev, commentId, (c) => ({
          ...mapped,
          likedByMe: c.likedByMe,
          likesCount: c.likesCount,
          replies: c.replies,
        })),
      );
      setEditingCommentId(null);
      setEditDraft("");
      setMenuCommentId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save comment.");
    } finally {
      setCommentBusyId(null);
    }
  };

  const removeComment = async (commentId: string) => {
    setCommentBusyId(commentId);
    setError(null);
    try {
      await deleteCommunityPostComment(commentId);
      setCommentsCache((prev) => removeCommentFromTree(prev, commentId));
      setMenuCommentId(null);
      setEditingCommentId(null);
      if (replyingTo?.id === commentId) setReplyingTo(null);
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete comment.");
    } finally {
      setCommentBusyId(null);
    }
  };

  const renderCommentRow = (comment: FeedPostComment, isReply = false) => {
    const canManage = myUserId != null && comment.authorUserId === myUserId;

    return (
      <CommentRow
        key={comment.id}
        comment={comment}
        isReply={isReply}
        canManage={canManage}
        isEditing={editingCommentId === comment.id}
        editDraft={editingCommentId === comment.id ? editDraft : comment.body}
        menuOpen={menuCommentId === comment.id}
        busy={commentBusyId === comment.id}
        liking={likingCommentId === comment.id}
        isSignedIn={isSignedIn}
        expandedReplies={expandedReplyThreads.has(comment.id)}
        onToggleExpandedReplies={() =>
          setExpandedReplyThreads((prev) => {
            const next = new Set(prev);
            if (next.has(comment.id)) next.delete(comment.id);
            else next.add(comment.id);
            return next;
          })
        }
        onToggleMenu={() =>
          setMenuCommentId((id) => (id === comment.id ? null : comment.id))
        }
        onStartEdit={() => {
          setEditingCommentId(comment.id);
          setEditDraft(comment.body);
          setMenuCommentId(null);
        }}
        onCancelEdit={() => {
          setEditingCommentId(null);
          setEditDraft("");
        }}
        onEditDraftChange={setEditDraft}
        onSaveEdit={() => void saveEdit(comment.id)}
        onDelete={() => void removeComment(comment.id)}
        onLike={() => void handleLike(comment)}
        onReply={() => {
          setReplyingTo(comment);
          setMenuCommentId(null);
          inputRef.current?.focus();
        }}
        renderReply={
          isReply
            ? undefined
            : (reply) => renderCommentRow(reply, true)
        }
      />
    );
  };

  if (!open || !post) return null;

  const ui = (
    <>
      <button
        type="button"
        aria-label="Close comments"
        className="fixed inset-0 z-[998] bg-neutral-950/40 animate-[ghm-backdrop-in_0.2s_ease-out] motion-reduce:animate-none"
        onClick={submitting || commentBusyId ? undefined : onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed z-[999] flex min-h-0 flex-col overflow-hidden bg-white text-neutral-900",
          "inset-x-0 bottom-0 max-h-[min(88dvh,720px)] rounded-t-[1.75rem] border border-b-0 border-neutral-200/80",
          "pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.14)]",
          "max-sm:motion-safe:animate-[ghm-sheet-from-bottom_0.32s_cubic-bezier(0.22,1,0.36,1)_both] max-sm:motion-reduce:animate-none",
          "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-2rem)] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2",
          "sm:max-h-[min(85vh,640px)] sm:rounded-3xl sm:border sm:pb-0",
          "sm:shadow-[0_8px_40px_rgba(0,0,0,0.14)]",
        )}
      >
        <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-neutral-300" />
        </div>

        <header className="relative shrink-0 border-b border-neutral-100 px-4 pb-3 pt-1 sm:px-5 sm:pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={Boolean(submitting || commentBusyId)}
            className="absolute right-3 top-1 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>

          <h2 id={titleId} className="pr-12 text-center text-base font-bold text-neutral-900">
            Comments
          </h2>
          <p className="mt-0.5 truncate px-8 text-center text-xs text-neutral-500">{post.title}</p>

          <div ref={sortMenuRef} className="relative mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => setSortMenuOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-800"
              aria-expanded={sortMenuOpen}
            >
              {sort === "relevant" ? "Most relevant" : "Newest"}
              <ChevronDown className="h-4 w-4" aria-hidden />
            </button>
            {sortMenuOpen ? (
              <div className="absolute top-full z-20 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-neutral-200/90 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSort("relevant");
                    setSortMenuOpen(false);
                  }}
                  className={cn(
                    "block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50",
                    sort === "relevant" && "font-semibold text-neutral-900",
                  )}
                >
                  Most relevant
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSort("newest");
                    setSortMenuOpen(false);
                  }}
                  className={cn(
                    "block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50",
                    sort === "newest" && "font-semibold text-neutral-900",
                  )}
                >
                  Newest
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 [scrollbar-width:thin]">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-neutral-500">Loading comments…</p>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-red-600">Could not load comments.</p>
          ) : sortedComments.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">No comments yet. Be the first.</p>
          ) : (
            <ul className="pb-2">{sortedComments.map((comment) => renderCommentRow(comment))}</ul>
          )}
        </div>

        <footer className="shrink-0 border-t border-neutral-100 bg-white px-4 py-3 sm:rounded-b-3xl sm:px-5 sm:pb-4">
          {replyingTo ? (
            <div className="mb-2 flex items-center justify-between gap-2 text-xs text-neutral-600">
              <span>
                Replying to <span className="font-semibold text-neutral-800">{replyingTo.author}</span>
              </span>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="font-semibold text-[#FF5722]"
              >
                Cancel
              </button>
            </div>
          ) : null}
          {!isSignedIn ? (
            <p className="text-center text-sm text-neutral-600">
              <Link
                href={loginHref}
                className="font-semibold underline underline-offset-2"
                style={{ color: ACCENT }}
              >
                Sign in
              </Link>{" "}
              to comment
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex items-center gap-2.5">
              <UserAvatar initial={commentAsName.slice(0, 1)} className="h-9 w-9" />
              <div className="relative min-w-0 flex-1">
                <label htmlFor="community-comments-input" className="sr-only">
                  {inputPlaceholder}
                </label>
                <input
                  id="community-comments-input"
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={inputPlaceholder}
                  disabled={submitting}
                  className="h-10 w-full rounded-full border-0 bg-neutral-100 py-0 pl-4 pr-12 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:ring-2 focus:ring-[#FF5722]/25 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || submitting}
                  aria-label="Send comment"
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Send className="h-4 w-4" aria-hidden strokeWidth={2.25} />
                </button>
              </div>
            </form>
          )}
          {error ? (
            <p className="mt-2 text-center text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </footer>
      </aside>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(ui, document.body);
}
