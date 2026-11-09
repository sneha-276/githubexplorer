import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  searchType: 'users', // 'users' or 'repositories'
  repoResults: [],
  userResults: [],
  totalCount: 0,
  loading: false,
  error: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
      state.error = null;
    },
    searchRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      if (action.payload?.query !== undefined) {
        state.query = action.payload.query;
      }
      if (action.payload?.searchType !== undefined) {
        state.searchType = action.payload.searchType;
      }
    },
    searchReposSuccess: (state, action) => {
      state.loading = false;
      state.repoResults = action.payload.items || [];
      state.totalCount = action.payload.totalCount || 0;
      state.error = null;
    },
    searchUsersSuccess: (state, action) => {
      state.loading = false;
      state.userResults = action.payload.items || [];
      state.totalCount = action.payload.totalCount || 0;
      state.error = null;
    },
    searchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.repoResults = [];
      state.userResults = [];
      state.totalCount = 0;
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  setSearchQuery,
  setSearchType,
  searchRequest,
  searchReposSuccess,
  searchUsersSuccess,
  searchFailure,
  clearSearch
} = searchSlice.actions;

export default searchSlice.reducer;

