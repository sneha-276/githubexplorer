import { all, fork } from 'redux-saga/effects';
import { userSaga } from '../features/user/userSagas.js';
import { reposSaga } from '../features/repos/reposSagas.js';
import { trendingSaga } from '../features/trending/trendingSagas.js';
import { analyticsSaga } from '../features/analytics/analyticsSagas.js';
import { searchSaga } from '../features/search/searchSagas.js';

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(reposSaga),
    fork(trendingSaga),
    fork(analyticsSaga),
    fork(searchSaga)
  ]);
}
