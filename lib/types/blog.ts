import { UserProfile } from "./user";

export type SortDirection = "asc" | "desc";
export interface Blog {
  id: string;
  title: string;
  slug: string;
  body: Record<string, any>;
  author: UserProfile;
  created_at: string;
  updated_at?: string;
  archived_at?: string;
  published_at?: string;
}

export interface BlogForm {
  title: string;
  slug: string;
  body: Record<string, any>;
}

export interface BlogsFetchResponse {
  blogs: Blog[];
  error: string | null;
  total: number;
}

export interface BlogsFetchParams {
  page?: number;
  limit?: number;
  sort?: string;
  sort_direction?: SortDirection;
  author_id?: string;
  published?: boolean;
  unpublished?: boolean;
  archived?: boolean;
}

export interface BlogsFetchAPIParams {
  page: number;
  limit: number;
  sort: string;
  sort_direction: SortDirection;
  author_id?: string;
  published: boolean;
  unpublished: boolean;
  archived: boolean;
}
