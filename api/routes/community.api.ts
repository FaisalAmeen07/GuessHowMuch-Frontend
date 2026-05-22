import { ApiError, apiRequest } from "@/api/inspector";
import type {
  CreateCommunityPostCommentResponse,
  CreateCommunityPostResponse,
  GetCommunityPostCommentsResponse,
  GetCommunityPostsResponse,
  ToggleCommunityCommentLikeResponse,
  ToggleCommunityPostLikeResponse,
  UpdateCommunityPostCommentResponse,
  UpdateCommunityPostResponse,
  DeleteCommunityPostCommentResponse,
} from "@/api/types/community";
import { env } from "@/config/env";
import { getBackendAccessToken } from "@/lib/auth/backendAccessToken";

function communityMultipartHeaders(): HeadersInit {
  const headers = new Headers();
  const token = getBackendAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export type CreateCommunityPostPayload = {
  title: string;
  category: string;
  body: string;
  imageFile?: File | null;
};

export type UpdateCommunityPostPayload = {
  title?: string;
  category?: string;
  body?: string;
  imageFile?: File | null;
  clearImage?: boolean;
};

/** Create a community feed post (multipart; auth cookie required). */
export async function createCommunityPost(
  payload: CreateCommunityPostPayload,
): Promise<CreateCommunityPostResponse> {
  const formData = new FormData();
  formData.append("title", payload.title.trim());
  formData.append("category", payload.category);
  formData.append("body", payload.body.trim());
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  const res = await fetch(`${env.apiBaseUrl}/api/community/create`, {
    method: "POST",
    headers: communityMultipartHeaders(),
    body: formData,
    credentials: "include",
  });

  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data as CreateCommunityPostResponse;
}

/** Update a community feed post (multipart; auth cookie required). */
export async function patchCommunityPost(
  postId: string,
  payload: UpdateCommunityPostPayload,
): Promise<UpdateCommunityPostResponse> {
  const formData = new FormData();

  if (payload.title !== undefined) {
    formData.append("title", payload.title.trim());
  }
  if (payload.category !== undefined) {
    formData.append("category", payload.category);
  }
  if (payload.body !== undefined) {
    formData.append("body", payload.body.trim());
  }
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }
  if (payload.clearImage) {
    formData.append("clearImage", "true");
  }

  const res = await fetch(`${env.apiBaseUrl}/api/community/${postId}`, {
    method: "PATCH",
    headers: communityMultipartHeaders(),
    body: formData,
    credentials: "include",
  });

  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data as UpdateCommunityPostResponse;
}

export function getCommunityPosts() {
  return apiRequest<GetCommunityPostsResponse>("/api/community", {
    credentials: "include",
  });
}

export function toggleCommunityPostLike(postId: string) {
  return apiRequest<ToggleCommunityPostLikeResponse>(`/api/community/like/${postId}`, {
    method: "POST",
    credentials: "include",
  });
}

export function getCommunityPostComments(postId: string) {
  return apiRequest<GetCommunityPostCommentsResponse>(`/api/community/comment/${postId}`, {
    credentials: "include",
  });
}

export function createCommunityPostComment(
  postId: string,
  body: string,
  parentCommentId?: string | null,
) {
  return apiRequest<CreateCommunityPostCommentResponse>(`/api/community/comment/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: body.trim(),
      ...(parentCommentId ? { parentCommentId } : {}),
    }),
    credentials: "include",
  });
}

export function toggleCommunityCommentLike(commentId: string) {
  return apiRequest<ToggleCommunityCommentLikeResponse>(
    `/api/community/comments/${commentId}/like`,
    {
      method: "POST",
      credentials: "include",
    },
  );
}

export function patchCommunityPostComment(commentId: string, body: string) {
  return apiRequest<UpdateCommunityPostCommentResponse>(
    `/api/community/comments/${commentId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
      credentials: "include",
    },
  );
}

export function deleteCommunityPostComment(commentId: string) {
  return apiRequest<DeleteCommunityPostCommentResponse>(
    `/api/community/comments/${commentId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
}
