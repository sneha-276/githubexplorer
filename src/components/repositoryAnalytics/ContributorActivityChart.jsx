import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, Typography, Box, Alert } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getHighchartsBaseTheme } from '../../utils/chartUtils';
import ContributorLegend from './ContributorLegend';
import { toggleContributorVisibility } from '../../features/analytics/analyticsSlice';

const METRIC_LABELS = {
  commits: 'Commits',
  additions: 'Additions',
  deletions: 'Deletions'
};

const ContributorActivityChart = ({ categories, series = [], metric }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const hiddenContributors = useSelector((state) => state.analytics.hiddenContributors);

  const metricLabel = METRIC_LABELS[metric] || 'Commits';

  // Filter or hide series according to Redux state
  const chartSeries = useMemo(() => {
    return series.map((s) => ({
      name: s.login,
      id: s.login,
      data: s.data,
      color: s.color,
      visible: !hiddenContributors[s.login],
      lineWidth: 2,
      marker: {
        radius: 2,
        symbol: 'circle'
      }
    }));
  }, [series, hiddenContributors]);

  const chartOptions = useMemo(() => {
    const baseTheme = getHighchartsBaseTheme(darkMode);

    return {
      ...baseTheme,
      chart: {
        ...baseTheme.chart,
        type: 'spline',
        height: 380
      },
      title: {
        text: 'Contributor Activity',
        align: 'left',
        style: {
          ...baseTheme.title.style,
          fontSize: '16px'
        }
      },
      subtitle: {
        text: `Weekly breakdown of ${metricLabel.toLowerCase()} by contributor`,
        align: 'left',
        style: {
          color: darkMode ? '#8b949e' : '#656d76',
          fontSize: '12px'
        }
      },
      xAxis: {
        ...baseTheme.xAxis,
        categories,
        crosshair: {
          width: 1,
          color: darkMode ? '#30363d' : '#d0d7de',
          dashStyle: 'Dash'
        },
        labels: {
          ...baseTheme.xAxis.labels,
          step: Math.max(1, Math.floor(categories.length / 8)),
          rotation: -25
        }
      },
      yAxis: {
        ...baseTheme.yAxis,
        min: 0,
        title: {
          ...baseTheme.yAxis.title,
          text: metricLabel
        }
      },
      tooltip: {
        ...baseTheme.tooltip,
        useHTML: true,
        formatter: function () {
          return `
            <div style="padding: 4px;">
              <div style="font-size: 11px; color: ${darkMode ? '#8b949e' : '#656d76'}; margin-bottom: 4px;">
                Week starting: <b>${this.x}</b>
              </div>
              <div style="font-size: 12px; margin-bottom: 2px;">
                Contributor: <b style="color: ${this.series.color};">${this.series.name}</b>
              </div>
              <div style="font-size: 13px; font-weight: 700; color: ${this.series.color};">
                ${metricLabel}: ${this.y?.toLocaleString() || 0}
              </div>
            </div>
          `;
        }
      },
      plotOptions: {
        spline: {
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 3.5
            }
          },
          events: {
            legendItemClick: function (e) {
              e.preventDefault();
              dispatch(toggleContributorVisibility(this.name));
            }
          }
        }
      },
      legend: {
        enabled: false // We use our rich custom ContributorLegend component with avatars and metrics
      },
      series: chartSeries
    };
  }, [categories, chartSeries, metricLabel, darkMode, dispatch]);

  if (!series || series.length === 0) {
    return (
      <Card sx={{ borderRadius: 2.5, border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Contributor Activity
          </Typography>
          <Alert severity="info" variant="outlined">
            No contributor activity data available for this repository.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 2.5,
        border: 1,
        borderColor: 'divider',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 16px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        <ContributorLegend contributors={series} metric={metric} />
      </CardContent>
    </Card>
  );
};

export default ContributorActivityChart;

