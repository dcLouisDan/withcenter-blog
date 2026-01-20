import BlogForm from "@/components/blog-form";
import { Separator } from "@/components/ui/separator";
import { INITIAL_TIPTAP_CONTENT } from "@/lib/constants";

export default function BlogCreatePage() {
  return (
    <div className="w-full grid gap-2">
      <h1>Compose Blog</h1>
      <Separator />
      <div>
        <BlogForm initialBody={INITIAL_TIPTAP_CONTENT} />
      </div>
    </div>
  );
}
