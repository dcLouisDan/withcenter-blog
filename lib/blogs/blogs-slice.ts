import { createAppSlice } from "@/lib/createAppSlice";
import { type PayloadAction } from "@reduxjs/toolkit";
import { Blog, BlogsFetchParams } from "../types/blog";
import { fetchPaginatedBlogs } from "../supabase/blogs";

export interface BlogsSliceState {
  blogs: Blog[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: BlogsSliceState = {
  blogs: [],
  isLoading: false,
  error: null,
  total: 0,
};

export const blogsSlice = createAppSlice({
  name: "blogs",
  initialState,
  reducers: (create) => ({
    setLoading: create.reducer((state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }),

    setError: create.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),
    fetchBlogs: create.asyncThunk(
      async (params: BlogsFetchParams) => {
        return await fetchPaginatedBlogs(params);
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.blogs = action.payload.blogs;
          state.total = action.payload.total;
        },
        rejected: (state, action) => {
          state.isLoading = false;
          if (action.error.message) {
            state.error = action.error.message;
          } else {
            state.error = "Error fetching blogs.";
          }
        },
      },
    ),
  }),
  selectors: {
    selectBlogs: (state) => state.blogs,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectTotal: (state) => state.total,
  },
});

export const { fetchBlogs, setError, setLoading } = blogsSlice.actions;

export const { selectBlogs, selectIsLoading, selectError, selectTotal } =
  blogsSlice.selectors;
