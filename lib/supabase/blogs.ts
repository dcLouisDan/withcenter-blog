import { Blog, BlogsFetchAPIParams, BlogsFetchParams } from "./../types/blog";
import { BlogsFetchResponse } from "../types/blog";
import { createClient } from "./client";
import { cache } from "react";

const defaultParams: BlogsFetchAPIParams = {
  page: 1,
  limit: 1,
  sort: "created_at",
  sort_direction: "desc",
  author_id: undefined,
  published: true,
  unpublished: false,
  archived: false,
};

export async function publishBlog(id: string) {
  const supabase = createClient();
  const dateNow = new Date().toISOString();
  return supabase
    .from("blogs")
    .update({
      published_at: dateNow,
      updated_at: dateNow,
    })
    .eq("id", id);
}

export async function archiveBlog(id: string) {
  const supabase = createClient();
  const dateNow = new Date().toISOString();
  return supabase
    .from("blogs")
    .update({
      archived_at: dateNow,
      updated_at: dateNow,
    })
    .eq("id", id);
}

export async function unarchiveBlog(id: string) {
  const supabase = createClient();
  const dateNow = new Date().toISOString();
  return supabase
    .from("blogs")
    .update({
      archived_at: null,
      updated_at: dateNow,
    })
    .eq("id", id);
}

export async function deleteBlog(id: string) {
  const supabase = createClient();
  return supabase.from("blogs").delete().eq("id", id);
}

export const fetchPaginatedBlogs = cache(
  async (params?: BlogsFetchParams): Promise<BlogsFetchResponse> => {
    const supabase = createClient();
    const query = supabase.from("blogs").select(
      `id, slug, title, body, created_at, published_at, archived_at, author:author_id!inner (
      username, first_name, last_name)`,
      { count: "exact" },
    );

    const {
      page,
      limit: size,
      sort,
      sort_direction,
      author_id,
      published,
      unpublished,
      archived,
    } = params ?? defaultParams;

    if (author_id) {
      query.eq("author_id", author_id);
    }

    if (sort && sort_direction) {
      query.order(sort, { ascending: sort_direction === "asc" });
    }

    if (!archived) {
      query.is("archived_at", null);
    }

    if (published) {
      query.not("published_at", "is", null);
    }

    if (unpublished) {
      query.is("published_at", null);
    }

    const limit = size ?? 10;
    const from = page ? (page - 1) * limit : 0;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .overrideTypes<Array<Blog>, { merge: false }>();

    return {
      blogs: data ?? [],
      error: error ? error.message : null,
      total: count ?? 0,
    };
  },
);
