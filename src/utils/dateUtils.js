/**
 * Utility functions for date calculations and formatting in GitHub Explorer
 */

/**
 * Calculates dynamic creation date threshold based on selected period
 * @param {'1week' | '2weeks' | '1month'} period
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getTrendingStartDate = (period = '1month') => {
  const now = new Date();
  const targetDate = new Date(now.getTime());

  switch (period) {
    case '1week':
      targetDate.setDate(targetDate.getDate() - 7);
      break;
    case '2weeks':
      targetDate.setDate(targetDate.getDate() - 14);
      break;
    case '1month':
    default:
      // Subtract 1 calendar month safely
      targetDate.setMonth(targetDate.getMonth() - 1);
      break;
  }

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Formats a UNIX timestamp (in seconds or milliseconds) to human-readable week date
 * e.g., 1700000000 -> "15 Nov 2023"
 * @param {number} timestamp - Unix timestamp
 * @returns {string}
 */
export const formatWeekDate = (timestamp) => {
  if (!timestamp) return '';
  // GitHub stats timestamps are in seconds; normalize to ms
  const ms = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formats an ISO date string to readable creation date
 * @param {string} isoString
 * @returns {string}
 */
export const formatCreationDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

