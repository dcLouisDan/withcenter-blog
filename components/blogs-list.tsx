"use client";
import {
  fetchBlogs,
  selectBlogs,
  selectError,
  selectIsLoading,
  selectPagination,
} from "@/lib/blogs/blogs-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useEffect } from "react";
import { Spinner } from "./ui/spinner";

export default function BlogsList() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsLoading);
  const blogs = useAppSelector(selectBlogs);
  const error = useAppSelector(selectError);
  const pagination = useAppSelector(selectPagination);
  // console.log(blogs);

  useEffect(() => {
    console.log("Fetching");
    const { page, limit, sort, sort_direction } = pagination;
    dispatch(
      fetchBlogs({
        page,
        limit,
        sort,
        sort_direction,
        published: true,
      }),
    );
  }, [
    pagination.page,
    pagination.limit,
    pagination.total,
    pagination.sort,
    pagination.sort_direction,
  ]);

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-red p-4">{error}</p>}
      {loading && (
        <div className="flex items-center justify-center gap-4">
          <Spinner /> <div>Loading...</div>
        </div>
      )}
      {!loading &&
        blogs.map((blog) => (
          <Link
            href={"/blogs/" + blog.slug}
            key={blog.slug}
            className="border w-full p-2 rounded-md"
          >
            {blog.title}
          </Link>
        ))}
    </div>
  );
}
