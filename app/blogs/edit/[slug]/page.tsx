import { createClient } from "@/lib/supabase/server";
import { createClientPublic } from "@/lib/supabase/public-server";
import { Suspense } from "react";
import BlogForm from "@/components/blog-form";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

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

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Link
          href="/profile"
          className={buttonVariants({
            variant: "link",
            className: "px-0 text-foreground/50 mr-auto",
          })}
        >
          <ChevronLeft />
          Back to profile
        </Link>
        <h1>Edit Blog</h1>
      </div>
      <Separator />
      <Suspense fallback={<BlogContentSkeleton />}>
        <BlogFormComponent params={params} />
      </Suspense>
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

async function BlogFormComponent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("blogs")
    .select(
      `id, slug, title, body, created_at, published_at, author_id, author:author_id!inner (
      username, first_name, last_name)`,
    )
    .match({ slug })
    .single();

  if (!data) return null;

  if (error || !authData) {
    redirect("/auth/login");
  }

  if (authData.user.id !== data.author_id) {
    redirect("/blogs");
  }

  return (
    <div>
      <BlogForm
        action="update"
        initialBody={data.body}
        initialTitle={data.title}
        slugOrig={slug}
      />
    </div>
  );
}
