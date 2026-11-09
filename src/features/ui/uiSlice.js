import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage.js';

const initialTheme = storage.getThemeMode() === 'dark';
const initialSearches = storage.getRecentSearches();
const initialToken = storage.getToken();

const initialState = {
  darkMode: initialTheme,
  recentSearches: initialSearches,
  githubToken: initialToken,
  tokenModalOpen: false,
  activeNav: 'trending', // 'trending', 'search', 'dashboard', 'analytics'
  previousNav: 'trending',
  activeTab: 0, // 0 = Repositories, 1 = Analytics (inside Profile/Dashboard)
  rateLimit: {
    remaining: null,
    limit: null,
    reset: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      storage.setThemeMode(state.darkMode ? 'dark' : 'light');
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      storage.setThemeMode(action.payload ? 'dark' : 'light');
    },
    setActiveNav: (state, action) => {
      if (state.activeNav !== action.payload) {
        state.previousNav = state.activeNav;
        state.activeNav = action.payload;
      }
    },
    returnToPreviousNav: (state) => {
      const target = state.previousNav === 'analytics' ? 'trending' : state.previousNav;
      state.activeNav = target;
    },
    addRecentSearch: (state, action) => {
      const updated = storage.addRecentSearch(action.payload);
      state.recentSearches = updated;
    },
    removeRecentSearch: (state, action) => {
      const updated = storage.removeRecentSearch(action.payload);
      state.recentSearches = updated;
    },
    clearRecentSearches: (state) => {
      storage.clearRecentSearches();
      state.recentSearches = [];
    },
    openTokenModal: (state) => {
      state.tokenModalOpen = true;
    },
    closeTokenModal: (state) => {
      state.tokenModalOpen = false;
    },
    saveToken: (state, action) => {
      state.githubToken = action.payload;
      storage.setToken(action.payload);
    },
    removeToken: (state) => {
      state.githubToken = '';
      storage.setToken('');
    },
    updateRateLimit: (state, action) => {
      state.rateLimit = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    }
  }
});

export const {
  toggleDarkMode,
  setDarkMode,
  setActiveNav,
  returnToPreviousNav,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  openTokenModal,
  closeTokenModal,
  saveToken,
  removeToken,
  updateRateLimit,
  setActiveTab
} = uiSlice.actions;

export default uiSlice.reducer;
