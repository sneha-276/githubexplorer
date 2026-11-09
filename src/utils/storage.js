const STORAGE_KEYS = {
  RECENT_SEARCHES: 'gh_explorer_recent_searches',
  THEME_MODE: 'gh_explorer_theme_mode',
  GITHUB_TOKEN: 'gh_explorer_pat'
};

const MAX_RECENT_SEARCHES = 8;

export const storage = {
  getRecentSearches: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentSearch: (username) => {
    if (!username) return [];
    try {
      const searches = storage.getRecentSearches();
      const filtered = searches.filter(
        (u) => u.toLowerCase() !== username.toLowerCase()
      );
      const updated = [username, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  removeRecentSearch: (username) => {
    try {
      const searches = storage.getRecentSearches();
      const updated = searches.filter(
        (u) => u.toLowerCase() !== username.toLowerCase()
      );
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  clearRecentSearches: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch {
      // ignore
    }
  },

  getThemeMode: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME_MODE) || 'dark';
    } catch {
      return 'dark';
    }
  },

  setThemeMode: (mode) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch {
      // ignore
    }
  },

  getToken: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN) || '';
    } catch {
      return '';
    }
  },

  setToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.GITHUB_TOKEN, token.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.GITHUB_TOKEN);
      }
    } catch {
      // ignore
    }
  }
};

