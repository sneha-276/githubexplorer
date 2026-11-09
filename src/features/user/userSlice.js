import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  currentUsername: '',
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action dispatched to trigger saga
    fetchUserRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentUsername = action.payload;
    },
    // Saga dispatches this on API success
    fetchUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    // Saga dispatches this on API error
    fetchUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    },
    // Reset user state
    clearUser: (state) => {
      state.user = null;
      state.currentUsername = '';
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  clearUser
} = userSlice.actions;

export default userSlice.reducer;

