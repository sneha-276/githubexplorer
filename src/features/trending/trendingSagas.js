import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  fetchTrendingRequest,
  fetchTrendingSuccess,
  fetchTrendingFailure,
  setSelectedPeriod,
  loadMoreTrending
} from './trendingSlice.js';
import { githubService } from '../../api/githubService.js';
import { getTrendingStartDate } from '../../utils/dateUtils.js';

// Selectors
const getTrendingState = (state) => state.trending;

/**
 * Worker saga for fetching trending repositories
 */
export function* handleFetchTrending(action) {
  const trendingState = yield select(getTrendingState);
  const period = action.payload?.period || trendingState.selectedPeriod || '1month';
  const page = action.payload?.page || 1;
  const perPage = action.payload?.per_page || 30;

  try {
    const createdDate = getTrendingStartDate(period);
    const data = yield call(githubService.searchTrendingRepos, {
      createdDate,
      page,
      per_page: perPage
    });

    yield put(
      fetchTrendingSuccess({
        items: data.items || [],
        totalCount: data.total_count || 0,
        page
      })
    );
  } catch (error) {
    const message = error.message || 'Failed to fetch trending repositories.';
    yield put(fetchTrendingFailure(message));
  }
}

/**
 * Worker saga triggered when user changes date filter
 */
export function* handlePeriodChange(action) {
  const period = action.payload;
  yield put(fetchTrendingRequest({ period, page: 1 }));
}

/**
 * Worker saga for infinite scroll loading next page
 */
export function* handleLoadMoreTrending() {
  const { currentPage, hasMore, loading, loadingMore, selectedPeriod } = yield select(getTrendingState);

  // Guard against duplicate / premature calls
  if (loading || loadingMore || !hasMore) {
    return;
  }

  const nextPage = currentPage + 1;
  yield put(fetchTrendingRequest({ period: selectedPeriod, page: nextPage }));
}

/**
 * Root saga for trending repositories
 */
export function* trendingSaga() {
  yield takeLatest(fetchTrendingRequest.type, handleFetchTrending);
  yield takeLatest(setSelectedPeriod.type, handlePeriodChange);
  yield takeLatest(loadMoreTrending.type, handleLoadMoreTrending);
}

export default trendingSaga;

