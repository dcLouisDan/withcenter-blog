import { createClient } from "@/lib/supabase/client";
import { Blog } from "@/lib/types/blog";

export default async function useBlogPost(slug: string) {
  const supabase = createClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select(
      `id, slug, title, body, created_at, published_at, author:author_id!inner (id,
      username, first_name, last_name)`,
    )
    .match({ slug })
    .single()
    .overrideTypes<Blog, { merge: false }>();

  return { blog };
}
