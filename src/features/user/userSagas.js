import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure
} from './userSlice.js';
import {
  fetchReposRequest,
  fetchReposFailure
} from '../repos/reposSlice.js';
import { addRecentSearch } from '../ui/uiSlice.js';
import { githubService } from '../../api/githubService.js';

/**
 * Worker saga for fetching a GitHub user's profile
 */
export function* handleFetchUser(action) {
  const username = action.payload?.trim();
  if (!username) {
    yield put(fetchUserFailure('Please enter a GitHub username.'));
    return;
  }

  try {
    const userData = yield call(githubService.getUserProfile, username);
    yield put(fetchUserSuccess(userData));
    yield put(addRecentSearch(userData.login));

    // Automatically trigger fetching repositories for the found user
    yield put(fetchReposRequest({ username: userData.login }));
  } catch (error) {
    const message = error.message || 'Failed to fetch user profile';
    yield put(fetchUserFailure(message));
    yield put(fetchReposFailure(message));
  }
}

/**
 * Watcher saga for user actions
 */
export function* userSaga() {
  yield takeLatest(fetchUserRequest.type, handleFetchUser);
}
