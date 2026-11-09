import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { setSelectedMetric } from '../../features/analytics/analyticsSlice';

const ActivityMetricSelect = () => {
  const dispatch = useDispatch();
  const selectedMetric = useSelector((state) => state.analytics.selectedMetric);

  const handleChange = (e) => {
    dispatch(setSelectedMetric(e.target.value));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="body2" fontWeight={600} color="text.secondary">
        Metric:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="activity-metric-label">Activity Metric</InputLabel>
        <Select
          labelId="activity-metric-label"
          id="activity-metric-select"
          value={selectedMetric}
          label="Activity Metric"
          onChange={handleChange}
          sx={{
            fontWeight: 600,
            borderRadius: 2
          }}
        >
          <MenuItem value="commits">Commits</MenuItem>
          <MenuItem value="additions">Additions</MenuItem>
          <MenuItem value="deletions">Deletions</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ActivityMetricSelect;

