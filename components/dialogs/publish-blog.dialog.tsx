"use client";

import useBlogList from "@/hooks/use-blog-list";
import { publishBlog } from "@/lib/supabase/blogs";
import { Blog } from "@/lib/types/blog";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "./confirmation-dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Book } from "lucide-react";
import { useRouter } from "next/navigation";

export function PublishBlogDialog({
  blog,
  auth_id,
  custom_trigger,
}: {
  blog: Blog;
  auth_id: string;
  custom_trigger?: ReactNode;
}) {
  const { refreshData } = useBlogList(auth_id);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await publishBlog(blog.id);
      if (error) throw error;
      toast.success("Blog Published!");
      refreshData();
      router.refresh();
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
        custom_trigger ?? (
          <Button size="sm" disabled={isLoading} className="w-full">
            {isLoading ? <Spinner /> : <Book />} Publish
          </Button>
        )
      }
      onSubmit={handleSubmit}
    />
  );
}
