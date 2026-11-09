import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, ButtonGroup, Button, Chip, Typography } from '@mui/material';
import { setSelectedPeriod } from '../../features/trending/trendingSlice';

const PERIOD_OPTIONS = [
  { id: '1week', label: 'Last 1 Week' },
  { id: '2weeks', label: 'Last 2 Weeks' },
  { id: '1month', label: 'Last 1 Month' }
];

const DateFilter = () => {
  const dispatch = useDispatch();
  const selectedPeriod = useSelector((state) => state.trending.selectedPeriod);
  const loading = useSelector((state) => state.trending.loading);

  const handleSelectPeriod = (periodId) => {
    if (periodId !== selectedPeriod) {
      dispatch(setSelectedPeriod(periodId));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1.5,
        mb: 3
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        Time Range:
      </Typography>

      <ButtonGroup
        variant="outlined"
        size="medium"
        aria-label="Trending time period filter"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          '& .MuiButton-root': {
            px: 2,
            py: 0.75,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.875rem'
          }
        }}
      >
        {PERIOD_OPTIONS.map((option) => {
          const isSelected = selectedPeriod === option.id;
          return (
            <Button
              key={option.id}
              onClick={() => handleSelectPeriod(option.id)}
              disabled={loading}
              variant={isSelected ? 'contained' : 'outlined'}
              color="primary"
              sx={{
                boxShadow: isSelected ? '0 2px 8px rgba(47, 129, 247, 0.3)' : 'none',
                fontWeight: isSelected ? 700 : 500
              }}
            >
              {option.label}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};

export default DateFilter;

