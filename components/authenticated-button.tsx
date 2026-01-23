"use client";
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
import { Menu } from "lucide-react";
import { LogoutButton } from "./logout-button";
import Link from "next/link";
import { useEffect } from "react";
import { JwtPayload } from "@supabase/supabase-js";
import { useAppDispatch } from "@/lib/hooks";
import {
  fetchProfile,
  selectProfile,
} from "@/lib/user-profile/user-profile-slice";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

export default function AuthenticatedButton({ user }: { user: JwtPayload }) {
  const dispatch = useAppDispatch();
  const profile = useSelector(selectProfile);
  useEffect(() => {
    dispatch(fetchProfile());
  }, [user]);
  return (
    <>
      <div className="hidden sm:flex items-center gap-4">
        {profile && <div>Hello, {profile.username}!</div>}
        <Link href="/profile" className={buttonVariants({ variant: "link" })}>
          My Profile
        </Link>
        <LogoutButton />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="sm:hidden" size="icon" variant="outline">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {profile ? profile.username : "My Account"}
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/profile">My Profile</Link>
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
  );
}
