import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse
} from '@mui/material';
import { RefreshIcon, VpnKeyIcon } from './Icons';
import { openTokenModal } from '../../features/ui/uiSlice';

const ErrorAlert = ({ message, onRetry }) => {
  const dispatch = useDispatch();

  if (!message) return null;

  const isRateLimitError =
    message.toLowerCase().includes('rate limit') ||
    message.toLowerCase().includes('403');

  return (
    <Collapse in={Boolean(message)}>
      <Box sx={{ my: 3 }}>
        <Alert
          severity="error"
          variant="filled"
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {isRateLimitError && (
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  startIcon={<VpnKeyIcon />}
                  onClick={() => dispatch(openTokenModal())}
                  sx={{ borderColor: 'rgba(255,255,255,0.7)' }}
                >
                  Add Token
                </Button>
              )}
              {onRetry && (
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={onRetry}
                >
                  Retry
                </Button>
              )}
            </Box>
          }
        >
          <AlertTitle sx={{ fontWeight: 700 }}>
            {isRateLimitError ? 'Rate Limit Exceeded' : 'Error'}
          </AlertTitle>
          {message}
        </Alert>
      </Box>
    </Collapse>
  );
};

export default ErrorAlert;
