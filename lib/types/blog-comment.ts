export interface BlogComment {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
}

export interface BlogCommentInsert {
  blog_id: string;
  user_id: string;
  content: string;
  image_url?: string;
}
