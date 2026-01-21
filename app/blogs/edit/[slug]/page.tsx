import { createClient } from "@/lib/supabase/server";
import { createClientPublic } from "@/lib/supabase/public-server";
import { Suspense } from "react";
import BlogForm from "@/components/blog-form";

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
    <div>
      <div>Edit Blog</div>
      <Suspense>
        <BlogFormComponent params={params} />
      </Suspense>
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
  const { data } = await supabase
    .from("blogs")
    .select(
      `id, slug, title, body, created_at, published_at, author:author_id!inner (
      username, first_name, last_name)`,
    )
    .match({ slug })
    .single();

  if (!data) return null;

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
