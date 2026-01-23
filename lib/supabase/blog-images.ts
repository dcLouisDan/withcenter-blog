import { BLOG_IMAGES_BUCKET } from "../constants";
import { createClient } from "./client";

export async function uploadBlogImage(file: File) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user ? user.id : "unknown";
  const name = file.name;
  const nameArr = name.split(".");
  const ext = nameArr[nameArr.length - 1];
  const givenName = nameArr.slice(0, -1).join(".");
  const timestamp = Math.floor(Date.now() / 1000);

  const filePath = `${userId}/${givenName}_${timestamp}.${ext}`;
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

  return { publicUrl: data.publicUrl, filePath };
}

export async function deleteBlogImage(filePath: string) {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .remove([filePath]);

  if (error) throw error;
}
