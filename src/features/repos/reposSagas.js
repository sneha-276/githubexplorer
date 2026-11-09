import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  fetchReposRequest,
  fetchReposSuccess,
  fetchReposFailure,
  fetchRepoDetailsRequest,
  fetchRepoDetailsSuccess,
  fetchRepoDetailsFailure
} from './reposSlice.js';
import { githubService } from '../../api/githubService.js';

/**
 * Worker saga for fetching repositories for a given user
 */
export function* handleFetchRepos(action) {
  const { username, sort = 'updated', direction = 'desc' } = action.payload || {};
  if (!username) return;

  try {
    const repos = yield call(githubService.getUserRepos, username, {
      sort,
      direction,
      per_page: 100
    });
    yield put(fetchReposSuccess(repos));
  } catch (error) {
    yield put(fetchReposFailure(error.message || 'Failed to fetch repositories'));
  }
}

/**
 * Worker saga for fetching extended details for a single repository (languages & commits)
 */
export function* handleFetchRepoDetails(action) {
  const { owner, repo } = action.payload || {};
  if (!owner || !repo) return;

  try {
    // Fetch languages and recent commits in parallel
    const [languages, commits] = yield all([
      call(githubService.getRepoLanguages, owner, repo),
      call(githubService.getRepoCommits, owner, repo).catch(() => []) // Commit history might be empty or restricted
    ]);

    yield put(
      fetchRepoDetailsSuccess({
        languages: languages || {},
        commits: Array.isArray(commits) ? commits : []
      })
    );
  } catch (error) {
    yield put(
      fetchRepoDetailsFailure(
        error.message || 'Failed to fetch repository details'
      )
    );
  }
}

/**
 * Watcher saga for repo actions
 */
export function* reposSaga() {
  yield takeLatest(fetchReposRequest.type, handleFetchRepos);
  yield takeLatest(fetchRepoDetailsRequest.type, handleFetchRepoDetails);
}
