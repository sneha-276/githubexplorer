import { createSlice } from '@reduxjs/toolkit';

const initialFilters = {
  search: '',
  language: 'all',
  type: 'all', // 'all', 'forks', 'sources'
  sort: 'stars', // 'stars', 'forks', 'updated', 'size', 'name'
  order: 'desc'
};

const initialState = {
  repos: [],
  loading: false,
  error: null,
  selectedRepo: null,
  repoDetails: {
    languages: {},
    commits: [],
    loading: false,
    error: null
  },
  filters: initialFilters,
  pagination: {
    page: 1,
    perPage: 6
  }
};

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    fetchReposRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchReposSuccess: (state, action) => {
      state.loading = false;
      state.repos = action.payload;
      state.error = null;
      state.pagination.page = 1; // reset to first page on new repo load
    },
    fetchReposFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.repos = [];
    },
    fetchRepoDetailsRequest: (state) => {
      state.repoDetails.loading = true;
      state.repoDetails.error = null;
    },
    fetchRepoDetailsSuccess: (state, action) => {
      state.repoDetails.loading = false;
      state.repoDetails.languages = action.payload.languages;
      state.repoDetails.commits = action.payload.commits;
      state.repoDetails.error = null;
    },
    fetchRepoDetailsFailure: (state, action) => {
      state.repoDetails.loading = false;
      state.repoDetails.error = action.payload;
    },
    setSelectedRepo: (state, action) => {
      state.selectedRepo = action.payload;
      // Reset details when new repo is selected
      state.repoDetails = {
        languages: {},
        commits: [],
        loading: false,
        error: null
      };
    },
    clearSelectedRepo: (state) => {
      state.selectedRepo = null;
      state.repoDetails = {
        languages: {},
        commits: [],
        loading: false,
        error: null
      };
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // reset page when filter changes
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearRepos: (state) => {
      state.repos = [];
      state.loading = false;
      state.error = null;
      state.selectedRepo = null;
      state.filters = initialFilters;
      state.pagination.page = 1;
    }
  }
});

export const {
  fetchReposRequest,
  fetchReposSuccess,
  fetchReposFailure,
  fetchRepoDetailsRequest,
  fetchRepoDetailsSuccess,
  fetchRepoDetailsFailure,
  setSelectedRepo,
  clearSelectedRepo,
  setFilter,
  resetFilters,
  setPage,
  clearRepos
} = reposSlice.actions;

export default reposSlice.reducer;

