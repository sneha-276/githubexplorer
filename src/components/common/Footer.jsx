import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: (theme) => theme.palette.background.paper,
        textAlign: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          Built with React, Vite, Redux Toolkit, Redux Saga, Material UI & Highcharts.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Powered by the official{' '}
          <Link
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            underline="hover"
          >
            GitHub REST API
          </Link>
          . Free tier unauthenticated rate limits apply (60 req/hr).
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

