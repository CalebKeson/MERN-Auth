import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signUpStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signUpSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.currentUser = action.payload;
    },
    signUpFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.currentUser = action.payload;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signUpStart,
  signUpSuccess,
  signUpFailure,
  loginStart,
  loginSuccess,
  loginFailure,
} = userSlice.actions;
export default userSlice.reducer;
