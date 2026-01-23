"use client";

import useBlogCommentsList from "@/hooks/user-blog-comments";
import { Badge } from "./ui/badge";

export default function BlogCommentCount() {
  const { total } = useBlogCommentsList();
  if (total == 0) return null;
  return <Badge>{total}</Badge>;
}
