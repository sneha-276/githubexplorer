import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChartIcon } from '../common/Icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getLanguageColor } from '../../utils/colors';

const LanguageDonutChart = ({ repos }) => {
  const darkMode = useSelector((state) => state.ui.darkMode);

  const { chartData, totalReposWithLang } = useMemo(() => {
    const langCounts = {};
    let total = 0;

    repos.forEach((repo) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        total += 1;
      }
    });

    const data = Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        y: count,
        color: getLanguageColor(name)
      }))
      .sort((a, b) => b.y - a.y);

    return { chartData: data, totalReposWithLang: total };
  }, [repos]);

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 320
    },
    title: {
      text: null
    },
    tooltip: {
      headerFormat: '',
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b>{point.name}</b><br/>' +
        'Repositories: <b>{point.y}</b> ({point.percentage:.1f}%)'
    },
    plotOptions: {
      pie: {
        innerSize: '60%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.0f}%',
          distance: 15,
          style: {
            color: darkMode ? '#f0f6fc' : '#1f2328',
            fontSize: '11px',
            textOutline: 'none',
            fontWeight: 500
          }
        },
        showInLegend: false
      }
    },
    series: [
      {
        name: 'Repositories',
        data: chartData
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
          <PieChartIcon color="primary" fontSize="small" />
          <Typography variant="h6" fontWeight={700}>
            Language Distribution
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Breakdown of top programming languages across {totalReposWithLang} repositories
        </Typography>

        {chartData.length > 0 ? (
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
            <Typography variant="body2">No language data available.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguageDonutChart;
