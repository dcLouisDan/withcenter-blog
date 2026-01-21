import NewProfileDialog from "@/components/dialogs/new-profile-dialog";
import ProfileBlogsList from "@/components/profile/profile-blogs-list";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUserProfile } from "@/lib/supabase/profile";
import { PenBox } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function ProfilePage() {
  return (
    <div className="grid gap-2">
      <Suspense>
        <CheckProfile />
      </Suspense>
      <div className="flex justify-between items-center gap-4">
        <div className="text-lg">My Posts</div>
        <Link
          href="/profile/blog-create"
          className={buttonVariants({
            variant: "default",
          })}
        >
          <PenBox /> Compose Blog
        </Link>
      </div>
      <Separator />
      <Suspense>
        <BlogList />
      </Suspense>
    </div>
  );
}

async function CheckProfile() {
  const profile = await getUserProfile();
  return <NewProfileDialog profileExists={!!profile} />;
}

async function BlogList() {
  const profile = await getUserProfile();
  if (!profile || !profile.id) return null;
  return <ProfileBlogsList auth_id={profile.id} />;
}
