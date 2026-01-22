import BlogsList from "@/components/blogs-list";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default function BlogsPage() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">View All Blogs</h2>
      <Separator />
      <Suspense>
        <BlogsList />
      </Suspense>
    </div>
  );
}
