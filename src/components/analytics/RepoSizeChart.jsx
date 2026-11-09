import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { StorageIcon } from '../common/Icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const RepoSizeChart = ({ repos }) => {
  const darkMode = useSelector((state) => state.ui.darkMode);

  const topSizes = useMemo(() => {
    return [...repos]
      .filter((r) => r.size > 0)
      .sort((a, b) => b.size - a.size)
      .slice(0, 8);
  }, [repos]);

  const categories = topSizes.map((r) =>
    r.name.length > 14 ? `${r.name.substring(0, 12)}...` : r.name
  );
  // Convert KB to MB for cleaner chart display
  const seriesData = topSizes.map((r) => ({
    name: r.name,
    y: parseFloat((r.size / 1024).toFixed(2))
  }));

  const options = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      height: 320
    },
    title: {
      text: null
    },
    xAxis: {
      categories,
      labels: {
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
        text: 'Size (MB)',
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
      pointFormat: '<b>{point.name}</b>: {point.y} MB'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        color: '#a371f7',
        dataLabels: {
          enabled: true,
          format: '{point.y} MB',
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
        name: 'Size',
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
          <StorageIcon sx={{ color: '#a371f7' }} fontSize="small" />
          <Typography variant="h6" fontWeight={700}>
            Repository Storage Footprint
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Largest repositories by disk size in Megabytes (MB)
        </Typography>

        {topSizes.length > 0 ? (
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
            <Typography variant="body2">No repository size data available.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RepoSizeChart;
