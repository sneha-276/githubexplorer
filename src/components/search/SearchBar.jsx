import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  InputBase,
  IconButton,
  CircularProgress,
  Tooltip,
  Box
} from '@mui/material';
import { SearchIcon, ClearIcon } from '../common/Icons';
import { fetchUserRequest } from '../../features/user/userSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { loading, currentUsername } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  // Synchronize local input if username was selected from outside (e.g. suggested chip)
  React.useEffect(() => {
    if (currentUsername) {
      setSearchTerm(currentUsername);
    }
  }, [currentUsername]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      dispatch(fetchUserRequest(trimmed));
    }
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 720, mx: 'auto' }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 3,
          border: 2,
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.12)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
          transition: 'all 0.2s ease-in-out',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 0 0 3px rgba(47, 129, 247, 0.3)'
                : '0 0 0 3px rgba(9, 105, 218, 0.2)'
          }
        }}
      >
        <IconButton sx={{ p: '10px', color: 'primary.main' }} aria-label="search" onClick={handleSubmit}>
          <SearchIcon />
        </IconButton>

        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            fontSize: '1.05rem',
            fontFamily: 'Inter, sans-serif'
          }}
          placeholder="Enter GitHub username (e.g. gaearon, torvalds, vercel)..."
          inputProps={{ 'aria-label': 'search github username' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
          autoFocus
        />

        {searchTerm && !loading && (
          <Tooltip title="Clear input">
            <IconButton size="small" onClick={handleClear} sx={{ mr: 0.5 }}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <IconButton
          type="submit"
          color="primary"
          sx={{
            p: '8px 16px',
            borderRadius: 2,
            backgroundColor: 'primary.main',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'primary.dark'
            },
            '&.Mui-disabled': {
              backgroundColor: 'action.disabledBackground'
            }
          }}
          disabled={loading || !searchTerm.trim()}
          aria-label="submit search"
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            <SearchIcon fontSize="small" />
          )}
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;
