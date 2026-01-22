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
import { useEffect, useMemo } from "react";
import { Spinner } from "./ui/spinner";
import { Blog } from "@/lib/types/blog";
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";
import StarterKit from "@tiptap/starter-kit";
import { truncateString } from "@/lib/string-utils";
import dayjs from "dayjs";
import { DATE_FORMAT_TEMPLATE } from "@/lib/constants";

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
      {!loading && (
        <div className="grid grid-cols-2 gap-2">
          {blogs.map((blog) => (
            <BlogListItem blog={blog} key={blog.slug} />
          ))}
        </div>
      )}
    </div>
  );
}

const BODY_PREVIEW_LIMIT = 250;

function BlogListItem({ blog }: { blog: Blog }) {
  const blogBody = useMemo(() => {
    const html = renderToHTMLString({
      extensions: [StarterKit],
      content: blog.body,
    });

    return truncateString(html, BODY_PREVIEW_LIMIT);
  }, [blog.body]);
  const displayTitle = useMemo(
    () => truncateString(blog.title, 50),
    [blog.title],
  );
  return (
    <div className="w-full border hover:bg-secondary/90 p-2 rounded-md h-60 flex flex-col justify-between">
      <div className="flex flex-col gap-1">
        <Link
          href={"/blogs/" + blog.slug}
          className="text-xl font-bold hover:underline underline-offset-4 "
        >
          {displayTitle}
        </Link>
        <p className="text-sm">
          by <span className="font-bold">{blog.author.username}</span> |{" "}
          {blog.published_at && (
            <span>{dayjs(blog.published_at).format(DATE_FORMAT_TEMPLATE)}</span>
          )}
        </p>
      </div>
      <div
        className="text-muted-foreground text-sm h-[135px]"
        dangerouslySetInnerHTML={{ __html: blogBody }}
      />
    </div>
  );
}
