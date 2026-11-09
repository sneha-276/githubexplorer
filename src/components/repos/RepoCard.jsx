import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Link,
  Avatar
} from '@mui/material';
import {
  StarBorderIcon,
  ForkRightIcon,
  AdjustIcon,
  OpenInNewIcon,
  BarChartIcon,
  LockOutlinedIcon,
  PublicIcon,
  CalendarMonthIcon
} from '../common/Icons';
import { getLanguageColor } from '../../utils/colors';
import { formatNumber, formatRelativeTime, formatSize } from '../../utils/formatters';
import { formatCreationDate } from '../../utils/dateUtils';
import {
  setSelectedRepo,
  fetchRepoDetailsRequest
} from '../../features/repos/reposSlice';
import { fetchRepoAnalyticsRequest } from '../../features/analytics/analyticsSlice';
import { setActiveNav } from '../../features/ui/uiSlice';

const RepoCard = ({ repo, showOwner = true }) => {
  const dispatch = useDispatch();
  const activeNav = useSelector((state) => state.ui.activeNav);

  if (!repo) return null;

  const handleOpenAnalytics = () => {
    dispatch(fetchRepoAnalyticsRequest({ repo, sourceView: activeNav }));
    dispatch(setActiveNav('analytics'));
  };

  const handleOpenQuickDetails = () => {
    dispatch(setSelectedRepo(repo));
    dispatch(
      fetchRepoDetailsRequest({
        owner: repo.owner?.login || '',
        repo: repo.name
      })
    );
  };

  const languageColor = getLanguageColor(repo.language);
  const ownerLogin = repo.owner?.login || 'unknown';
  const ownerAvatar = repo.owner?.avatar_url || '';
  const displayName = repo.full_name || `${ownerLogin}/${repo.name}`;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2.5,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 6px 20px rgba(0, 0, 0, 0.4)'
              : '0 6px 20px rgba(0, 0, 0, 0.08)',
          borderColor: 'primary.main'
        }
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        {/* Owner Info & Badges */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mb: 1.5
          }}
        >
          {showOwner && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Avatar
                src={ownerAvatar}
                alt={ownerLogin}
                sx={{ width: 26, height: 26, border: 1, borderColor: 'divider' }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                noWrap
                title={ownerLogin}
              >
                {ownerLogin}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', ml: 'auto' }}>
            {repo.fork && (
              <Chip
                label="Forked"
                size="small"
                variant="outlined"
                color="secondary"
                sx={{ fontSize: '0.68rem', height: 20 }}
              />
            )}
            <Chip
              icon={
                repo.private ? (
                  <LockOutlinedIcon sx={{ fontSize: '11px !important' }} />
                ) : (
                  <PublicIcon sx={{ fontSize: '11px !important' }} />
                )
              }
              label={repo.private ? 'Private' : 'Public'}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.68rem', height: 20 }}
            />
          </Box>
        </Box>

        {/* Repository Full Name */}
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          variant="h6"
          underline="hover"
          title={displayName}
          sx={{
            fontWeight: 700,
            fontSize: '1.05rem',
            color: 'primary.main',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1
          }}
        >
          {displayName}
        </Link>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: 40,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5
          }}
        >
          {repo.description || 'No description provided for this repository.'}
        </Typography>

        {/* Created date & Size line */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            color: 'text.secondary',
            fontSize: '0.78rem'
          }}
        >
          {repo.created_at && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarMonthIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                Created {formatCreationDate(repo.created_at)}
              </Typography>
            </Box>
          )}
          {repo.size > 0 && (
            <Typography variant="caption">• {formatSize(repo.size)}</Typography>
          )}
        </Box>

        {/* Language & Metrics row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            pt: 1.5,
            borderTop: 1,
            borderColor: 'divider',
            fontSize: '0.8rem',
            color: 'text.secondary'
          }}
        >
          {/* Primary Language */}
          {repo.language && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box
                sx={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  backgroundColor: languageColor
                }}
              />
              <Typography variant="caption" fontWeight={600} color="text.primary">
                {repo.language}
              </Typography>
            </Box>
          )}

          {/* Stars */}
          <Tooltip title={`${repo.stargazers_count ?? 0} stars`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <StarBorderIcon sx={{ fontSize: 16, color: '#e3b341' }} />
              <Typography variant="caption" fontWeight={600}>
                {formatNumber(repo.stargazers_count ?? 0)}
              </Typography>
            </Box>
          </Tooltip>

          {/* Forks */}
          <Tooltip title={`${repo.forks_count ?? 0} forks`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <ForkRightIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                {formatNumber(repo.forks_count ?? 0)}
              </Typography>
            </Box>
          </Tooltip>

          {/* Open Issues */}
          <Tooltip title={`${repo.open_issues_count ?? 0} open issues`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <AdjustIcon sx={{ fontSize: 15, color: repo.open_issues_count > 0 ? '#3fb950' : 'inherit' }} />
              <Typography variant="caption">
                {formatNumber(repo.open_issues_count ?? 0)} issues
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </CardContent>

      {/* Card Actions Footer */}
      <CardActions
        sx={{
          px: 2.5,
          py: 1.25,
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'space-between',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {repo.updated_at ? `Updated ${formatRelativeTime(repo.updated_at)}` : ''}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<BarChartIcon fontSize="small" />}
            onClick={handleOpenAnalytics}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              px: 1.5,
              py: 0.5
            }}
          >
            View Analytics
          </Button>

          <Tooltip title="Open in GitHub">
            <IconButton
              size="small"
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default RepoCard;
