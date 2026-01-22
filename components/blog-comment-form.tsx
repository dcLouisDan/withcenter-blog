"use client";
import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import React, { useRef, useState } from "react";
import { postComment } from "@/lib/supabase/blog-comments";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Input } from "./ui/input";

export default function BlogCommentForm({
  user_id,
  blog_id,
}: {
  user_id?: string;
  blog_id: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user_id) return;
    setIsLoading(true);
    try {
      await postComment(user_id, blog_id, content, image);

      toast.success("Comment Posted!");
      setContent("");
      setImage(undefined);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  if (!user_id) return null;
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Textarea
          placeholder="Write a comment..."
          className="h-28"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            placeholder="Select Image"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                setImage(files[0]);
              }
            }}
          />
          <Button
            size="sm"
            type="submit"
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? <Spinner /> : <MessageSquare />}
            Post
          </Button>
        </div>
      </div>
    </form>
  );
}
