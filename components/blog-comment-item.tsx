"use client";

import { BlogComment } from "@/lib/types/blog-comment";
import dayjs from "@/lib/dayjs";
import ImageDisplayWithPreview from "./image-display-with-preview";
import { useAppSelector } from "@/lib/hooks";
import { selectAuthId } from "@/lib/user-profile/user-profile-slice";
import { ConfirmationDialog } from "./dialogs/confirmation-dialog";
import { X } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { deleteBlogComment } from "@/lib/supabase/blog-comments";
import { useState } from "react";
import useBlogCommentsList from "@/hooks/use-blog-comments";

export default function BlogCommentItem({ comment }: { comment: BlogComment }) {
  const authId = useAppSelector(selectAuthId);
  const isAuthor = authId == comment.user_id;
  return (
    <div className="text-sm flex flex-col gap-1 border-b pb-2 my-2">
      <div className="flex items-center">
        <div className="font-bold flex-1">
          {comment.user ? comment.user.username : "Unknown"}
        </div>
        <div className="text-muted-foreground text-xs">
          {dayjs(comment.created_at).fromNow()}
        </div>
        {isAuthor && <DeleteBlogComment comment={comment} />}
      </div>
      <div>{comment.content}</div>
      {comment.image_url && <ImageDisplayWithPreview src={comment.image_url} />}
    </div>
  );
}

function DeleteBlogComment({ comment }: { comment: BlogComment }) {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshData } = useBlogCommentsList();
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await deleteBlogComment(comment.id);
      if (error) throw error;
      toast.success("Blog Deleted!");
      refreshData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ConfirmationDialog
      title="Delete Comment"
      description={
        "By pressing continue, this comment will be deleted permanently. This action cannot be undone."
      }
      triggerComponent={
        <button disabled={isLoading}>{isLoading ? <Spinner /> : <X />}</button>
      }
      submitButtonVariant={{ variant: "destructive" }}
      submitButtonContent="Delete"
      onSubmit={handleSubmit}
    ></ConfirmationDialog>
  );
}
