import { Suspense } from "react";
import BlogsList from "./blogs-list";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function RecentPosts() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl">Recent Posts</h2>
        <Link href="/blogs" className={buttonVariants({ variant: "link" })}>
          View All
        </Link>
      </div>
      <Suspense>
        <BlogsList preview customParams={{ limit: 2 }} />
      </Suspense>
    </div>
  );
}
