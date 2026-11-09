import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert
} from '@mui/material';
import { VpnKeyIcon, DeleteOutlineIcon } from './Icons';
import { closeTokenModal, saveToken, removeToken } from '../../features/ui/uiSlice';

const TokenModal = () => {
  const dispatch = useDispatch();
  const { tokenModalOpen, githubToken } = useSelector((state) => state.ui);
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    if (tokenModalOpen) {
      setTokenInput(githubToken || '');
    }
  }, [tokenModalOpen, githubToken]);

  const handleSave = () => {
    dispatch(saveToken(tokenInput.trim()));
    dispatch(closeTokenModal());
  };

  const handleRemove = () => {
    dispatch(removeToken());
    setTokenInput('');
    dispatch(closeTokenModal());
  };

  const handleClose = () => {
    dispatch(closeTokenModal());
  };

  return (
    <Dialog open={tokenModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <VpnKeyIcon color="primary" />
        GitHub Personal Access Token (Optional)
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" paragraph>
          GitHub's free public REST API has a default rate limit of{' '}
          <strong>60 requests per hour</strong> for unauthenticated clients. Adding a
          Personal Access Token increases your limit to{' '}
          <strong>5,000 requests per hour</strong>.
        </Typography>

        <Alert severity="info" sx={{ mb: 2.5 }}>
          Your token is stored <strong>only locally in your browser's localStorage</strong>{' '}
          and is sent directly to <code>api.github.com</code> headers. No scopes are required
          (read-only public access is sufficient).
        </Alert>

        <TextField
          label="Personal Access Token (classic or fine-grained)"
          type="password"
          fullWidth
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          helperText={
            <span>
              Generate a token at{' '}
              <Link
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/settings/tokens
              </Link>
            </span>
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Box>
          {githubToken && (
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleRemove}
            >
              Remove Token
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={tokenInput === (githubToken || '')}
          >
            Save Token
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default TokenModal;
