import BlogsList from "@/components/blogs-list";
import { PaginationBar } from "@/components/pagination-bar";
import { Separator } from "@/components/ui/separator";

export default function BlogsPage() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">View All Blogs</h2>
      <Separator />
      <PaginationBar />
      <BlogsList />
    </div>
  );
}
