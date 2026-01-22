import useBlogPost from "@/hooks/use-blog-post";
import BlogCommentForm from "./blog-comment-form";
import { Separator } from "./ui/separator";

export default async function BlogComments({ slug }: { slug: string }) {
  const { blog } = await useBlogPost(slug);
  if (!blog) return null;
  return (
    <div className="w-full rounded-lg bg-secondary/50 p-4 border flex flex-col gap-2">
      <p>Comments</p>
      <BlogCommentForm user_id={blog.author.id} blog_id={blog.id} />
      <Separator />
    </div>
  );
}
