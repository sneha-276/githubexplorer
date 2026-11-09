import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ForkRightIcon } from '../common/Icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ForksBarChart = ({ repos }) => {
  const darkMode = useSelector((state) => state.ui.darkMode);

  const topForked = useMemo(() => {
    return [...repos]
      .filter((r) => r.forks_count > 0)
      .sort((a, b) => b.forks_count - a.forks_count)
      .slice(0, 10);
  }, [repos]);

  const categories = topForked.map((r) =>
    r.name.length > 15 ? `${r.name.substring(0, 13)}...` : r.name
  );
  const seriesData = topForked.map((r) => ({
    name: r.name,
    y: r.forks_count
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
        text: 'Forks',
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
      pointFormat: '<b>{point.name}</b>: {point.y} forks'
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        color: '#3fb950',
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
        name: 'Forks',
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
          <ForkRightIcon sx={{ color: '#3fb950' }} fontSize="small" />
          <Typography variant="h6" fontWeight={700}>
            Most Forked Repositories
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Repositories with the highest number of forks/derivatives
        </Typography>

        {topForked.length > 0 ? (
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
            <Typography variant="body2">No forked repositories found.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ForksBarChart;
