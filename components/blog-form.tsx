"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { SimpleEditor } from "./tiptap-templates/simple/simple-editor";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectBody,
  selectTitle,
  setTitle,
} from "@/lib/blog-form/blog-form-slice";
import { titleToSlug } from "@/lib/string-utils";
import { type BlogForm } from "@/lib/types/blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BlogForm({
  initialBody,
  initialTitle,
  slugOrig,
  action = "create",
}: {
  action?: "create" | "update";
  slugOrig?: string;
  initialTitle?: string;
  initialBody: Record<string, any>;
}) {
  const dispatch = useAppDispatch();
  const title = useAppSelector(selectTitle);
  const body = useAppSelector(selectBody);
  const slug = useMemo(() => titleToSlug(title), [title]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const blogData: BlogForm = {
      title,
      body,
      slug,
    };
    const supabase = createClient();
    try {
      if (action == "create") {
        const { error } = await supabase
          .from("blogs")
          .insert([blogData])
          .select();
        if (error) throw error;
        toast.success("Blog Saved");
        router.push(`/blogs/${slug}`);
      } else if (action == "update") {
        if (!slugOrig) throw new Error("The original slug was not provided.");

        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("slug", slugOrig);
        if (error) throw error;
        toast.success("Blog Updated");
        router.push(`/blogs/${slug}`);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (action == "update" && !!initialTitle) dispatch(setTitle(initialTitle));
  }, [initialTitle, action]);
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
          />
          <p className="text-muted-foreground text-sm italic">Slug: {slug}</p>
        </div>
        <div className="grid gap-4">
          <Label>Content</Label>
          <Suspense>
            <SimpleEditor content={initialBody} editable />
          </Suspense>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end gap-4">
          <Button type="submit" className="" disabled={isLoading}>
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                <Spinner /> Saving blog post...
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <Save /> Save Changes
              </div>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
