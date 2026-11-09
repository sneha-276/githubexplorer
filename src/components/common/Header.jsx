import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Chip,
  Button
} from '@mui/material';
import {
  GitHubIcon,
  Brightness4Icon,
  Brightness7Icon,
  VpnKeyIcon,
  SpeedIcon,
  SearchIcon,
  ExploreIcon,
  BarChartIcon
} from './Icons';
import { toggleDarkMode, openTokenModal, setActiveNav } from '../../features/ui/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { darkMode, rateLimit, githubToken, activeNav } = useSelector(
    (state) => state.ui
  );

  const hasToken = Boolean(githubToken);

  const navItems = [
    { id: 'trending', label: 'Trending', icon: <ExploreIcon fontSize="small" /> },
    { id: 'search', label: 'Search', icon: <SearchIcon fontSize="small" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChartIcon fontSize="small" /> }
  ];

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: (theme) => theme.palette.background.paper
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Brand / Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer'
          }}
          onClick={() => dispatch(setActiveNav('trending'))}
        >
          <GitHubIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #58a6ff 30%, #a371f7 90%)'
                    : 'linear-gradient(45deg, #0969da 30%, #8250df 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              GitHub Explorer
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Trending • Search • Analytics
            </Typography>
          </Box>
        </Box>

        {/* Center: Main Navigation Tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <Button
                key={item.id}
                startIcon={item.icon}
                onClick={() => dispatch(setActiveNav(item.id))}
                variant={isActive ? 'contained' : 'text'}
                color={isActive ? 'primary' : 'inherit'}
                size="small"
                sx={{
                  px: { xs: 1.2, sm: 2 },
                  py: 0.7,
                  borderRadius: 2,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  boxShadow: isActive ? '0 2px 8px rgba(47, 129, 247, 0.25)' : 'none'
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {/* Right: Action Controls (Rate limit, PAT, Theme) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/* Rate Limit Status Chip */}
          {rateLimit.remaining !== null && (
            <Tooltip
              title={`GitHub API Rate Limit: ${rateLimit.remaining}/${rateLimit.limit} remaining.`}
            >
              <Chip
                icon={<SpeedIcon />}
                size="small"
                label={`${rateLimit.remaining}/${rateLimit.limit}`}
                color={
                  rateLimit.remaining < 10
                    ? 'error'
                    : rateLimit.remaining < 25
                    ? 'warning'
                    : 'default'
                }
                variant="outlined"
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              />
            </Tooltip>
          )}

          {/* Token Modal Trigger */}
          <Tooltip title={hasToken ? 'GitHub Token Active' : 'Configure GitHub Token'}>
            <IconButton
              onClick={() => dispatch(openTokenModal())}
              color={hasToken ? 'primary' : 'default'}
              size="small"
              sx={{
                border: 1,
                borderColor: hasToken ? 'primary.main' : 'divider',
                p: 0.8
              }}
            >
              <VpnKeyIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Dark / Light Mode Switch */}
          <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
            <IconButton
              onClick={() => dispatch(toggleDarkMode())}
              color="inherit"
              size="small"
              sx={{
                border: 1,
                borderColor: 'divider',
                p: 0.8
              }}
            >
              {darkMode ? (
                <Brightness7Icon fontSize="small" sx={{ color: '#f0883e' }} />
              ) : (
                <Brightness4Icon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
