// src/utils/helpers.js
// Shared helper utilities

export { getStatusClasses, getStatusLabel } from './status';
export { formatDate, daysRemaining, isPastDate, toDateInputValue } from './date';

/**
 * Capitalize first letter.
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
