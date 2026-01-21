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

export const fetchPaginatedBlogs = cache(
  async (params?: BlogsFetchParams): Promise<BlogsFetchResponse> => {
    const supabase = createClient();
    const query = supabase.from("blogs").select(
      `id, slug, title, body, created_at, published_at, author:author_id!inner (
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

    if (published) {
      query.neq("published_at", null);
    }

    if (unpublished) {
      query.eq("published_at", null);
    }

    if (archived) {
      query.neq("archived_at", null);
    }

    const limit = size ?? 10;
    const from = page ? page * limit : 0;
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
