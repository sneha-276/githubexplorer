import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Chip,
  Avatar,
  Typography,
  Tooltip,
  Button
} from '@mui/material';
import {
  toggleContributorVisibility,
  showAllContributors
} from '../../features/analytics/analyticsSlice';
import { formatNumber } from '../../utils/formatters';

const ContributorLegend = ({ contributors = [], metric = 'commits' }) => {
  const dispatch = useDispatch();
  const hiddenContributors = useSelector((state) => state.analytics.hiddenContributors);

  if (!contributors || contributors.length === 0) return null;

  const hasHidden = Object.values(hiddenContributors).some(Boolean);

  const metricLabel =
    metric === 'commits'
      ? 'commits'
      : metric === 'additions'
      ? 'lines added'
      : 'lines deleted';

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          CONTRIBUTORS (click to show/hide line):
        </Typography>

        {hasHidden && (
          <Button
            size="small"
            variant="text"
            onClick={() => dispatch(showAllContributors())}
            sx={{ fontSize: '0.75rem', py: 0.25 }}
          >
            Show All
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {contributors.map((contrib) => {
          const isHidden = Boolean(hiddenContributors[contrib.login]);
          return (
            <Tooltip
              key={contrib.login}
              title={`${contrib.login}: ${formatNumber(contrib.totalMetric)} ${metricLabel}. Click to ${
                isHidden ? 'show' : 'hide'
              }`}
            >
              <Chip
                avatar={
                  contrib.avatarUrl ? (
                    <Avatar
                      src={contrib.avatarUrl}
                      alt={contrib.login}
                      sx={{
                        width: 22,
                        height: 22,
                        border: 2,
                        borderColor: contrib.color
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: contrib.color,
                        ml: 0.8
                      }}
                    />
                  )
                }
                label={`${contrib.login} (${formatNumber(contrib.totalMetric)})`}
                onClick={() => dispatch(toggleContributorVisibility(contrib.login))}
                variant={isHidden ? 'outlined' : 'filled'}
                size="small"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  borderColor: contrib.color,
                  opacity: isHidden ? 0.45 : 1,
                  textDecoration: isHidden ? 'line-through' : 'none',
                  backgroundColor: (theme) =>
                    isHidden
                      ? 'transparent'
                      : theme.palette.mode === 'dark'
                      ? `${contrib.color}26`
                      : `${contrib.color}18`,
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? '#f0f6fc' : '#1f2328',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 0.9,
                    borderColor: contrib.color
                  }
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default ContributorLegend;

