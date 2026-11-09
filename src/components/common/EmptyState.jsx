import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  Chip,
  Stack,
  Button
} from '@mui/material';
import { ExploreIcon, SearchOffIcon, RestartAltIcon } from './Icons';
import { fetchUserRequest } from '../../features/user/userSlice';
import { resetFilters } from '../../features/repos/reposSlice';

const SUGGESTED_PROFILES = [
  { name: 'Dan Abramov', username: 'gaearon', role: 'React Core' },
  { name: 'Linus Torvalds', username: 'torvalds', role: 'Linux & Git' },
  { name: 'Meta', username: 'facebook', role: 'Open Source Org' },
  { name: 'Vercel', username: 'vercel', role: 'Next.js & Frontend' },
  { name: 'shadcn', username: 'shadcn', role: 'UI Components' },
  { name: 'Google', username: 'google', role: 'Open Source Org' }
];

export const EmptyState = ({ type = 'initial', onResetFilters }) => {
  const dispatch = useDispatch();

  const handleSelectSuggested = (username) => {
    dispatch(fetchUserRequest(username));
  };

  if (type === 'no-repos') {
    return (
      <Card
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: (theme) => theme.palette.background.subtle,
          borderStyle: 'dashed'
        }}
      >
        <SearchOffIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>
          No Repositories Match Your Filter
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 450, mx: 'auto' }}>
          We could not find any repositories matching your current search query, language, or type filters.
        </Typography>
        <Button
          variant="contained"
          startIcon={<RestartAltIcon />}
          onClick={onResetFilters || (() => dispatch(resetFilters()))}
        >
          Reset Filters
        </Button>
      </Card>
    );
  }

  // Initial welcome state
  return (
    <Card
      sx={{
        p: { xs: 4, md: 6 },
        textAlign: 'center',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
        border: 1,
        borderColor: 'divider',
        my: 4
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(47, 129, 247, 0.15)'
              : 'rgba(9, 105, 218, 0.1)',
          color: 'primary.main',
          mb: 2.5
        }}
      >
        <ExploreIcon sx={{ fontSize: 44 }} />
      </Box>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        Explore GitHub Profiles & Analytics
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 620, mx: 'auto', mb: 4, lineHeight: 1.6 }}
      >
        Search for any GitHub username above to discover public repositories,
        analyze programming language distributions, inspect star rankings, and visualize activity metrics.
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}
        >
          Or try a popular developer or organization:
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="center"
          useFlexGap
          sx={{ gap: 1.5 }}
        >
          {SUGGESTED_PROFILES.map((profile) => (
            <Chip
              key={profile.username}
              label={`${profile.username} (${profile.role})`}
              clickable
              onClick={() => handleSelectSuggested(profile.username)}
              variant="outlined"
              color="primary"
              sx={{ py: 2, px: 0.5, fontWeight: 500 }}
            />
          ))}
        </Stack>
      </Box>
    </Card>
  );
};

export default EmptyState;
