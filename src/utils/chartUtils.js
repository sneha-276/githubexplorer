import { formatWeekDate } from './dateUtils.js';

/**
 * Standard palette of distinct, vibrant colors for contributors in multi-line charts
 */
export const CONTRIBUTOR_COLORS = [
  '#2f81f7', // Blue
  '#3fb950', // Green
  '#d29922', // Amber
  '#a371f7', // Purple
  '#f0883e', // Orange
  '#f85149', // Coral / Red
  '#56d364', // Light green
  '#79c0ff', // Light blue
  '#db61a2', // Pink
  '#e3b341', // Gold
  '#8b949e', // Grey
  '#388bfd', // Deep blue
  '#ff7b72', // Salmon
  '#d2a8ff', // Lavender
  '#bc8cff', // Violet
  '#58a6ff'  // Sky blue
];

/**
 * Aligns weekly data across commit_activity, code_frequency and contributors
 * Returns synchronized timeline with sorted unique week timestamps (up to 52 weeks)
 *
 * @param {Array} commitActivity - Output of /repos/{owner}/{repo}/stats/commit_activity
 * @param {Array} codeFrequency - Output of /repos/{owner}/{repo}/stats/code_frequency
 * @param {Array} contributors - Output of /repos/{owner}/{repo}/stats/contributors
 * @param {'commits' | 'additions' | 'deletions'} metric - Currently selected metric
 */
export const alignWeeklyData = (commitActivity = [], codeFrequency = [], contributors = [], metric = 'commits') => {
  // Build lookup map for code_frequency by week timestamp (normalized to seconds)
  // code_frequency is [timestamp, additions, deletions]
  const codeFreqMap = new Map();
  if (Array.isArray(codeFrequency)) {
    codeFrequency.forEach((entry) => {
      if (Array.isArray(entry) && entry.length >= 3) {
        const week = Math.floor(entry[0]);
        codeFreqMap.set(week, {
          additions: Math.max(0, entry[1] || 0),
          deletions: Math.abs(entry[2] || 0)
        });
      }
    });
  }

  // Build lookup map for commit_activity by week timestamp
  // commit_activity items: { week, total, days }
  const commitActMap = new Map();
  if (Array.isArray(commitActivity)) {
    commitActivity.forEach((entry) => {
      if (entry && entry.week) {
        commitActMap.set(entry.week, entry.total || 0);
      }
    });
  }

  // Collect all unique week timestamps across all sources
  const allWeeksSet = new Set();

  commitActMap.forEach((_, week) => allWeeksSet.add(week));
  codeFreqMap.forEach((_, week) => allWeeksSet.add(week));

  if (Array.isArray(contributors)) {
    contributors.forEach((contrib) => {
      if (contrib?.weeks) {
        contrib.weeks.forEach((w) => {
          if (w?.w) allWeeksSet.add(w.w);
        });
      }
    });
  }

  // Sort weeks chronologically
  let sortedWeeks = Array.from(allWeeksSet).sort((a, b) => a - b);

  // If there are more than 52 weeks, keep the most recent 52 weeks (1 year)
  if (sortedWeeks.length > 52) {
    sortedWeeks = sortedWeeks.slice(sortedWeeks.length - 52);
  }

  // If no data exists, provide a fallback array of the last 12 weeks
  if (sortedWeeks.length === 0) {
    const now = Math.floor(Date.now() / 1000);
    const oneWeek = 7 * 24 * 60 * 60;
    for (let i = 11; i >= 0; i--) {
      sortedWeeks.push(now - i * oneWeek);
    }
  }

  // Formatted categories (week labels) for the shared X-axis
  const categories = sortedWeeks.map((week) => formatWeekDate(week));

  // Build Total Activity Series
  const totalSeriesData = sortedWeeks.map((week) => {
    if (metric === 'commits') {
      return commitActMap.get(week) ?? 0;
    } else if (metric === 'additions') {
      return codeFreqMap.get(week)?.additions ?? 0;
    } else {
      // deletions
      return codeFreqMap.get(week)?.deletions ?? 0;
    }
  });

  // Build Contributor Series
  // Each contributor has author info + weekly data
  const contributorSeries = [];
  if (Array.isArray(contributors)) {
    // Sort contributors by total contributions descending, take top contributors (e.g. top 10-15)
    const sortedContribs = [...contributors].sort((a, b) => (b.total || 0) - (a.total || 0));

    sortedContribs.slice(0, 12).forEach((contrib, index) => {
      const login = contrib.author?.login || `Contributor ${index + 1}`;
      const avatarUrl = contrib.author?.avatar_url || '';

      // Map contributor's weeks
      const contribWeekMap = new Map();
      if (Array.isArray(contrib.weeks)) {
        contrib.weeks.forEach((w) => {
          if (w?.w) {
            let val = 0;
            if (metric === 'commits') {
              val = w.c || 0;
            } else if (metric === 'additions') {
              val = Math.max(0, w.a || 0);
            } else {
              val = Math.abs(w.d || 0);
            }
            contribWeekMap.set(w.w, val);
          }
        });
      }

      const data = sortedWeeks.map((week) => contribWeekMap.get(week) ?? 0);

      contributorSeries.push({
        id: login,
        name: login,
        login: login,
        avatarUrl,
        color: CONTRIBUTOR_COLORS[index % CONTRIBUTOR_COLORS.length],
        data,
        totalMetric: data.reduce((acc, v) => acc + v, 0)
      });
    });
  }

  return {
    weeks: sortedWeeks,
    categories,
    totalSeriesData,
    contributorSeries
  };
};

/**
 * Highcharts theme options generator for light & dark modes
 * @param {boolean} darkMode
 */
export const getHighchartsBaseTheme = (darkMode) => ({
  colors: CONTRIBUTOR_COLORS,
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  },
  title: {
    style: {
      color: darkMode ? '#f0f6fc' : '#1f2328',
      fontSize: '15px',
      fontWeight: '600'
    }
  },
  xAxis: {
    gridLineColor: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
    lineColor: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
    tickColor: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
    labels: {
      style: {
        color: darkMode ? '#8b949e' : '#656d76',
        fontSize: '11px'
      }
    }
  },
  yAxis: {
    gridLineColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    labels: {
      style: {
        color: darkMode ? '#8b949e' : '#656d76',
        fontSize: '11px'
      }
    },
    title: {
      style: {
        color: darkMode ? '#8b949e' : '#656d76',
        fontSize: '12px',
        fontWeight: '500'
      }
    }
  },
  tooltip: {
    backgroundColor: darkMode ? '#161b22' : '#ffffff',
    borderColor: darkMode ? '#30363d' : '#d0d7de',
    borderRadius: 8,
    shadow: true,
    style: {
      color: darkMode ? '#f0f6fc' : '#1f2328',
      fontSize: '12px'
    }
  },
  legend: {
    itemStyle: {
      color: darkMode ? '#c9d1d9' : '#24292f',
      fontWeight: '500',
      fontSize: '12px'
    },
    itemHoverStyle: {
      color: darkMode ? '#58a6ff' : '#0969da'
    },
    itemHiddenStyle: {
      color: darkMode ? '#484f58' : '#8c959f'
    }
  },
  credits: {
    enabled: false
  }
});
