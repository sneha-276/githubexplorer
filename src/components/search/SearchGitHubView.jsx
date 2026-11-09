import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  InputBase,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import {
  SearchIcon,
  ClearIcon,
  FolderIcon,
  PeopleIcon
} from '../common/Icons';
import SearchBar from './SearchBar';
import RecentSearches from './RecentSearches';
import UserProfileCard from '../profile/UserProfileCard';
import UserStatsGrid from '../profile/UserStatsGrid';
import RepoList from '../repos/RepoList';
import RepoCard from '../repos/RepoCard';
import { ProfileSkeleton, ReposSkeleton } from '../common/Loader';
import EmptyState from '../common/EmptyState';
import ErrorAlert from '../common/ErrorAlert';
import { fetchUserRequest } from '../../features/user/userSlice';
import {
  searchRequest,
  setSearchType,
  clearSearch
} from '../../features/search/searchSlice';
import { formatNumber } from '../../utils/formatters';

const SearchGitHubView = () => {
  const dispatch = useDispatch();

  // Search mode: 'users' vs 'repositories'
  const searchType = useSelector((state) => state.search.searchType);
  const { repoResults, totalCount, loading: repoSearchLoading, error: repoSearchError } = useSelector(
    (state) => state.search
  );

  const {
    user,
    loading: userLoading,
    error: userError,
    currentUsername
  } = useSelector((state) => state.user);

  const [repoQuery, setRepoQuery] = useState('');

  const handleModeChange = (event, newMode) => {
    dispatch(setSearchType(newMode));
  };

  const handleRepoSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = repoQuery.trim();
    if (trimmed) {
      dispatch(searchRequest({ query: trimmed, searchType: 'repositories' }));
    }
  };

  const handleClearRepoQuery = () => {
    setRepoQuery('');
    dispatch(clearSearch());
  };

  const handleRetryUser = () => {
    if (currentUsername) {
      dispatch(fetchUserRequest(currentUsername));
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Title & Mode Tabs */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={800}
          gutterBottom
          sx={{
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #58a6ff 20%, #bc8cff 80%)'
                : 'linear-gradient(45deg, #0969da 20%, #8250df 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}
        >
          Search GitHub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore GitHub users, user repositories or search all repositories globally.
        </Typography>

        {/* Sub-mode selector */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2.5 }}>
          <Tabs
            value={searchType}
            onChange={handleModeChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none'
              }
            }}
          >
            <Tab
              value="users"
              icon={<PeopleIcon fontSize="small" />}
              iconPosition="start"
              label="User Profile & Repositories"
            />
            <Tab
              value="repositories"
              icon={<FolderIcon fontSize="small" />}
              iconPosition="start"
              label="Search All Repositories"
            />
          </Tabs>
        </Box>
      </Box>

      {/* MODE 1: USER PROFILE & REPOSITORIES */}
      {searchType === 'users' && (
        <Box>
          <SearchBar />
          <RecentSearches />

          <ErrorAlert message={userError} onRetry={handleRetryUser} />

          {userLoading && <ProfileSkeleton />}

          {!userLoading && user && (
            <Box sx={{ mt: 3 }}>
              <UserProfileCard user={user} />
              <UserStatsGrid user={user} />

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  Repositories ({user.public_repos || 0})
                </Typography>
                <RepoList />
              </Box>
            </Box>
          )}

          {!userLoading && !user && !userError && (
            <EmptyState type="initial" />
          )}
        </Box>
      )}

      {/* MODE 2: GLOBAL REPOSITORIES SEARCH */}
      {searchType === 'repositories' && (
        <Box>
          {/* Global Repository Search Input */}
          <Box sx={{ width: '100%', maxWidth: 720, mx: 'auto', mb: 3 }}>
            <Paper
              component="form"
              onSubmit={handleRepoSearchSubmit}
              elevation={0}
              sx={{
                p: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 3,
                border: 2,
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.12)',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
                transition: 'all 0.2s ease-in-out',
                '&:focus-within': {
                  borderColor: 'primary.main',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 0 0 3px rgba(47, 129, 247, 0.3)'
                      : '0 0 0 3px rgba(9, 105, 218, 0.2)'
                }
              }}
            >
              <IconButton sx={{ p: '10px', color: 'primary.main' }} onClick={handleRepoSearchSubmit}>
                <SearchIcon />
              </IconButton>

              <InputBase
                sx={{
                  ml: 1,
                  flex: 1,
                  fontSize: '1.05rem',
                  fontFamily: 'Inter, sans-serif'
                }}
                placeholder="Search repositories by name, topic or description (e.g. react, machine learning, vite)..."
                value={repoQuery}
                onChange={(e) => setRepoQuery(e.target.value)}
                disabled={repoSearchLoading}
                autoFocus
              />

              {repoQuery && !repoSearchLoading && (
                <Tooltip title="Clear input">
                  <IconButton size="small" onClick={handleClearRepoQuery} sx={{ mr: 0.5 }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <IconButton
                type="submit"
                color="primary"
                sx={{
                  p: '8px 16px',
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground'
                  }
                }}
                disabled={repoSearchLoading || !repoQuery.trim()}
              >
                {repoSearchLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  <SearchIcon fontSize="small" />
                )}
              </IconButton>
            </Paper>
          </Box>

          {/* Repo Search Error */}
          {repoSearchError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {repoSearchError}
            </Alert>
          )}

          {/* Search Loading Skeleton */}
          {repoSearchLoading && <ReposSkeleton />}

          {/* Search Results Summary */}
          {!repoSearchLoading && repoResults.length > 0 && (
            <Box sx={{ mb: 2.5, px: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Found <strong>{formatNumber(totalCount)}</strong> matching repositories
              </Typography>
            </Box>
          )}

          {/* Results Grid */}
          {!repoSearchLoading && repoResults.length > 0 && (
            <Grid container spacing={2.5}>
              {repoResults.map((repo) => (
                <Grid item xs={12} sm={6} md={4} key={repo.id}>
                  <RepoCard repo={repo} showOwner={true} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Initial Search Helper State */}
          {!repoSearchLoading && repoResults.length === 0 && !repoSearchError && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <FolderIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Search Any GitHub Repository
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                Enter keywords, repository names or topics in the search bar above to explore repositories globally.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchGitHubView;

