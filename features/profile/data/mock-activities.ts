export type UserPost = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type UserComment = {
  id: string;
  postTitle: string;
  body: string;
  createdAt: string;
};

/** Demo user activity — wire to Supabase later. */
export const MOCK_USER_POSTS: UserPost[] = [];

export const MOCK_USER_COMMENTS: UserComment[] = [];
