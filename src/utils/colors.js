/**
 * Official GitHub programming language colors mapping
 */
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  C: '#555555',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Vue: '#41b883',
  R: '#198CE7',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Haskell: '#5e5086',
  Lua: '#000080',
  Perl: '#0298c3',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  Other: '#8b949e'
};

/**
 * Returns color for a given language, fallback to a consistent hash color or default
 * @param {string} language
 * @returns {string}
 */
export const getLanguageColor = (language) => {
  if (!language) return LANGUAGE_COLORS.Other;
  if (LANGUAGE_COLORS[language]) {
    return LANGUAGE_COLORS[language];
  }
  // Generate consistent hex color from string hash if not in list
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

/**
 * Highcharts color palettes for charts
 */
export const CHART_PALETTE = [
  '#2f81f7',
  '#3fb950',
  '#d29922',
  '#db61a2',
  '#a371f7',
  '#f0883e',
  '#56d4dd',
  '#ff7b72',
  '#79c0ff',
  '#7ee787'
];

