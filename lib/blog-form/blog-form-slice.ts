import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BlogFormSliceState {
  title: string;
  body: Record<string, any>;
}

const initialState: BlogFormSliceState = {
  title: "My First Blog",
  body: {
    "type": "doc",
    "content": [],
  },
};

export const blogFormSlice = createSlice({
  name: "blogForm",
  initialState,
  reducers: (create) => ({
    setTitle: create.reducer((state, action: PayloadAction<string>) => {
      state.title = action.payload;
    }),
    setBody: create.reducer(
      (state, action: PayloadAction<Record<string, any>>) => {
        state.body = action.payload;
      },
    ),
  }),
  selectors: {
    selectTitle: (blogForm) => blogForm.title,
    selectBody: (blogForm) => blogForm.body,
  },
});

export const { setTitle, setBody } = blogFormSlice.actions;

export const { selectTitle, selectBody } = blogFormSlice.selectors;
