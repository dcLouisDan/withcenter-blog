"use server";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createClient } from "@/lib/supabase/server";
import { createClientPublic } from "@/lib/supabase/public-server";
import { Suspense } from "react";
import { Blog } from "@/lib/types/blog";
import dayjs from "dayjs";
import { DATE_FORMAT_TEMPLATE } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Book, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/supabase/profile";
import { PublishBlogDialog } from "@/components/dialogs/publish-blog.dialog";
import BlogComments from "@/components/blog-comments";
import useBlogPost from "@/hooks/use-blog-post";

export async function generateStaticParams() {
  const supabase = await createClientPublic();

  const blogs = await supabase
    .from("blogs")
    .select("slug")
    .then((res) => res.data);

  if (!blogs) return [];

  return blogs.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="flex-1">
        <Suspense fallback={<BlogContentSkeleton />}>
          <BlogContent slug={slug} />
        </Suspense>
      </div>

      <div className="w-full md:w-[350px]">
        <Suspense>
          <BlogComments slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}

function BlogContentSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-6" />
      <Separator />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-64" />
      <Skeleton className="w-full h-32" />
    </div>
  );
}

async function BlogContent({ slug }: { slug: string }) {
  const { blog } = await useBlogPost(slug);

  if (!blog) return null;

  return (
    <div>
      {!blog.published_at && (
        <Suspense>
          <DraftAlert blog={blog} />
        </Suspense>
      )}
      <h2 className="text-2xl sm:text-3xl mb-2">{blog.title}</h2>
      <p className="text-sm">
        by <span className="font-bold">{blog.author.username}</span> |{" "}
        {blog.published_at ? (
          <span>{dayjs(blog.published_at).format(DATE_FORMAT_TEMPLATE)}</span>
        ) : (
          <span>Draft</span>
        )}
      </p>
      <Separator className="my-4" />
      <div>
        <SimpleEditor content={blog.body} editable={false} />
      </div>
    </div>
  );
}

async function DraftAlert({ blog }: { blog: Blog }) {
  const profile = await getUserProfile();
  if (!profile || !profile.id || profile.id !== blog.author.id) return null;
  return (
    <Alert className="flex bg-secondary items-center justify-between [&>svg]:translate-y-0 mb-4">
      <BookText />
      <AlertTitle className="flex-1 text-muted-foreground">
        This post is still a draft. Publish this post to make it visible for all
        readers!
      </AlertTitle>

      {profile.id && (
        <PublishBlogDialog
          custom_trigger={
            <Button variant="default" className="h-7 cursor-pointer rounded-md">
              <Book />
              Publish
            </Button>
          }
          blog={blog}
          auth_id={profile.id}
        />
      )}
    </Alert>
  );
}
