import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  StarBorderIcon,
  ForkRightIcon,
  AdjustIcon,
  OpenInNewIcon,
  RefreshIcon
} from '../common/Icons';
import TotalActivityChart from './TotalActivityChart';
import ContributorActivityChart from './ContributorActivityChart';
import ActivityMetricSelect from './ActivityMetricSelect';
import { alignWeeklyData } from '../../utils/chartUtils';
import { formatNumber } from '../../utils/formatters';
import { formatCreationDate } from '../../utils/dateUtils';
import {
  fetchRepoAnalyticsRequest,
  clearRepoAnalytics
} from '../../features/analytics/analyticsSlice';
import { returnToPreviousNav, setActiveNav } from '../../features/ui/uiSlice';

const RepositoryAnalyticsView = () => {
  const dispatch = useDispatch();
  const {
    selectedRepo,
    codeFrequency,
    commitActivity,
    contributors,
    selectedMetric,
    loading,
    isCalculating,
    error,
    sourceView
  } = useSelector((state) => state.analytics);

  const handleBack = () => {
    dispatch(returnToPreviousNav());
  };

  const handleRetry = () => {
    if (selectedRepo) {
      dispatch(fetchRepoAnalyticsRequest({ repo: selectedRepo, sourceView }));
    }
  };

  // Align weekly timeline across commit_activity, code_frequency, and contributors
  const alignedData = useMemo(() => {
    return alignWeeklyData(commitActivity, codeFrequency, contributors, selectedMetric);
  }, [commitActivity, codeFrequency, contributors, selectedMetric]);

  if (!selectedRepo) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No repository selected for analytics.
        </Typography>
        <Button variant="contained" onClick={() => dispatch(setActiveNav('trending'))}>
          Go to Trending Repositories
        </Button>
      </Box>
    );
  }

  const ownerLogin = selectedRepo.owner?.login || 'unknown';
  const ownerAvatar = selectedRepo.owner?.avatar_url || '';
  const repoName = selectedRepo.name;
  const fullName = selectedRepo.full_name || `${ownerLogin}/${repoName}`;

  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      {/* Back button & Navigation breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: 'divider',
            color: 'text.primary'
          }}
        >
          Back to {sourceView === 'search' ? 'Search' : sourceView === 'dashboard' ? 'Dashboard' : 'Trending'}
        </Button>
      </Box>

      {/* Repository Information Header */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0, 0, 0, 0.4)'
              : '0 4px 20px rgba(0, 0, 0, 0.06)'
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2.5
            }}
          >
            {/* Left: Avatar, Title, Description, Date */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
              <Avatar
                src={ownerAvatar}
                alt={ownerLogin}
                sx={{
                  width: 56,
                  height: 56,
                  border: 2,
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="h5"
                    component="h1"
                    fontWeight={800}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    {fullName}
                  </Typography>
                  {selectedRepo.fork && (
                    <Chip label="Forked" size="small" variant="outlined" color="secondary" />
                  )}
                  {selectedRepo.language && (
                    <Chip
                      label={selectedRepo.language}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, maxWidth: 850, lineHeight: 1.5 }}
                >
                  {selectedRepo.description || 'No description provided.'}
                </Typography>

                {selectedRepo.created_at && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                    Created on {formatCreationDate(selectedRepo.created_at)}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Right: Quick Stats & External Link */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                alignSelf: { xs: 'stretch', md: 'center' },
                justifyContent: { xs: 'space-between', md: 'flex-end' }
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title={`${selectedRepo.stargazers_count ?? 0} stars`}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#e3b341' }}>
                      <StarBorderIcon fontSize="small" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        {formatNumber(selectedRepo.stargazers_count ?? 0)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Stars
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title={`${selectedRepo.forks_count ?? 0} forks`}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ForkRightIcon fontSize="small" color="primary" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        {formatNumber(selectedRepo.forks_count ?? 0)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Forks
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title={`${selectedRepo.open_issues_count ?? 0} open issues`}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AdjustIcon fontSize="small" color="success" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        {formatNumber(selectedRepo.open_issues_count ?? 0)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Issues
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>

              <Button
                variant="outlined"
                color="primary"
                size="small"
                href={selectedRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon fontSize="small" />}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                GitHub
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Control Bar: Metric Selector & Title */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
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
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Weekly Development Activity
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Showing up to 1 year (52 weeks) of synchronized weekly development history
          </Typography>
        </Box>

        <ActivityMetricSelect />
      </Box>

      {/* Error Notice */}
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

      {/* Calculating / Loading Indicator */}
      {(loading || isCalculating) && (
        <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={36} color="primary" />
          <Typography variant="body2" color="text.secondary">
            {isCalculating
              ? 'GitHub is computing statistics for this repository in the background. Please wait a moment...'
              : 'Fetching weekly code frequency, commits and contributor statistics...'}
          </Typography>
        </Box>
      )}

      {/* Two Vertically Stacked Graphs */}
      {!loading && (
        <Stack spacing={3.5}>
          {/* Graph 1: Total Repository Activity */}
          <TotalActivityChart
            categories={alignedData.categories}
            data={alignedData.totalSeriesData}
            metric={selectedMetric}
          />

          {/* Graph 2: Contributor Activity */}
          <ContributorActivityChart
            categories={alignedData.categories}
            series={alignedData.contributorSeries}
            metric={selectedMetric}
          />
        </Stack>
      )}
    </Box>
  );
};

export default RepositoryAnalyticsView;

