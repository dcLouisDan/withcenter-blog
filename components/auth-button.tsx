import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { getUserProfile } from "@/lib/supabase/profile";
import { Menu } from "lucide-react";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();
  const profile = await getUserProfile();

  const user = data?.claims;

  return user ? (
    <>
      <div className="hidden sm:flex items-center gap-4">
        <div>
          Hey,{" "}
          <Link
            href="/profile"
            className="font-bold hover:underline underline-offset-4"
          >
            {profile ? profile.username : user.email}!
          </Link>
        </div>
        <Link href="/profile" className={buttonVariants({ variant: "link" })}>
          Profile
        </Link>
        <LogoutButton />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton
                buttonVariants={{
                  size: "sm",
                  variant: "outline",
                }}
                className="w-full px-1 h-8"
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
