"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Blog } from "@/lib/types/blog";
import dayjs from "dayjs";
import {
  DATE_FORMAT_TEMPLATE,
  TIPTAP_STATIC_RENDERER_EXTENSTIONS,
} from "@/lib/constants";
import { Button, buttonVariants } from "../ui/button";
import {
  Archive,
  ArchiveRestore,
  Book,
  BookOpenText,
  Edit,
  PenBox,
  Trash2,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ConfirmationDialog } from "../dialogs/confirmation-dialog";
import { toast } from "sonner";
import useBlogList from "@/hooks/use-blog-list";
import {
  archiveBlog,
  deleteBlog,
  publishBlog,
  unarchiveBlog,
} from "@/lib/supabase/blogs";
import { PaginationBar } from "../pagination-bar";
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";
import StarterKit from "@tiptap/starter-kit";
import { truncateString } from "@/lib/string-utils";
import { Skeleton } from "../ui/skeleton";

export default function ProfileBlogsList({ auth_id }: { auth_id: string }) {
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
  } = useBlogList(auth_id, {
    archived: true,
    published: true,
    unpublished: true,
  });

  useEffect(() => {
    console.log("Fetching");
    refreshData();
  }, [auth_id, page, limit, sort, sort_direction]);

  return (
    <div>
      {error && <p className="text-red p-4">{error}</p>}
      {loading ? (
        <BlogListSkeleton />
      ) : blogs.length > 0 ? (
        <div className="flex flex-col gap-2">
          <PaginationBar total={total} size={limit} page={page} />
          <div className="flex flex-col gap-2">
            {blogs.map((blog) => (
              <ProfileBlogItem auth_id={auth_id} key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      ) : (
        <div className="border h-96 p-10 flex justify-center items-center flex-col gap-4 w-full bg-secondary rounded-lg">
          <BookOpenText className="stroke-muted-foreground size-32" />
          <h1 className="text-center text-muted-foreground">
            You haven't posted anything yet.
          </h1>
          <Link
            href="/profile/blog-create"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
            })}
          >
            <PenBox /> Write you first post
          </Link>
        </div>
      )}
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-20" />
    </div>
  );
}

function ProfileBlogItem({ blog, auth_id }: { blog: Blog; auth_id: string }) {
  const statusBadge =
    !!blog.published_at && !blog.archived_at ? (
      <Badge>Published</Badge>
    ) : !!blog.archived_at ? (
      <Badge variant="destructive">Archived</Badge>
    ) : (
      <Badge variant="outline">Draft</Badge>
    );
  console.log(`${blog.title} - Archived : ${blog.archived_at}`);
  return (
    <div className="w-full border flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-lg p-2">
      <div className="flex flex-col gap-1 flex-1 w-full">
        <Link
          href={"/blogs/" + blog.slug}
          key={blog.slug}
          className="hover:underline underline-offset-4"
        >
          {blog.title}
        </Link>
        <p className="text-xs text-muted-foreground">
          Created at: {dayjs(blog.created_at).format(DATE_FORMAT_TEMPLATE)}
        </p>
        <Separator />
        <div className="flex items-center gap-2">{statusBadge}</div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-row sm:flex-col w-full sm:w-40 h-full gap-2">
        {!blog.published_at && !blog.archived_at ? (
          <PublishBlogDialog auth_id={auth_id} blog={blog} />
        ) : !blog.archived_at ? (
          <ArchiveBlogDialog auth_id={auth_id} blog={blog} />
        ) : (
          <UnarchiveBlogDialog auth_id={auth_id} blog={blog} />
        )}
        <div className="flex items-center gap-1">
          <Link
            href={"/blogs/edit/" + blog.slug}
            className={buttonVariants({
              className: "w-20",
              size: "sm",
              variant: "secondary",
            })}
          >
            <Edit /> Edit
          </Link>
          <DeleteBlogDialog blog={blog} auth_id={auth_id} />
        </div>
      </div>
    </div>
  );
}

function PublishBlogDialog({ blog, auth_id }: { blog: Blog; auth_id: string }) {
  const { refreshData } = useBlogList(auth_id, {
    archived: true,
    published: true,
    unpublished: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await publishBlog(blog.id);
      if (error) throw error;
      toast.success("Blog Published!");
      refreshData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ConfirmationDialog
      title="Publish Blog"
      description="By pressing continue, your blog will be visible to all of the visitors of this site."
      triggerComponent={
        <Button size="sm" disabled={isLoading} className="w-full">
          {isLoading ? <Spinner /> : <Book />} Publish
        </Button>
      }
      onSubmit={handleSubmit}
    />
  );
}

function ArchiveBlogDialog({ blog, auth_id }: { blog: Blog; auth_id: string }) {
  const { refreshData } = useBlogList(auth_id, {
    archived: true,
    published: true,
    unpublished: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await archiveBlog(blog.id);
      if (error) throw error;
      toast.success("Blog Archived!");
      refreshData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ConfirmationDialog
      title="Archived Blog"
      description="By pressing continue, your blog will no longer be visible to the visitors of this site."
      triggerComponent={
        <Button
          size="sm"
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? <Spinner /> : <Archive />} Archive
        </Button>
      }
      onSubmit={handleSubmit}
    />
  );
}

function UnarchiveBlogDialog({
  blog,
  auth_id,
}: {
  blog: Blog;
  auth_id: string;
}) {
  const { refreshData } = useBlogList(auth_id, {
    archived: true,
    published: true,
    unpublished: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await unarchiveBlog(blog.id);
      if (error) throw error;
      toast.success("Blog Republished!");
      refreshData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ConfirmationDialog
      title="Archived Blog"
      description="By pressing continue, your blog will be published again and visible to the visitors of this site."
      triggerComponent={
        <Button
          size="sm"
          disabled={isLoading}
          variant="secondary"
          className="w-full"
        >
          {isLoading ? <Spinner /> : <ArchiveRestore />} Unarchive
        </Button>
      }
      onSubmit={handleSubmit}
    />
  );
}

function DeleteBlogDialog({ blog, auth_id }: { blog: Blog; auth_id: string }) {
  const { refreshData } = useBlogList(auth_id, {
    archived: true,
    published: true,
    unpublished: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const BODY_PREVIEW_LIMIT = 250;
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await deleteBlog(blog.id);
      if (error) throw error;
      toast.success("Blog Deleted!");
      refreshData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const blogBody = useMemo(() => {
    const html = renderToHTMLString({
      extensions: TIPTAP_STATIC_RENDERER_EXTENSTIONS,
      content: blog.body,
    });

    return truncateString(html, BODY_PREVIEW_LIMIT);
  }, [blog.body]);
  const displayTitle = useMemo(
    () => truncateString(blog.title, 50),
    [blog.title],
  );

  return (
    <ConfirmationDialog
      title="Delete Blog"
      description={
        "By pressing continue, your blog will be deleted permanently. This action cannot be undone."
      }
      triggerComponent={
        <Button size="sm" disabled={isLoading} variant="destructive">
          {isLoading ? <Spinner /> : <Trash2 />} Delete
        </Button>
      }
      submitButtonVariant={{ variant: "destructive" }}
      submitButtonContent="Delete"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col gap-2 border p-2 rounded-md">
        <div className="flex flex-col gap-1">
          <div className=" font-bold">{displayTitle}</div>
        </div>
        <div
          className="text-muted-foreground text-sm"
          dangerouslySetInnerHTML={{ __html: blogBody }}
        />
      </div>
    </ConfirmationDialog>
  );
}
