import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import {
  Blog,
  BlogsFetchParams,
  BlogsFetchResponse,
  SortDirection,
} from "../types/blog";
import { fetchPaginatedBlogs } from "../supabase/blogs";

export interface BlogsSliceState {
  blogs: Blog[];
  page: number;
  limit: number;
  sort: string;
  sort_direction: SortDirection;
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: BlogsSliceState = {
  blogs: [],
  page: 1,
  limit: 10,
  sort: "created_at",
  sort_direction: "desc",
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
    setPage: create.reducer((state, action: PayloadAction<number>) => {
      state.page = action.payload;
    }),
    setLimt: create.reducer((state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    }),
    setSort: create.reducer((state, action: PayloadAction<string>) => {
      state.sort = action.payload;
    }),
    setSortDirection: create.reducer(
      (state, action: PayloadAction<SortDirection>) => {
        state.sort_direction = action.payload;
      },
    ),
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
    selectPage: (state) => state.page,
    selectLimit: (state) => state.limit,
    selectSort: (state) => state.sort,
    selectSortDirection: (state) => state.sort_direction,
    selectTotal: (state) => state.total,
  },
});

export const {
  fetchBlogs,
  setError,
  setPage,
  setLimt,
  setLoading,
  setSort,
  setSortDirection,
} = blogsSlice.actions;

export const {
  selectBlogs,
  selectIsLoading,
  selectError,
  selectPage,
  selectLimit,
  selectSort,
  selectSortDirection,
  selectTotal,
} = blogsSlice.selectors;

export const selectPagination = createSelector(
  [selectPage, selectLimit, selectTotal, selectSort, selectSortDirection],
  (page, limit, total, sort, sort_direction) => {
    return {
      page,
      limit,
      total,
      sort,
      sort_direction,
    };
  },
);
