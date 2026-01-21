"use client";
import {
  fetchBlogs,
  selectBlogs,
  selectError,
  selectIsLoading,
  selectPagination,
} from "@/lib/blogs/blogs-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback } from "react";
export default function useProfileBlogList(auth_id: string) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsLoading);
  const blogs = useAppSelector(selectBlogs);
  const error = useAppSelector(selectError);
  const pagination = useAppSelector(selectPagination);
  const { page, limit, sort, sort_direction } = pagination;

  const refreshData = useCallback(() => {
    dispatch(
      fetchBlogs({
        author_id: auth_id,
        page,
        limit,
        sort,
        sort_direction,
      }),
    );
  }, [
    auth_id,
    pagination.page,
    pagination.limit,
    pagination.total,
    pagination.sort,
    pagination.sort_direction,
  ]);

  return {
    refreshData,
    loading,
    blogs,
    error,
    page,
    limit,
    sort,
    sort_direction,
  };
}
