"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { snakeCaseToTitleCase } from "@/lib/string-utils";
import { UserDataForm } from "@/lib/types/user";

export default function UserDetailsForm({
  onSubmitSuccess,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  onSubmitSuccess?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UserDataForm>({
    username: "",
    first_name: "",
    last_name: "",
  });

  const setDataValue = (key: keyof UserDataForm, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("profiles").insert(data);
      if (error) throw error;
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSignUp}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            {Object.keys(data).map((key) => (
              <div className="grid gap-2" key={key}>
                <Label htmlFor={key}>{snakeCaseToTitleCase(key)}</Label>
                <Input
                  id={key}
                  type="text"
                  required
                  value={data[key as keyof UserDataForm]}
                  onChange={(e) =>
                    setDataValue(key as keyof UserDataForm, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating Account..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
