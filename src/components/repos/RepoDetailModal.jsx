import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  CloseIcon,
  ContentCopyIcon,
  OpenInNewIcon,
  CommitIcon,
  DonutLargeIcon,
  StarBorderIcon,
  ForkRightIcon,
  AdjustIcon
} from '../common/Icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { clearSelectedRepo } from '../../features/repos/reposSlice';
import { formatNumber, formatRelativeTime, formatDate } from '../../utils/formatters';
import { getLanguageColor } from '../../utils/colors';

const RepoDetailModal = () => {
  const dispatch = useDispatch();
  const { selectedRepo, repoDetails } = useSelector((state) => state.repos);
  const darkMode = useSelector((state) => state.ui.darkMode);
  const [copySnackbar, setCopySnackbar] = useState(false);

  if (!selectedRepo) return null;

  const handleClose = () => {
    dispatch(clearSelectedRepo());
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(selectedRepo.clone_url);
    setCopySnackbar(true);
  };

  // Prepare Highcharts data for repository language breakdown
  const languageData = Object.entries(repoDetails.languages || {}).map(
    ([name, bytes]) => ({
      name,
      y: bytes,
      color: getLanguageColor(name)
    })
  );

  const totalBytes = Object.values(repoDetails.languages || {}).reduce(
    (acc, val) => acc + val,
    0
  );

  const chartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 240
    },
    title: {
      text: null
    },
    tooltip: {
      pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}% ({point.y} bytes)'
    },
    plotOptions: {
      pie: {
        innerSize: '55%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          style: {
            color: darkMode ? '#f0f6fc' : '#1f2328',
            textOutline: 'none',
            fontSize: '11px'
          }
        }
      }
    },
    series: [
      {
        name: 'Bytes',
        data: languageData
      }
    ],
    credits: { enabled: false }
  };

  return (
    <>
      <Dialog
        open={Boolean(selectedRepo)}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {selectedRepo.name}
            </Typography>
            {selectedRepo.fork && (
              <Chip label="Forked" size="small" color="secondary" variant="outlined" />
            )}
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Description */}
          <Typography variant="body1" paragraph color="text.secondary">
            {selectedRepo.description || 'No description provided.'}
          </Typography>

          {/* Quick Stats Banner */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              mb: 3,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: (theme) => theme.palette.action.hover
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarBorderIcon color="primary" fontSize="small" />
              <Typography variant="body2">
                <strong>{formatNumber(selectedRepo.stargazers_count)}</strong> Stars
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ForkRightIcon color="primary" fontSize="small" />
              <Typography variant="body2">
                <strong>{formatNumber(selectedRepo.forks_count)}</strong> Forks
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AdjustIcon color="primary" fontSize="small" />
              <Typography variant="body2">
                <strong>{formatNumber(selectedRepo.open_issues_count)}</strong> Issues
              </Typography>
            </Box>
          </Box>

          {/* Clone URL Box */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              GIT CLONE URL:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.2,
                borderRadius: 1.5,
                border: 1,
                borderColor: 'divider',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
                fontFamily: 'monospace',
                fontSize: '0.85rem'
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                git clone {selectedRepo.clone_url}
              </Typography>
              <Tooltip title="Copy clone command">
                <IconButton size="small" onClick={handleCopyClone}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Languages Breakdown */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}
            >
              <DonutLargeIcon fontSize="small" color="primary" /> Language Breakdown
            </Typography>

            {repoDetails.loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : totalBytes > 0 ? (
              <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            ) : (
              <Alert severity="info" variant="outlined">
                No code language breakdown reported for this repository.
              </Alert>
            )}
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Recent Commits */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}
            >
              <CommitIcon fontSize="small" color="primary" /> Recent Commits
            </Typography>

            {repoDetails.loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : repoDetails.commits && repoDetails.commits.length > 0 ? (
              <List dense sx={{ maxHeight: 250, overflowY: 'auto' }}>
                {repoDetails.commits.map((commitItem) => (
                  <ListItem
                    key={commitItem.sha}
                    sx={{
                      px: 1.5,
                      py: 1,
                      mb: 1,
                      borderRadius: 1.5,
                      border: 1,
                      borderColor: 'divider',
                      backgroundColor: (theme) => theme.palette.action.hover
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {commitItem.commit.message.split('\n')[0]}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {commitItem.commit.author?.name || 'Unknown'} •{' '}
                          {formatRelativeTime(commitItem.commit.author?.date)} (
                          {formatDate(commitItem.commit.author?.date)}) •{' '}
                          <code>{commitItem.sha.substring(0, 7)}</code>
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info" variant="outlined">
                No commit history available or repository is empty.
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button
            href={selectedRepo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
            color="primary"
          >
            View on GitHub
          </Button>
          <Button onClick={handleClose} variant="contained" color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copySnackbar}
        autoHideDuration={2500}
        onClose={() => setCopySnackbar(false)}
        message="Clone command copied to clipboard!"
      />
    </>
  );
};

export default RepoDetailModal;
