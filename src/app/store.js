import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer.js';
import rootSaga from './rootSaga.js';
import { setRateLimitListener } from '../api/client.js';
import { updateRateLimit } from '../features/ui/uiSlice.js';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

// Run root saga
sagaMiddleware.run(rootSaga);

// Connect API client rate limit header events to Redux store
setRateLimitListener((rateLimitInfo) => {
  store.dispatch(updateRateLimit(rateLimitInfo));
});

export default store;
