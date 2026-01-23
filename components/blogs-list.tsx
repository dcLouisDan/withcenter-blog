"use client";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Blog, BlogsFetchParams } from "@/lib/types/blog";
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";

import { truncateString } from "@/lib/string-utils";
import dayjs from "@/lib/dayjs";
import {
  DATE_FORMAT_TEMPLATE,
  TIPTAP_STATIC_RENDERER_EXTENSTIONS,
} from "@/lib/constants";
import useBlogList from "@/hooks/use-blog-list";
import { buttonVariants } from "./ui/button";
import { BookOpenText } from "lucide-react";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { PaginationBar } from "./pagination-bar";

export default function BlogsList({
  customParams,
  preview = false,
}: {
  customParams?: BlogsFetchParams;
  preview?: boolean;
}) {
  const {
    refreshData,
    loading,
    blogs,
    error,
    page,
    limit,
    sort,
    sort_direction,
    total,
  } = useBlogList(undefined, customParams);

  useEffect(() => {
    refreshData();
  }, [page, limit, sort, sort_direction]);

  return (
    <>
      {!preview && <PaginationBar size={limit} total={total} page={page} />}
      <div className="flex flex-col gap-2">
        {error && <p className="text-red p-4">{error}</p>}
        {loading ? (
          <BlogListSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 gap-2">
            {blogs.map((blog) => (
              <BlogListItem blog={blog} key={blog.slug} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function BlogListSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Skeleton className="w-full h-72" />
      <Skeleton className="w-full h-72" />
      <Skeleton className="w-full h-72" />
      <Skeleton className="w-full h-72" />
    </div>
  );
}

const BODY_PREVIEW_LIMIT = 250;
const TITLE_PREVIEW_LIMIT = 80;

function BlogListItem({ blog }: { blog: Blog }) {
  const blogBody = useMemo(() => {
    const html = renderToHTMLString({
      extensions: TIPTAP_STATIC_RENDERER_EXTENSTIONS,
      content: blog.body,
    });

    return truncateString(html, BODY_PREVIEW_LIMIT);
  }, [blog.body]);
  const displayTitle = useMemo(
    () => truncateString(blog.title, TITLE_PREVIEW_LIMIT),
    [blog.title],
  );
  return (
    <div className="w-full border hover:bg-secondary/10 p-4 rounded-md h-72 flex flex-col justify-between gap-2">
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
      <Separator />
      <div
        className="text-muted-foreground text-sm overflow-hidden md:h-[140px]"
        dangerouslySetInnerHTML={{ __html: blogBody }}
      />
      <Link
        href={`/blogs/${blog.slug}`}
        className={buttonVariants({ variant: "outline" })}
      >
        <BookOpenText />
        Read full blog
      </Link>
    </div>
  );
}
