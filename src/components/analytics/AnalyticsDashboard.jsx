import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Button
} from '@mui/material';
import {
  StarIcon,
  ForkRightIcon,
  TerminalIcon,
  EmojiEventsIcon,
  ExploreIcon
} from '../common/Icons';
import LanguageDonutChart from './LanguageDonutChart';
import StarsBarChart from './StarsBarChart';
import ForksBarChart from './ForksBarChart';
import RepoSizeChart from './RepoSizeChart';
import { ChartSkeleton } from '../common/Loader';
import { formatNumber } from '../../utils/formatters';
import { setActiveNav } from '../../features/ui/uiSlice';

const AnalyticsSummaryCard = ({ title, value, subtitle, icon, color }) => (
  <Card sx={{ height: '100%', borderRadius: 2.5 }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            borderRadius: 2,
            backgroundColor: `${color}1A`,
            color: color
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { repos: profileRepos, loading: profileLoading } = useSelector((state) => state.repos);
  const user = useSelector((state) => state.user.user);
  const { repositories: trendingRepos, loading: trendingLoading } = useSelector(
    (state) => state.trending
  );

  // Use profile repos if present, otherwise trending repos
  const isProfileMode = Boolean(profileRepos && profileRepos.length > 0);
  const targetRepos = isProfileMode ? profileRepos : trendingRepos;
  const isLoading = isProfileMode ? profileLoading : trendingLoading;

  // Compute overall summary statistics
  const summary = useMemo(() => {
    let totalStars = 0;
    let totalForks = 0;
    const langCounts = {};
    let mostStarred = null;

    targetRepos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }

      if (!mostStarred || repo.stargazers_count > mostStarred.stargazers_count) {
        mostStarred = repo;
      }
    });

    let topLang = 'None';
    let maxLangCount = 0;
    Object.entries(langCounts).forEach(([lang, count]) => {
      if (count > maxLangCount) {
        maxLangCount = count;
        topLang = lang;
      }
    });

    return {
      totalStars,
      totalForks,
      topLang,
      mostStarredRepoName: mostStarred?.name || 'N/A',
      mostStarredCount: mostStarred?.stargazers_count || 0
    };
  }, [targetRepos]);

  if (isLoading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!targetRepos || targetRepos.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No repository data available to generate dashboard analytics.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Discover trending repositories or search for a GitHub user to populate the dashboard.
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(setActiveNav('trending'))}
          startIcon={<ExploreIcon />}
        >
          View Trending Repositories
        </Button>
      </Box>
    );
  }

  const contextTitle = isProfileMode
    ? `Overview for @${user?.login || 'searched user'}`
    : 'Overview for Trending Repositories';

  return (
    <Box sx={{ width: '100%' }}>
      {/* Dashboard Heading */}
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
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {contextTitle} ({targetRepos.length} repositories analyzed)
        </Typography>
      </Box>

      {/* Analytics Summary Stats Row */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={6} sm={3}>
          <AnalyticsSummaryCard
            title="Total Stars Earned"
            value={formatNumber(summary.totalStars)}
            subtitle={`Across ${targetRepos.length} repositories`}
            icon={<StarIcon />}
            color="#d29922"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <AnalyticsSummaryCard
            title="Total Forks"
            value={formatNumber(summary.totalForks)}
            subtitle="Community copies"
            icon={<ForkRightIcon />}
            color="#3fb950"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <AnalyticsSummaryCard
            title="Primary Language"
            value={summary.topLang}
            subtitle="Most used in repos"
            icon={<TerminalIcon />}
            color="#2f81f7"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <AnalyticsSummaryCard
            title="Top Repository"
            value={summary.mostStarredRepoName}
            subtitle={`${formatNumber(summary.mostStarredCount)} stars`}
            icon={<EmojiEventsIcon />}
            color="#a371f7"
          />
        </Grid>
      </Grid>

      {/* 2x2 Highcharts Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <LanguageDonutChart repos={targetRepos} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <StarsBarChart repos={targetRepos} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ForksBarChart repos={targetRepos} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RepoSizeChart repos={targetRepos} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
