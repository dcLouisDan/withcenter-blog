import { cache } from "react";
import {
  BlogComment,
  BlogCommentInsert,
  BlogCommentsFetchParams,
  BlogCommentsFetchResponse,
} from "../types/blog-comment";
import { deleteBlogImage, uploadBlogImage } from "./blog-images";
import { createClient } from "./client";

const defaultParams: BlogCommentsFetchParams = {
  page: 1,
  limit: 1,
  sort: "created_at",
  sort_direction: "desc",
  user_id: undefined,
  blog_id: undefined,
};

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

export async function deleteBlogComment(id: string) {
  const supabase = createClient();
  return supabase.from("blog_comments").delete().eq("id", id);
}

export const fetchPaginatedBlogComments = cache(
  async (
    params: BlogCommentsFetchParams,
  ): Promise<BlogCommentsFetchResponse> => {
    const supabase = createClient();
    const query = supabase
      .from("blog_comments")
      .select(
        `id, blog_id, user_id, content, image_url, created_at, user:user_id!inner(id, username, first_name, last_name)`,
        {
          count: "exact",
        },
      );

    const {
      page,
      limit: size,
      sort,
      sort_direction,
      user_id,
      blog_id,
    } = params ?? defaultParams;

    if (blog_id) {
      query.eq("blog_id", blog_id);
    }

    if (user_id) {
      query.eq("user_id", user_id);
    }

    if (sort && sort_direction) {
      query.order(sort, { ascending: sort_direction === "asc" });
    }

    const limit = size ?? 10;
    const from = page ? (page - 1) * limit : 0;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .overrideTypes<Array<BlogComment>, { merge: false }>();

    console.log("COMMENTS DATA", data);

    return {
      comments: data ?? [],
      error: error ? error.message : null,
      total: count ?? 0,
    };
  },
);
