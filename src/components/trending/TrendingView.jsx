import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import DateFilter from './DateFilter';
import RepoCard from '../repos/RepoCard';
import { ReposSkeleton } from '../common/Loader';
import { RefreshIcon } from '../common/Icons';
import {
  fetchTrendingRequest,
  loadMoreTrending
} from '../../features/trending/trendingSlice';
import { getTrendingStartDate } from '../../utils/dateUtils';
import { formatNumber } from '../../utils/formatters';

const TrendingView = () => {
  const dispatch = useDispatch();
  const {
    repositories,
    selectedPeriod,
    currentPage,
    totalCount,
    hasMore,
    loading,
    loadingMore,
    error
  } = useSelector((state) => state.trending);

  const observerTarget = useRef(null);

  // Automatically fetch trending repositories on mount if empty
  useEffect(() => {
    if (repositories.length === 0 && !loading && !error) {
      dispatch(fetchTrendingRequest({ period: selectedPeriod, page: 1 }));
    }
  }, [dispatch, repositories.length, loading, error, selectedPeriod]);

  // Infinite scroll intersection observer setup
  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          dispatch(loadMoreTrending());
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [dispatch, hasMore, loading, loadingMore]);

  const handleRetry = () => {
    dispatch(fetchTrendingRequest({ period: selectedPeriod, page: currentPage || 1 }));
  };

  const startDate = getTrendingStartDate(selectedPeriod);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Heading & Subtitle */}
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
          Trending GitHub Repositories
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover the most-starred repositories created recently.
        </Typography>
      </Box>

      {/* Date Filter & Results Meta */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
          p: 2,
          borderRadius: 2.5,
          border: 1,
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#161b22' : '#ffffff'
        }}
      >
        <DateFilter />

        {totalCount > 0 && !loading && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 3 } }}>
            Created on or after <strong>{startDate}</strong> •{' '}
            <strong>{formatNumber(totalCount)}</strong> total found
          </Typography>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Initial Loading Skeleton */}
      {loading && repositories.length === 0 && <ReposSkeleton />}

      {/* Repositories Grid */}
      {repositories.length > 0 && (
        <>
          <Grid container spacing={2.5}>
            {repositories.map((repo) => (
              <Grid item xs={12} sm={6} md={4} key={repo.id}>
                <RepoCard repo={repo} showOwner={true} />
              </Grid>
            ))}
          </Grid>

          {/* Infinite Scroll Trigger & Bottom Loading Indicator */}
          <Box
            ref={observerTarget}
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 80
            }}
          >
            {loadingMore && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={24} color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Loading more popular repositories...
                </Typography>
              </Box>
            )}

            {!hasMore && repositories.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                You've reached the end of trending repositories for this period.
              </Typography>
            )}
          </Box>
        </>
      )}

      {/* Empty State */}
      {!loading && repositories.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No trending repositories found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Try selecting another time range or check your internet connection.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRetry}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TrendingView;

