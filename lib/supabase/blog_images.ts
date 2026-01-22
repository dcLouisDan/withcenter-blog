import { BLOG_IMAGES_BUCKET } from "../constants";
import { createClient } from "./client";

export async function uploadBlogImage(file: File) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user ? user.id : "unknown";
  const name = file.name;

  const filePath = `${userId}/${name}`;
  const { error } = await supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = await supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
