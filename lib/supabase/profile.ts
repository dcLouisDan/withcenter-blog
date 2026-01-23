import { UserProfile } from "../types/user";
import { createClient } from "./server";

export async function getUserProfile(): Promise<null | UserProfile> {
  const supabase = await createClient();
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

export async function isAuthenticated() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user;
}
