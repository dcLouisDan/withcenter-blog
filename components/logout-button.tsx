"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, ButtonVariantTypes } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton({
  buttonVariants,
  className,
}: {
  buttonVariants?: ButtonVariantTypes;
  className?: string;
}) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button {...buttonVariants} className={className} onClick={logout}>
      Logout
    </Button>
  );
}
