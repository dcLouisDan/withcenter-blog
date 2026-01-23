"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, ButtonVariantTypes } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/lib/user-profile/user-profile-slice";

export function LogoutButton({
  buttonVariants,
  className,
}: {
  buttonVariants?: ButtonVariantTypes;
  className?: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    dispatch(logoutUser());
    router.push("/auth/login");
  };

  return (
    <Button {...buttonVariants} className={className} onClick={logout}>
      Logout
    </Button>
  );
}
