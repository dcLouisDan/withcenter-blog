import { SortDirection } from "./blog";
import { UserProfile } from "./user";

export interface BlogComment {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user?: UserProfile;
}

export interface BlogCommentInsert {
  blog_id: string;
  user_id: string;
  content: string;
  image_url?: string;
}

export interface BlogCommentsFetchParams {
  page?: number;
  limit?: number;
  sort?: string;
  sort_direction?: SortDirection;
  user_id?: string;
  blog_id?: string;
}

export interface BlogCommentsFetchResponse {
  comments: BlogComment[];
  error: string | null;
  total: number;
}
