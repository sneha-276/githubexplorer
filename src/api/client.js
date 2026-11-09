import axios from 'axios';
import { storage } from '../utils/storage.js';

const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json'
  },
  timeout: 15000
});

// Listener callback for rate limit updates (can be wired to Redux)
let onRateLimitUpdate = null;

export const setRateLimitListener = (listener) => {
  onRateLimitUpdate = listener;
};

// Request interceptor to attach token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to track rate limits and standardize errors
apiClient.interceptors.response.use(
  (response) => {
    // Inspect rate-limit headers
    const remaining = response.headers['x-ratelimit-remaining'];
    const limit = response.headers['x-ratelimit-limit'];
    const reset = response.headers['x-ratelimit-reset'];

    if (remaining !== undefined && limit !== undefined && onRateLimitUpdate) {
      onRateLimitUpdate({
        remaining: parseInt(remaining, 10),
        limit: parseInt(limit, 10),
        reset: reset ? new Date(parseInt(reset, 10) * 1000) : null
      });
    }

    return response;
  },
  (error) => {
    // Extract rate-limit headers even on error responses (like 403)
    if (error.response?.headers) {
      const remaining = error.response.headers['x-ratelimit-remaining'];
      const limit = error.response.headers['x-ratelimit-limit'];
      const reset = error.response.headers['x-ratelimit-reset'];

      if (remaining !== undefined && limit !== undefined && onRateLimitUpdate) {
        onRateLimitUpdate({
          remaining: parseInt(remaining, 10),
          limit: parseInt(limit, 10),
          reset: reset ? new Date(parseInt(reset, 10) * 1000) : null
        });
      }
    }

    // Format human-friendly error messages
    let friendlyMessage = 'An unexpected error occurred while contacting GitHub.';

    if (!error.response) {
      friendlyMessage = 'Network error: Please check your internet connection.';
    } else if (error.response.status === 404) {
      friendlyMessage = 'User or repository not found. Please verify the username and try again.';
    } else if (error.response.status === 403) {
      const resetHeader = error.response.headers['x-ratelimit-reset'];
      const resetTime = resetHeader
        ? new Date(parseInt(resetHeader, 10) * 1000).toLocaleTimeString()
        : 'soon';
      friendlyMessage = `GitHub API rate limit exceeded. Limit resets around ${resetTime}. You can add a GitHub Personal Access Token in the top-right settings to get 5,000 requests/hr.`;
    } else if (error.response.status === 401) {
      friendlyMessage = 'Unauthorized: The provided GitHub Personal Access Token is invalid or expired.';
    } else if (error.response.data?.message) {
      friendlyMessage = error.response.data.message;
    }

    const enhancedError = new Error(friendlyMessage);
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
