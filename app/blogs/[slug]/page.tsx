import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createClient } from "@/lib/supabase/server";
import React, { Suspense } from "react";

export default async function BlogViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <div>BlogViewPage</div>
      <Suspense>
        <BlogContent slug={slug} />
      </Suspense>
    </div>
  );
}

async function BlogContent({ slug }: { slug: string }) {
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
      <h1>{data.title}</h1>
      <div>
        <SimpleEditor content={data.body} editable={false} />
      </div>
    </div>
  );
}
