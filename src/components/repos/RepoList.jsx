import React, { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Pagination,
  Stack
} from '@mui/material';
import RepoCard from './RepoCard';
import RepoFilters from './RepoFilters';
import { EmptyState } from '../common/EmptyState';
import { ReposSkeleton } from '../common/Loader';
import { setPage, resetFilters } from '../../features/repos/reposSlice';

const RepoList = () => {
  const dispatch = useDispatch();
  const listTopRef = useRef(null);
  const { repos, loading, filters, pagination } = useSelector(
    (state) => state.repos
  );

  // Filter & Sort repositories in-memory
  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // Search query filter (matches name or description)
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (repo) =>
          repo.name.toLowerCase().includes(q) ||
          (repo.description && repo.description.toLowerCase().includes(q))
      );
    }

    // Language filter
    if (filters.language !== 'all') {
      result = result.filter((repo) => repo.language === filters.language);
    }

    // Type filter
    if (filters.type === 'sources') {
      result = result.filter((repo) => !repo.fork);
    } else if (filters.type === 'forks') {
      result = result.filter((repo) => repo.fork);
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'updated':
          return new Date(b.updated_at) - new Date(a.updated_at);
        case 'size':
          return b.size - a.size;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [repos, filters]);

  // Pagination calculation
  const totalItems = filteredRepos.length;
  const totalPages = Math.ceil(totalItems / pagination.perPage);
  const startIndex = (pagination.page - 1) * pagination.perPage;
  const currentRepos = filteredRepos.slice(
    startIndex,
    startIndex + pagination.perPage
  );

  const handlePageChange = (event, value) => {
    dispatch(setPage(value));
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 2 }}>
        <RepoFilters />
        <ReposSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }} ref={listTopRef}>
      <RepoFilters />

      {/* Results Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
          px: 0.5
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing{' '}
          <strong>
            {totalItems === 0
              ? 0
              : `${startIndex + 1}–${Math.min(
                  startIndex + pagination.perPage,
                  totalItems
                )}`}
          </strong>{' '}
          of <strong>{totalItems}</strong> repositories
          {totalItems !== repos.length && ` (filtered from ${repos.length})`}
        </Typography>
      </Box>

      {/* Grid or Empty */}
      {totalItems === 0 ? (
        <EmptyState
          type="no-repos"
          onResetFilters={() => dispatch(resetFilters())}
        />
      ) : (
        <Grid container spacing={2.5}>
          {currentRepos.map((repo) => (
            <Grid item xs={12} sm={6} md={4} key={repo.id}>
              <RepoCard repo={repo} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 4, mb: 2, alignItems: 'center' }}>
          <Pagination
            count={totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
    </Box>
  );
};

export default RepoList;

