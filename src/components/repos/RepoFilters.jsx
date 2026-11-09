import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Chip
} from '@mui/material';
import { SearchIcon, FilterAltOffIcon } from '../common/Icons';
import { setFilter, resetFilters } from '../../features/repos/reposSlice';

const RepoFilters = () => {
  const dispatch = useDispatch();
  const { repos, filters } = useSelector((state) => state.repos);

  // Extract unique languages from repositories list for the dropdown
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    repos.forEach((repo) => {
      if (repo.language) {
        langs.add(repo.language);
      }
    });
    return Array.from(langs).sort();
  }, [repos]);

  const handleSearchChange = (e) => {
    dispatch(setFilter({ search: e.target.value }));
  };

  const handleLanguageChange = (e) => {
    dispatch(setFilter({ language: e.target.value }));
  };

  const handleTypeChange = (e) => {
    dispatch(setFilter({ type: e.target.value }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilter({ sort: e.target.value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const isFiltered =
    Boolean(filters.search) ||
    filters.language !== 'all' ||
    filters.type !== 'all' ||
    filters.sort !== 'stars';

  return (
    <Box
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#161b22' : '#ffffff',
        border: 1,
        borderColor: 'divider'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Search input for repos */}
        <Grid item xs={12} sm={6} md={3.5}>
          <TextField
            fullWidth
            size="small"
            placeholder="Filter repositories by name..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Language select */}
        <Grid item xs={6} sm={3} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel id="language-filter-label">Language</InputLabel>
            <Select
              labelId="language-filter-label"
              value={filters.language}
              label="Language"
              onChange={handleLanguageChange}
            >
              <MenuItem value="all">All Languages</MenuItem>
              {availableLanguages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Type select */}
        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              labelId="type-filter-label"
              value={filters.type}
              label="Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="sources">Sources Only</MenuItem>
              <MenuItem value="forks">Forks Only</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort select */}
        <Grid item xs={8} sm={4} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-filter-label">Sort By</InputLabel>
            <Select
              labelId="sort-filter-label"
              value={filters.sort}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="stars">Most Stars</MenuItem>
              <MenuItem value="forks">Most Forks</MenuItem>
              <MenuItem value="updated">Recently Updated</MenuItem>
              <MenuItem value="size">Largest Size</MenuItem>
              <MenuItem value="name">Name (A-Z)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Reset button */}
        <Grid item xs={4} sm={2} md={1.5} sx={{ textAlign: { sm: 'right' } }}>
          <Button
            fullWidth
            size="medium"
            variant="outlined"
            color="inherit"
            disabled={!isFiltered}
            onClick={handleReset}
            startIcon={<FilterAltOffIcon fontSize="small" />}
            sx={{ height: 40 }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RepoFilters;
