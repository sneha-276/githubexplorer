import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  fetchRepoAnalyticsRequest,
  fetchRepoAnalyticsSuccess,
  fetchRepoAnalyticsFailure
} from './analyticsSlice.js';
import { githubService } from '../../api/githubService.js';

/**
 * Worker saga for fetching weekly repository development activity
 */
export function* handleFetchRepoAnalytics(action) {
  const { repo } = action.payload || {};
  if (!repo) {
    yield put(fetchRepoAnalyticsFailure('No repository specified.'));
    return;
  }

  const owner = repo.owner?.login;
  const repoName = repo.name;

  if (!owner || !repoName) {
    yield put(fetchRepoAnalyticsFailure('Invalid repository owner or name.'));
    return;
  }

  try {
    // Fetch all 3 GitHub statistics endpoints in parallel
    // Catch each individually so partial data can still be visualized if one endpoint is restricted
    const [codeFrequency, commitActivity, contributors] = yield all([
      call(async () => {
        try {
          return await githubService.getRepoCodeFrequency(owner, repoName);
        } catch {
          return [];
        }
      }),
      call(async () => {
        try {
          return await githubService.getRepoCommitActivity(owner, repoName);
        } catch {
          return [];
        }
      }),
      call(async () => {
        try {
          return await githubService.getRepoContributors(owner, repoName);
        } catch {
          return [];
        }
      })
    ]);

    yield put(
      fetchRepoAnalyticsSuccess({
        codeFrequency: Array.isArray(codeFrequency) ? codeFrequency : [],
        commitActivity: Array.isArray(commitActivity) ? commitActivity : [],
        contributors: Array.isArray(contributors) ? contributors : []
      })
    );
  } catch (error) {
    yield put(
      fetchRepoAnalyticsFailure(
        error.message || 'Failed to fetch repository statistics.'
      )
    );
  }
}

/**
 * Root saga for repository activity analytics
 */
export function* analyticsSaga() {
  yield takeLatest(fetchRepoAnalyticsRequest.type, handleFetchRepoAnalytics);
}

export default analyticsSaga;

