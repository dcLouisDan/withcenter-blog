import { APP_NAME, APP_TAGLINE, fontLogo } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <div className={cn(fontLogo.className, "text-4xl lg:text-7xl")}>
          {APP_NAME}
        </div>
      </div>
      <p className="text-2xl lg:text-3xl !leading-tight mx-auto max-w-xl text-center">
        {APP_TAGLINE}
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
