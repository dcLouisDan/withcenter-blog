"use client";
import {
  fetchBlogs,
  selectBlogs,
  selectError,
  selectIsLoading,
  selectPagination,
} from "@/lib/blogs/blogs-slice";
import { PER_PAGE_DEFAULT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
export default function useProfileBlogList(auth_id: string) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsLoading);
  const blogs = useAppSelector(selectBlogs);
  const error = useAppSelector(selectError);
  const pagination = useAppSelector(selectPagination);
  const { sort, sort_direction, total } = pagination;
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const limit = searchParams.get("perPage")
    ? Number(searchParams.get("perPage"))
    : PER_PAGE_DEFAULT;

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
  }, [auth_id, page, limit, total, sort, sort_direction]);

  return {
    refreshData,
    loading,
    blogs,
    error,
    page,
    total,
    limit,
    sort,
    sort_direction,
  };
}
