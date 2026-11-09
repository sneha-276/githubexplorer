import React from 'react';
import { useSelector } from 'react-redux';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container
} from '@mui/material';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import TokenModal from './components/common/TokenModal';
import RepoDetailModal from './components/repos/RepoDetailModal';

import TrendingView from './components/trending/TrendingView';
import SearchGitHubView from './components/search/SearchGitHubView';
import RepositoryAnalyticsView from './components/repositoryAnalytics/RepositoryAnalyticsView';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';

import { getAppTheme } from './theme/theme';

function App() {
  const darkMode = useSelector((state) => state.ui.darkMode);
  const activeNav = useSelector((state) => state.ui.activeNav);

  const theme = React.useMemo(
    () => getAppTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default'
        }}
      >
        {/* Navigation & Header */}
        <Header />

        {/* Main Content Area */}
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, flexGrow: 1 }}>
          {/* View 1: Trending Repositories (Default Landing Screen) */}
          {activeNav === 'trending' && <TrendingView />}

          {/* View 2: GitHub Search (Users, Profile Exploration & Global Repositories) */}
          {activeNav === 'search' && <SearchGitHubView />}

          {/* View 3: Repository Activity Analytics (Two Synchronized Weekly Graphs) */}
          {activeNav === 'analytics' && <RepositoryAnalyticsView />}

          {/* View 4: Analytics Dashboard (Overview Highcharts Visualizations) */}
          {activeNav === 'dashboard' && <AnalyticsDashboard />}
        </Container>

        {/* Popups & Modals */}
        <RepoDetailModal />
        <TokenModal />

        {/* Global Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
