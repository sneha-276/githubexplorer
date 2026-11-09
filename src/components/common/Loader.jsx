import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Grid
} from '@mui/material';

/**
 * Skeleton loader representing user profile header and metric cards
 */
export const ProfileSkeleton = () => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* User profile card skeleton */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'center' }}>
          <Skeleton variant="circular" width={110} height={110} />
          <Box sx={{ flex: 1, width: '100%' }}>
            <Skeleton variant="text" width="50%" height={36} />
            <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="85%" height={20} />
            <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Skeleton variant="rounded" width={120} height={24} />
              <Skeleton variant="rounded" width={140} height={24} />
              <Skeleton variant="rounded" width={100} height={24} />
            </Box>
          </Box>
        </Box>
      </Card>

      {/* 4 Stats skeleton cards */}
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={6} sm={3} key={item}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
              <Skeleton variant="text" width="40%" height={38} sx={{ mx: 'auto' }} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

/**
 * Skeleton loader for repository card grid
 */
export const ReposSkeleton = () => {
  return (
    <Grid container spacing={2.5}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ height: '100%', p: 1 }}>
            <CardContent>
              <Skeleton variant="text" width="70%" height={28} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="85%" height={20} />
              <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'center' }}>
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="text" width={40} height={20} />
                <Skeleton variant="text" width={40} height={20} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Skeleton loader for analytics charts
 */
export const ChartSkeleton = () => {
  return (
    <Card sx={{ p: 3, height: 380, display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" width="100%" height="100%" />
    </Card>
  );
};

export default {
  ProfileSkeleton,
  ReposSkeleton,
  ChartSkeleton
};

