"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Blog } from "@/lib/types/blog";
import dayjs from "dayjs";
import { DATE_FORMAT_TEMPLATE } from "@/lib/constants";
import { Button, buttonVariants } from "../ui/button";
import { Archive, ArchiveRestore, Book, Edit } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ConfirmationDialog } from "../dialogs/confirmation-dialog";
import { toast } from "sonner";
import useProfileBlogList from "@/hooks/use-profile-blog-list";
import { archiveBlog, publishBlog, unarchiveBlog } from "@/lib/supabase/blogs";

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
  } = useProfileBlogList(auth_id);

  useEffect(() => {
    console.log("Fetching");
    refreshData();
  }, [auth_id, page, limit, sort, sort_direction]);

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
          <ProfileBlogItem auth_id={auth_id} key={blog.id} blog={blog} />
        ))}
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
    <div className="w-full border flex items-center gap-2 rounded-lg p-2 px-4">
      <div className="flex flex-col gap-1 flex-1">
        <Link href={"/blogs/" + blog.slug} key={blog.slug} className="">
          {blog.title}
        </Link>
        <p className="text-xs text-muted-foreground">
          Created at: {dayjs(blog.created_at).format(DATE_FORMAT_TEMPLATE)}
        </p>
        <Separator />
        <div className="flex items-center gap-2">{statusBadge}</div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col w-40 h-full gap-2">
        {!blog.published_at && !blog.archived_at ? (
          <PublishBlogDialog auth_id={auth_id} blog={blog} />
        ) : !blog.archived_at ? (
          <ArchiveBlogDialog auth_id={auth_id} blog={blog} />
        ) : (
          <UnarchiveBlogDialog auth_id={auth_id} blog={blog} />
        )}
        <Link
          href={"/blogs/edit/" + blog.slug}
          className={buttonVariants({
            className: "w-full",
            size: "sm",
            variant: "secondary",
          })}
        >
          <Edit /> Edit
        </Link>
      </div>
    </div>
  );
}

function PublishBlogDialog({ blog, auth_id }: { blog: Blog; auth_id: string }) {
  const { refreshData } = useProfileBlogList(auth_id);
  const [isLoading, setIsLoading] = useState(false);
  const handlePublish = async () => {
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
        <Button size="sm" disabled={isLoading}>
          {isLoading ? <Spinner /> : <Book />} Publish
        </Button>
      }
      onSubmit={handlePublish}
    />
  );
}

function ArchiveBlogDialog({ blog, auth_id }: { blog: Blog; auth_id: string }) {
  const { refreshData } = useProfileBlogList(auth_id);
  const [isLoading, setIsLoading] = useState(false);
  const handlePublish = async () => {
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
        <Button size="sm" disabled={isLoading} variant="outline">
          {isLoading ? <Spinner /> : <Archive />} Archive
        </Button>
      }
      onSubmit={handlePublish}
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
  const { refreshData } = useProfileBlogList(auth_id);
  const [isLoading, setIsLoading] = useState(false);
  const handlePublish = async () => {
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
        <Button size="sm" disabled={isLoading} variant="secondary">
          {isLoading ? <Spinner /> : <ArchiveRestore />} Unarchive
        </Button>
      }
      onSubmit={handlePublish}
    />
  );
}
