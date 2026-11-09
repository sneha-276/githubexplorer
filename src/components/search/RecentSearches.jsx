import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Chip,
  Button,
  Stack
} from '@mui/material';
import { HistoryIcon, ClearAllIcon } from '../common/Icons';
import { fetchUserRequest } from '../../features/user/userSlice';
import {
  removeRecentSearch,
  clearRecentSearches
} from '../../features/ui/uiSlice';

const RecentSearches = () => {
  const dispatch = useDispatch();
  const recentSearches = useSelector((state) => state.ui.recentSearches);
  const currentUsername = useSelector((state) => state.user.currentUsername);

  if (!recentSearches || recentSearches.length === 0) {
    return null;
  }

  const handleSelect = (username) => {
    dispatch(fetchUserRequest(username));
  };

  const handleDelete = (e, username) => {
    e.stopPropagation();
    dispatch(removeRecentSearch(username));
  };

  return (
    <Box sx={{ mt: 2, mb: 3, maxWidth: 720, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
        >
          <HistoryIcon fontSize="inherit" /> RECENT SEARCHES:
        </Typography>
        <Button
          size="small"
          color="inherit"
          startIcon={<ClearAllIcon fontSize="inherit" />}
          onClick={() => dispatch(clearRecentSearches())}
          sx={{ fontSize: '0.75rem', py: 0.2, px: 0.8 }}
        >
          Clear
        </Button>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
        {recentSearches.map((username) => {
          const isSelected =
            currentUsername &&
            currentUsername.toLowerCase() === username.toLowerCase();

          return (
            <Chip
              key={username}
              label={username}
              clickable
              onClick={() => handleSelect(username)}
              onDelete={(e) => handleDelete(e, username)}
              variant={isSelected ? 'filled' : 'outlined'}
              color={isSelected ? 'primary' : 'default'}
              size="small"
              sx={{
                fontWeight: 500,
                backgroundColor: isSelected ? 'primary.main' : 'background.paper'
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default RecentSearches;
