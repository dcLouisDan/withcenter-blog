"use client";
import {
  fetchBlogComments,
  selectBlogComments,
  selectError,
  selectIsLoading,
  selectPagination,
  selectTotal,
} from "@/lib/blogs/blog-comments-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { BlogCommentsFetchParams } from "@/lib/types/blog-comment";
import { useCallback } from "react";

export default function useBlogCommentsList(
  blog_id?: string,
  user_id?: string,
) {
  const dispatch = useAppDispatch();
  const comments = useAppSelector(selectBlogComments);
  const error = useAppSelector(selectError);
  const total = useAppSelector(selectTotal);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);

  const { page, limit, sort, sort_direction } = pagination;

  const refreshData = useCallback(() => {
    dispatch(
      fetchBlogComments({
        blog_id,
        user_id,
        page,
        limit,
        sort,
        sort_direction,
      }),
    );
  }, [page, limit, sort, sort_direction]);

  return {
    isLoading,
    comments,
    error,
    total,
    refreshData,
    page,
    limit,
    sort,
    sort_direction,
  };
}
