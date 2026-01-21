import NewProfileDialog from "@/components/dialogs/new-profile-dialog";
import ProfileBlogsList from "@/components/profile/profile-blogs-list";
import { buttonVariants } from "@/components/ui/button";
import { getUserProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function ProfilePage() {
  return (
    <div className="grid gap-2">
      <div>Welcome to you profile</div>
      <Suspense>
        <CheckProfile />
      </Suspense>
      <div>
        <Link
          href="/profile/blog-create"
          className={buttonVariants({
            variant: "default",
          })}
        >
          <Plus /> Compose Blog
        </Link>
      </div>
      <div>
        <Suspense>
          <BlogList />
        </Suspense>
      </div>
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
