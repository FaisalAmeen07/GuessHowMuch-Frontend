export type CommunityPostCategory = "FINDS" | "TIPS" | "PRICE_CHECKS";

export type ApiCommunityPost = {
  id: string;
  userId: number;
  title: string;
  category: CommunityPostCategory;
  body: string;
  imageUrl: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  likedByMe?: boolean;
  user?: {
    id: number;
    name: string | null;
    email?: string;
    role?: "ADMIN" | "USER";
  };
};

export type CreateCommunityPostResponse = {
  success: boolean;
  message: string;
  data: ApiCommunityPost;
};

export type UpdateCommunityPostResponse = {
  success: boolean;
  message: string;
  data: ApiCommunityPost;
};

export type GetCommunityPostsResponse = {
  success: boolean;
  data: ApiCommunityPost[];
};

export type ToggleCommunityPostLikeResponse = {
  success: boolean;
  liked: boolean;
};

export type ApiCommunityPostComment = {
  id: string;
  userId: number;
  postId?: string;
  parentCommentId?: string | null;
  body: string;
  likesCount: number;
  likedByMe?: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    email?: string;
    role?: "ADMIN" | "USER";
  };
  replies?: ApiCommunityPostComment[];
};

export type ApiCommunityPostWithComments = {
  id: string;
  title: string;
  comments: ApiCommunityPostComment[];
};

export type GetCommunityPostCommentsResponse = {
  success: boolean;
  data: ApiCommunityPostWithComments;
};

export type CreateCommunityPostCommentResponse = {
  success: boolean;
  message: string;
  data: ApiCommunityPostComment;
};

export type UpdateCommunityPostCommentResponse = {
  success: boolean;
  message: string;
  data: ApiCommunityPostComment;
};

export type DeleteCommunityPostCommentResponse = {
  success: boolean;
  message: string;
  postId: string;
};

export type ToggleCommunityCommentLikeResponse = {
  success: boolean;
  liked: boolean;
  likesCount: number;
};
