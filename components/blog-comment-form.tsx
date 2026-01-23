"use client";
import { Image, MessageSquare, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import React, { useRef, useState } from "react";
import { postComment } from "@/lib/supabase/blog-comments";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Input } from "./ui/input";
import useBlogCommentsList from "@/hooks/use-blog-comments";
import { useAppSelector } from "@/lib/hooks";
import { selectAuthId } from "@/lib/user-profile/user-profile-slice";
import ImageDisplayWithPreview from "./image-display-with-preview";

export default function BlogCommentForm({ blog_id }: { blog_id: string }) {
  const user_id = useAppSelector(selectAuthId);
  const { refreshData } = useBlogCommentsList(blog_id);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user_id) return;
    setIsLoading(true);
    if (content == "") {
      toast.error("Oops! your comment was blank!");
      setIsLoading(false);
      return;
    }
    try {
      await postComment(user_id, blog_id, content, image);

      toast.success("Comment Posted!");
      setContent("");
      setImage(undefined);
      refreshData();
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
        <div className="flex justify-end items-center gap-2">
          <CommentImageInput image={image} setImage={setImage} />
          <Button
            size="sm"
            type="submit"
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? <Spinner /> : <MessageSquare />}
            Post
          </Button>
        </div>
      </div>
    </form>
  );
}

function CommentImageInput({
  image,
  setImage,
}: {
  image?: File;
  setImage: (file: File | undefined) => void;
}) {
  const [preview, setPreview] = useState<string | undefined>();
  const ref = useRef<HTMLInputElement>(null);
  const onInputClick = () => {
    if (ref.current) {
      ref.current.click();
    }
  };
  return (
    <div>
      {image && preview && (
        <div className="flex items-center border rounded p-1 gap-1 bg-background">
          <ImageDisplayWithPreview
            className="size-12 rounded overflow-hidden"
            src={preview}
          />
          <button
            type="button"
            className="size-6 flex items-center border rounded"
            onClick={() => {
              setImage(undefined);
              setPreview(undefined);
            }}
          >
            <X className="w-full" />
          </button>
        </div>
      )}
      {!image && (
        <Button
          onClick={onInputClick}
          type="button"
          size="sm"
          variant="outline"
        >
          <Image /> Attach Image
        </Button>
      )}
      <Input
        key={image ? image?.name : "input"}
        type="file"
        accept="image/*"
        placeholder="Select Image"
        ref={ref}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setImage(file);

          const reader = new FileReader();
          reader.onload = (event) => {
            setPreview(event.target?.result as string);
          };

          if (file) {
            reader.readAsDataURL(file as Blob);
          }
        }}
      />
    </div>
  );
}
