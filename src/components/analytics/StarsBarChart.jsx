import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { StarIcon } from '../common/Icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const StarsBarChart = ({ repos }) => {
  const darkMode = useSelector((state) => state.ui.darkMode);

  const topStarred = useMemo(() => {
    return [...repos]
      .filter((r) => r.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);
  }, [repos]);

  const categories = topStarred.map((r) =>
    r.name.length > 15 ? `${r.name.substring(0, 13)}...` : r.name
  );
  const seriesData = topStarred.map((r) => ({
    name: r.name,
    y: r.stargazers_count
  }));

  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 320
    },
    title: {
      text: null
    },
    xAxis: {
      categories,
      labels: {
        rotation: -30,
        style: {
          color: darkMode ? '#8b949e' : '#656d76',
          fontSize: '11px'
        }
      },
      lineColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Stars',
        style: {
          color: darkMode ? '#8b949e' : '#656d76'
        }
      },
      gridLineColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      labels: {
        style: {
          color: darkMode ? '#8b949e' : '#656d76'
        }
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '<b>{point.name}</b>: {point.y} \u2605'
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        color: '#2f81f7',
        dataLabels: {
          enabled: true,
          style: {
            color: darkMode ? '#f0f6fc' : '#1f2328',
            fontSize: '10px',
            textOutline: 'none'
          }
        }
      }
    },
    series: [
      {
        name: 'Stars',
        data: seriesData
      }
    ],
    credits: {
      enabled: false
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <StarIcon sx={{ color: '#d29922' }} fontSize="small" />
          <Typography variant="h6" fontWeight={700}>
            Top Starred Repositories
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Repositories with the highest community star count
        </Typography>

        {topStarred.length > 0 ? (
          <HighchartsReact highcharts={Highcharts} options={options} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 240,
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">No starred repositories found.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StarsBarChart;
