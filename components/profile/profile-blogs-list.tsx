"use client";
import {
  fetchBlogs,
  selectBlogs,
  selectError,
  selectIsLoading,
  selectPagination,
  selectSort,
} from "@/lib/blogs/blogs-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useEffect } from "react";

export default function ProfileBlogsList({ auth_id }: { auth_id: string }) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsLoading);
  const blogs = useAppSelector(selectBlogs);
  const pagination = useAppSelector(selectPagination);
  const error = useAppSelector(selectError);
  const sortOptions = useAppSelector(selectSort);

  useEffect(() => {
    console.log("Fetching");
    dispatch(
      fetchBlogs({
        author_id: auth_id,
      }),
    );
  }, [pagination.page, pagination.limit, pagination.total]);
  return (
    <div className="flex flex-col gap-2">
      {blogs.map((blog) => (
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
