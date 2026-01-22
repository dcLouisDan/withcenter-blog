import AppLogo from "@/components/app-logo";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <AppLogo className="text-3xl" />
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
