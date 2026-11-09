import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Link
} from '@mui/material';
import {
  OpenInNewIcon,
  LocationOnIcon,
  BusinessIcon,
  LinkIcon,
  TwitterIcon,
  CalendarMonthIcon,
  CheckCircleIcon
} from '../common/Icons';
import { formatDate } from '../../utils/formatters';

const UserProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3.5,
            alignItems: { xs: 'center', md: 'flex-start' }
          }}
        >
          {/* User Avatar */}
          <Avatar
            src={user.avatar_url}
            alt={user.name || user.login}
            sx={{
              width: { xs: 100, sm: 120, md: 140 },
              height: { xs: 100, sm: 120, md: 140 },
              border: 3,
              borderColor: 'primary.main',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          />

          {/* User Information */}
          <Box sx={{ flex: 1, width: '100%' }}>
            {/* Header: Name, Username & External Link */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1.5,
                mb: 1.5
              }}
            >
              <Box>
                <Typography variant="h5" component="h1" fontWeight={700}>
                  {user.name || user.login}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ fontFamily: 'monospace' }}
                >
                  @{user.login}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {user.hireable && (
                  <Chip
                    icon={<CheckCircleIcon fontSize="small" />}
                    label="Available for hire"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
                {user.type && (
                  <Chip
                    label={user.type}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                )}
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View GitHub
                </Button>
              </Box>
            </Box>

            {/* Bio */}
            {user.bio && (
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ mb: 2.5, lineHeight: 1.5, maxWidth: 800 }}
              >
                {user.bio}
              </Typography>
            )}

            {/* Metadata items grid */}
            <Grid container spacing={2}>
              {user.company && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2" noWrap title={user.company}>
                      {user.company}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {user.location && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" noWrap title={user.location}>
                      {user.location}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {user.blog && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkIcon fontSize="small" color="action" />
                    <Link
                      href={
                        user.blog.startsWith('http')
                          ? user.blog
                          : `https://${user.blog}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      underline="hover"
                      noWrap
                      title={user.blog}
                    >
                      {user.blog}
                    </Link>
                  </Box>
                </Grid>
              )}

              {user.twitter_username && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TwitterIcon fontSize="small" color="action" />
                    <Link
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      underline="hover"
                    >
                      @{user.twitter_username}
                    </Link>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Joined {formatDate(user.created_at)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
