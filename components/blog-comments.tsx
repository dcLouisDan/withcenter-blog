import useBlogPost from "@/hooks/use-blog-post";
import BlogCommentForm from "./blog-comment-form";
import { Separator } from "./ui/separator";
import useBlogCommentsList from "@/hooks/user-blog-comments";
import BlogCommentItem from "./blog-comment-item";
import { Badge } from "./ui/badge";
import BlogCommentsList from "./blog-comments-list";
import { isAuthenticated } from "@/lib/supabase/profile";
import Link from "next/link";

export default async function BlogComments({ slug }: { slug: string }) {
  const { blog } = await useBlogPost(slug);
  const user = await isAuthenticated();
  if (!blog) return null;
  return (
    <div className="w-full rounded-lg bg-secondary/50 p-4 border flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p>Comments</p>
      </div>
      {user ? (
        <BlogCommentForm user_id={blog.author.id} blog_id={blog.id} />
      ) : (
        <div className="py-4 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="font-bold hover:underline underline-offset-4"
          >
            Login
          </Link>{" "}
          to post a comment
        </div>
      )}
      <Separator />
      <BlogCommentsList blog_id={blog.id} user_id={blog.author.id} />
    </div>
  );
}
