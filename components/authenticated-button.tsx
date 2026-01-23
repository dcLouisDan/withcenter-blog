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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProfile } from "@/lib/user-profile/user-profile-slice";

export default function AuthenticatedButton({ user }: { user: JwtPayload }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProfile());
  }, [user]);
  return (
    <>
      <div className="hidden sm:flex items-center gap-4">
        <Link href="/profile" className={buttonVariants({ variant: "link" })}>
          Profile
        </Link>
        <LogoutButton />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="sm:hidden">
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
  );
}
