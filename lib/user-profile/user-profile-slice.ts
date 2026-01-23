import { UserProfile } from "../types/user";
import { type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../createAppSlice";
import { getUserProfileClient } from "../supabase/profile-client";

export interface UserProfileSliceState {
  auth_id?: string;
  profile?: UserProfile;
}

const initialState: UserProfileSliceState = {
  auth_id: undefined,
  profile: undefined,
};

export const userProfileSlice = createAppSlice({
  name: "userProfile",
  initialState,
  reducers: (create) => ({
    loginUser: create.reducer(
      (state, action: PayloadAction<UserProfile | undefined>) => {
        state.profile = action.payload;
        state.auth_id = action.payload?.id;
      },
    ),
    logoutUser: create.reducer((state) => {
      state = initialState;
    }),
    fetchProfile: create.asyncThunk(
      async () => {
        return await getUserProfileClient();
      },
      {
        fulfilled: (state, action) => {
          state.auth_id = action.payload?.id;
          state.profile = action.payload ?? undefined;
        },
      },
    ),
  }),
  selectors: {
    selectAuthId: (state) => state.auth_id,
    selectProfile: (state) => state.profile,
  },
});

export const { loginUser, logoutUser, fetchProfile } = userProfileSlice.actions;
export const { selectAuthId, selectProfile } = userProfileSlice.selectors;
