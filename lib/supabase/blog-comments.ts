import { BlogCommentInsert } from "../types/blog-comment";
import { deleteBlogImage, uploadBlogImage } from "./blog-images";
import { createClient } from "./client";

export async function postComment(
  user_id: string,
  blog_id: string,
  content: string,
  file?: File,
) {
  let imagePath: string | undefined = undefined;
  const supabase = createClient();

  const data: BlogCommentInsert = {
    blog_id,
    user_id,
    content,
  };

  try {
    if (file) {
      const { publicUrl, filePath } = await uploadBlogImage(file);
      imagePath = filePath;
      data["image_url"] = publicUrl;
    }
    const { error } = await supabase
      .from("blog_comments")
      .insert([data])
      .select();

    if (error) throw error;
  } catch (error: unknown) {
    if (imagePath) {
      await deleteBlogImage(imagePath);
    }
    throw error;
  }
}
