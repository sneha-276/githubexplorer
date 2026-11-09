import apiClient from './client.js';

/**
 * Helper to fetch a GitHub stats endpoint with support for HTTP 202 retry.
 * GitHub statistics endpoints compute metrics asynchronously and return 202 while calculating.
 */
const fetchStatsWithRetry = async (url, maxRetries = 3, delayMs = 1500) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await apiClient.get(url);

    // If HTTP 202 or empty response (GitHub calculating stats)
    const isCalculating =
      response.status === 202 ||
      !response.data ||
      (Array.isArray(response.data) && response.data.length === 0 && attempt < maxRetries) ||
      (typeof response.data === 'object' && !Array.isArray(response.data) && Object.keys(response.data).length === 0);

    if (isCalculating && attempt < maxRetries) {
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    return response.data;
  }
  return [];
};

export const githubService = {
  /**
   * Search trending repositories created since a specific date, sorted by stars desc
   * Endpoint: GET /search/repositories
   * @param {object} params
   * @param {string} params.createdDate - YYYY-MM-DD
   * @param {number} params.page
   * @param {number} params.per_page
   * @returns {Promise<object>} { total_count, items }
   */
  searchTrendingRepos: async ({ createdDate, page = 1, per_page = 30 }) => {
    const response = await apiClient.get('/search/repositories', {
      params: {
        q: `created:>=${createdDate}`,
        sort: 'stars',
        order: 'desc',
        page,
        per_page
      }
    });
    return response.data;
  },

  /**
   * General search for GitHub repositories by query
   * Endpoint: GET /search/repositories
   * @param {object} params
   * @param {string} params.query
   * @param {number} params.page
   * @param {number} params.per_page
   * @param {string} params.sort - 'stars', 'forks', 'updated'
   * @param {string} params.order - 'desc', 'asc'
   * @returns {Promise<object>}
   */
  searchRepositories: async ({ query, page = 1, per_page = 30, sort = 'stars', order = 'desc' }) => {
    const response = await apiClient.get('/search/repositories', {
      params: {
        q: query,
        sort,
        order,
        page,
        per_page
      }
    });
    return response.data;
  },

  /**
   * Search for GitHub users by query
   * Endpoint: GET /search/users
   * @param {object} params
   * @param {string} params.query
   * @param {number} params.page
   * @param {number} params.per_page
   * @returns {Promise<object>}
   */
  searchUsers: async ({ query, page = 1, per_page = 20 }) => {
    const response = await apiClient.get('/search/users', {
      params: {
        q: query,
        page,
        per_page
      }
    });
    return response.data;
  },

  /**
   * Fetch a GitHub user's public profile
   * Endpoint: GET /users/{username}
   * @param {string} username
   * @returns {Promise<object>}
   */
  getUserProfile: async (username) => {
    const response = await apiClient.get(`/users/${encodeURIComponent(username)}`);
    return response.data;
  },

  /**
   * Fetch a user's repositories
   * Endpoint: GET /users/{username}/repos
   * @param {string} username
   * @param {object} params
   * @returns {Promise<Array>}
   */
  getUserRepos: async (username, params = {}) => {
    const defaultParams = {
      per_page: 100,
      sort: 'updated',
      direction: 'desc',
      ...params
    };
    const response = await apiClient.get(
      `/users/${encodeURIComponent(username)}/repos`,
      { params: defaultParams }
    );
    return response.data;
  },

  /**
   * Fetch weekly code frequency (additions and deletions per week)
   * Endpoint: GET /repos/{owner}/{repo}/stats/code_frequency
   * Response: [[week_timestamp, additions, deletions], ...]
   * @param {string} owner
   * @param {string} repo
   * @returns {Promise<Array>}
   */
  getRepoCodeFrequency: async (owner, repo) => {
    return await fetchStatsWithRetry(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/stats/code_frequency`
    );
  },

  /**
   * Fetch weekly commit activity of the repository over the past year
   * Endpoint: GET /repos/{owner}/{repo}/stats/commit_activity
   * Response: [{ days: [...], total: number, week: number }, ...]
   * @param {string} owner
   * @param {string} repo
   * @returns {Promise<Array>}
   */
  getRepoCommitActivity: async (owner, repo) => {
    return await fetchStatsWithRetry(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/stats/commit_activity`
    );
  },

  /**
   * Fetch all contributor commit activity
   * Endpoint: GET /repos/{owner}/{repo}/stats/contributors
   * Response: [{ author: { login, avatar_url }, total, weeks: [{ w, a, d, c }] }, ...]
   * @param {string} owner
   * @param {string} repo
   * @returns {Promise<Array>}
   */
  getRepoContributors: async (owner, repo) => {
    return await fetchStatsWithRetry(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/stats/contributors`
    );
  },

  /**
   * Fetch language breakdown for a specific repository
   * Endpoint: GET /repos/{owner}/{repo}/languages
   * @param {string} owner
   * @param {string} repo
   * @returns {Promise<object>}
   */
  getRepoLanguages: async (owner, repo) => {
    const response = await apiClient.get(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`
    );
    return response.data;
  },

  /**
   * Fetch commit activity / recent commits for a repository
   * Endpoint: GET /repos/{owner}/{repo}/commits
   * @param {string} owner
   * @param {string} repo
   * @returns {Promise<Array>}
   */
  getRepoCommits: async (owner, repo) => {
    const response = await apiClient.get(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`,
      { params: { per_page: 10 } }
    );
    return response.data;
  },

  /**
   * Check current GitHub API rate limit status
   * Endpoint: GET /rate_limit
   * @returns {Promise<object>}
   */
  getRateLimit: async () => {
    const response = await apiClient.get('/rate_limit');
    return response.data;
  }
};

export default githubService;
