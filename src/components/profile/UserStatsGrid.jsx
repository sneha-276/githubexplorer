import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  FolderIcon,
  PeopleIcon,
  PersonAddIcon,
  CodeIcon
} from '../common/Icons';
import { formatNumber } from '../../utils/formatters';

const StatCard = ({ icon, label, value, color }) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2.5,
          '&:last-child': { pb: 2.5 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 2.5,
            backgroundColor: `${color}1A`, // 10% opacity
            color: color
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
            {formatNumber(value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const UserStatsGrid = ({ user }) => {
  if (!user) return null;

  const stats = [
    {
      label: 'Public Repositories',
      value: user.public_repos || 0,
      icon: <FolderIcon fontSize="medium" />,
      color: '#2f81f7'
    },
    {
      label: 'Followers',
      value: user.followers || 0,
      icon: <PeopleIcon fontSize="medium" />,
      color: '#3fb950'
    },
    {
      label: 'Following',
      value: user.following || 0,
      icon: <PersonAddIcon fontSize="medium" />,
      color: '#d29922'
    },
    {
      label: 'Public Gists',
      value: user.public_gists || 0,
      icon: <CodeIcon fontSize="medium" />,
      color: '#a371f7'
    }
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {stats.map((stat) => (
        <Grid item xs={6} md={3} key={stat.label}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default UserStatsGrid;
