import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  searchRequest,
  searchReposSuccess,
  searchUsersSuccess,
  searchFailure
} from './searchSlice.js';
import { addRecentSearch } from '../ui/uiSlice.js';
import { githubService } from '../../api/githubService.js';

const getSearchState = (state) => state.search;

export function* handleSearch(action) {
  const searchState = yield select(getSearchState);
  const query = (action.payload?.query ?? searchState.query)?.trim();
  const searchType = action.payload?.searchType || searchState.searchType || 'users';

  if (!query) {
    yield put(searchFailure('Please enter a search term.'));
    return;
  }

  try {
    if (searchType === 'repositories') {
      const data = yield call(githubService.searchRepositories, {
        query,
        page: 1,
        per_page: 30,
        sort: 'stars',
        order: 'desc'
      });
      yield put(
        searchReposSuccess({
          items: data.items || [],
          totalCount: data.total_count || 0
        })
      );
    } else {
      // Search GitHub users
      const data = yield call(githubService.searchUsers, {
        query,
        page: 1,
        per_page: 30
      });
      yield put(
        searchUsersSuccess({
          items: data.items || [],
          totalCount: data.total_count || 0
        })
      );
    }

    yield put(addRecentSearch(query));
  } catch (error) {
    yield put(searchFailure(error.message || 'Search request failed.'));
  }
}

export function* searchSaga() {
  yield takeLatest(searchRequest.type, handleSearch);
}

export default searchSaga;

