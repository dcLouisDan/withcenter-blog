import { UserProfile } from "./user";

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
