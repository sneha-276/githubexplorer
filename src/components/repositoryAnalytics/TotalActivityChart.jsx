import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getHighchartsBaseTheme } from '../../utils/chartUtils';
import { BarChartIcon } from '../common/Icons';

const METRIC_CONFIG = {
  commits: {
    label: 'Total Commits',
    color: '#2f81f7',
    fillColor: 'rgba(47, 129, 247, 0.15)',
    unit: 'commits'
  },
  additions: {
    label: 'Total Additions',
    color: '#3fb950',
    fillColor: 'rgba(63, 185, 80, 0.15)',
    unit: 'lines added'
  },
  deletions: {
    label: 'Total Deletions',
    color: '#f85149',
    fillColor: 'rgba(248, 81, 73, 0.15)',
    unit: 'lines deleted'
  }
};

const TotalActivityChart = ({ categories, data, metric }) => {
  const darkMode = useSelector((state) => state.ui.darkMode);

  const config = METRIC_CONFIG[metric] || METRIC_CONFIG.commits;

  const chartOptions = useMemo(() => {
    const baseTheme = getHighchartsBaseTheme(darkMode);

    return {
      ...baseTheme,
      chart: {
        ...baseTheme.chart,
        type: 'area',
        height: 320
      },
      title: {
        text: 'Total Repository Activity',
        align: 'left',
        style: {
          ...baseTheme.title.style,
          fontSize: '16px'
        }
      },
      subtitle: {
        text: `Weekly ${config.label.toLowerCase()} over time`,
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
          text: config.label
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
              <div style="font-size: 13px; font-weight: 700; color: ${config.color};">
                ${config.label}: ${this.y?.toLocaleString() || 0}
              </div>
            </div>
          `;
        }
      },
      plotOptions: {
        area: {
          marker: {
            radius: 2,
            symbol: 'circle',
            states: {
              hover: {
                radius: 5
              }
            }
          },
          lineWidth: 2.5,
          states: {
            hover: {
              lineWidth: 3
            }
          },
          threshold: null
        }
      },
      series: [
        {
          name: config.label,
          data: data || [],
          color: config.color,
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, config.fillColor],
              [1, 'rgba(0, 0, 0, 0)']
            ]
          }
        }
      ],
      legend: {
        enabled: false
      }
    };
  }, [categories, data, metric, darkMode, config]);

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
      </CardContent>
    </Card>
  );
};

export default TotalActivityChart;

