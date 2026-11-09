import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  repositories: [],
  selectedPeriod: '1month', // '1week', '2weeks', '1month'
  currentPage: 1,
  totalCount: 0,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null
};

const trendingSlice = createSlice({
  name: 'trending',
  initialState,
  reducers: {
    // Triggered when loading page 1 (or resetting period)
    fetchTrendingRequest: (state, action) => {
      const page = action.payload?.page || 1;
      if (page === 1) {
        state.loading = true;
        state.error = null;
      } else {
        state.loadingMore = true;
      }
    },
    // Triggered by saga on API success
    fetchTrendingSuccess: (state, action) => {
      const { items = [], totalCount = 0, page = 1 } = action.payload;
      state.loading = false;
      state.loadingMore = false;
      state.error = null;
      state.currentPage = page;
      state.totalCount = totalCount;

      if (page === 1) {
        state.repositories = items;
      } else {
        // Deduplicate incoming items by repo id
        const existingIds = new Set(state.repositories.map((r) => r.id));
        const newUniqueItems = items.filter((r) => !existingIds.has(r.id));
        state.repositories = [...state.repositories, ...newUniqueItems];
      }

      // GitHub Search API has a hard cap of 1,000 results accessible via pagination
      // and stop if items returned is less than requested per_page or reached totalCount
      const maxAccessible = Math.min(totalCount, 1000);
      const currentLoadedCount = page === 1 ? items.length : state.repositories.length;
      state.hasMore = currentLoadedCount < maxAccessible && items.length > 0;
    },
    // Triggered on API failure
    fetchTrendingFailure: (state, action) => {
      state.loading = false;
      state.loadingMore = false;
      state.error = action.payload;
      // Note: Preserve state.repositories if subsequent page failed
      if (state.currentPage === 1 && state.repositories.length === 0) {
        state.repositories = [];
      }
    },
    // Change period filter: Last 1 Week, Last 2 Weeks, Last 1 Month
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
    // Action dispatched by infinite scroll observer
    loadMoreTrending: (state) => {
      // Handled by saga
    },
    // Reset trending state
    resetTrending: (state) => {
      state.repositories = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.loading = false;
      state.loadingMore = false;
      state.error = null;
    }
  }
});

export const {
  fetchTrendingRequest,
  fetchTrendingSuccess,
  fetchTrendingFailure,
  setSelectedPeriod,
  loadMoreTrending,
  resetTrending
} = trendingSlice.actions;

export default trendingSlice.reducer;

