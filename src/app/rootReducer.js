import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice.js';
import reposReducer from '../features/repos/reposSlice.js';
import uiReducer from '../features/ui/uiSlice.js';
import trendingReducer from '../features/trending/trendingSlice.js';
import analyticsReducer from '../features/analytics/analyticsSlice.js';
import searchReducer from '../features/search/searchSlice.js';

const rootReducer = combineReducers({
  user: userReducer,
  repos: reposReducer,
  ui: uiReducer,
  trending: trendingReducer,
  analytics: analyticsReducer,
  search: searchReducer
});

export default rootReducer;
