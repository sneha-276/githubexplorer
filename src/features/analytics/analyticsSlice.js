import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRepo: null,
  sourceView: 'trending', // 'trending', 'search', 'profile', 'dashboard'
  codeFrequency: [],
  commitActivity: [],
  contributors: [],
  selectedMetric: 'commits', // 'commits', 'additions', 'deletions'
  hiddenContributors: {}, // { [login]: boolean }
  loading: false,
  isCalculating: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    fetchRepoAnalyticsRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.isCalculating = false;
      state.selectedRepo = action.payload.repo;
      state.sourceView = action.payload.sourceView || 'trending';
      // Reset data for new repo
      state.codeFrequency = [];
      state.commitActivity = [];
      state.contributors = [];
      state.hiddenContributors = {};
    },
    fetchRepoAnalyticsSuccess: (state, action) => {
      state.loading = false;
      state.isCalculating = false;
      state.error = null;
      state.codeFrequency = action.payload.codeFrequency || [];
      state.commitActivity = action.payload.commitActivity || [];
      state.contributors = action.payload.contributors || [];
    },
    fetchRepoAnalyticsFailure: (state, action) => {
      state.loading = false;
      state.isCalculating = false;
      state.error = action.payload;
    },
    setCalculatingState: (state, action) => {
      state.isCalculating = action.payload;
    },
    setSelectedMetric: (state, action) => {
      state.selectedMetric = action.payload; // 'commits', 'additions', 'deletions'
    },
    toggleContributorVisibility: (state, action) => {
      const login = action.payload;
      state.hiddenContributors[login] = !state.hiddenContributors[login];
    },
    showAllContributors: (state) => {
      state.hiddenContributors = {};
    },
    clearRepoAnalytics: (state) => {
      state.selectedRepo = null;
      state.codeFrequency = [];
      state.commitActivity = [];
      state.contributors = [];
      state.hiddenContributors = {};
      state.loading = false;
      state.isCalculating = false;
      state.error = null;
    }
  }
});

export const {
  fetchRepoAnalyticsRequest,
  fetchRepoAnalyticsSuccess,
  fetchRepoAnalyticsFailure,
  setCalculatingState,
  setSelectedMetric,
  toggleContributorVisibility,
  showAllContributors,
  clearRepoAnalytics
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

