import { APP_NAME, fontLogo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn(fontLogo.className, className)}>
      {APP_NAME}
    </Link>
  );
}
