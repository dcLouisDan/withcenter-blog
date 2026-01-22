import AppLogo from "./app-logo";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function AppHeader() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-6xl flex gap-4 justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <AppLogo />
        </div>
        <div className="flex items-center gap-1 border-r flex-1 justify-end">
          <Link href="/blogs" className={buttonVariants({ variant: "link" })}>
            Blog List
          </Link>
        </div>
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense fallback={<AuthButtonLoading />}>
            <AuthButton />
          </Suspense>
        )}
      </div>
    </nav>
  );
}

function AuthButtonLoading() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-9 w-24" />
    </div>
  );
}
