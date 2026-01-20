import NewProfileDialog from "@/components/dialogs/new-profile-dialog";
import { getUserProfile } from "@/lib/supabase/profile";
import { Suspense } from "react";

export default async function ProfilePage() {
  return (
    <div className="grid gap-2">
      <div>Welcome to you profile</div>
      <Suspense>
        <CheckProfile />
      </Suspense>
    </div>
  );
}

async function CheckProfile() {
  const profile = await getUserProfile();
  console.log("PROFILE EXISTS", !!profile);
  return <NewProfileDialog profileExists={!!profile} />;
}
