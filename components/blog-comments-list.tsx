"use client";

import useBlogCommentsList from "@/hooks/user-blog-comments";
import BlogCommentItem from "./blog-comment-item";
import { useEffect } from "react";

export default function BlogCommentsList({
  blog_id,
  user_id,
}: {
  blog_id?: string;
  user_id?: string;
}) {
  const { comments, page, limit, sort, sort_direction, refreshData } =
    useBlogCommentsList(blog_id, user_id);

  useEffect(() => {
    refreshData();
  }, [page, limit, sort, sort_direction]);
  return (
    <div>
      <div>
        {comments.map((item) => (
          <BlogCommentItem comment={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
