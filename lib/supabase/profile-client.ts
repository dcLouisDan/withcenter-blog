import { UserProfile } from "../types/user";
import { createClient } from "./client";

export async function getUserProfileClient(): Promise<null | UserProfile> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  const id = user.id;

  const { data, error: profError } = await supabase
    .from("profiles")
    .select("username, first_name, last_name")
    .eq("id", id)
    .limit(1);

  if (!data || data.length == 0 || profError) {
    return null;
  }
  const profile = data[0] as UserProfile;
  return { ...profile, id };
}
