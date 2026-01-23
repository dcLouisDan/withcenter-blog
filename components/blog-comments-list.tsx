"use client";

import useBlogCommentsList from "@/hooks/use-blog-comments";
import BlogCommentItem from "./blog-comment-item";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

export default function BlogCommentsList({
  blog_id,
  user_id,
}: {
  blog_id?: string;
  user_id?: string;
}) {
  const {
    comments,
    page,
    limit,
    sort,
    sort_direction,
    refreshData,
    isLoading,
  } = useBlogCommentsList(blog_id, user_id);

  useEffect(() => {
    refreshData();
  }, [page, limit, sort, sort_direction]);

  if (isLoading) {
    return (
      <div className="grid gap-2">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
    );
  }
  if (comments.length == 0) {
    return (
      <div className="text-muted-foreground text-center py-4 text-sm">
        This post has no comments yet.
      </div>
    );
  }
  return (
    <div>
      {comments.map((item) => (
        <BlogCommentItem comment={item} key={item.id} />
      ))}
    </div>
  );
}
