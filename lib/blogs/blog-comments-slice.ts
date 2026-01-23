import { createAppSlice } from "@/lib/createAppSlice";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { BlogComment, BlogCommentsFetchParams } from "../types/blog-comment";
import { fetchPaginatedBlogComments } from "../supabase/blog-comments";
import { SortDirection } from "../types/blog";
import {
  PER_PAGE_DEFAULT,
  SORT_DEFAULT,
  SORT_DIRECTION_DEFAULT,
} from "../constants";

export interface BlogCommentsSliceState {
  blogcomments: BlogComment[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  sort: string;
  sort_direction: SortDirection;
}

const initialState: BlogCommentsSliceState = {
  blogcomments: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: PER_PAGE_DEFAULT,
  sort: SORT_DEFAULT,
  sort_direction: SORT_DIRECTION_DEFAULT,
};

export const blogcommentsSlice = createAppSlice({
  name: "blogcomments",
  initialState,
  reducers: (create) => ({
    setLoading: create.reducer((state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }),
    setError: create.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),
    setPage: create.reducer((state, action: PayloadAction<number>) => {
      state.page = action.payload;
    }),
    setLimit: create.reducer((state, action: PayloadAction<number>) => {
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
    fetchBlogComments: create.asyncThunk(
      async (params: BlogCommentsFetchParams) => {
        return await fetchPaginatedBlogComments(params);
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.blogcomments = action.payload.comments;
          state.total = action.payload.total;
        },
        rejected: (state, action) => {
          state.isLoading = false;
          if (action.error.message) {
            state.error = action.error.message;
          } else {
            state.error = "Error fetching blogcomments.";
          }
        },
      },
    ),
  }),
  selectors: {
    selectBlogComments: (state) => state.blogcomments,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectTotal: (state) => state.total,
    selectPage: (state) => state.page,
    selectLimit: (state) => state.limit,
    selectSort: (state) => state.sort,
    selectSortDirection: (state) => state.sort_direction,
  },
});

export const {
  fetchBlogComments,
  setError,
  setLoading,
  setSort,
  setSortDirection,
} = blogcommentsSlice.actions;

export const {
  selectBlogComments,
  selectIsLoading,
  selectError,
  selectTotal,
  selectSort,
  selectSortDirection,
  selectPage,
  selectLimit,
} = blogcommentsSlice.selectors;

export const selectPagination = createSelector(
  [selectPage, selectLimit, selectSort, selectSortDirection],
  (page, limit, sort, sort_direction) => {
    return {
      page,
      limit,
      sort,
      sort_direction,
    };
  },
);
