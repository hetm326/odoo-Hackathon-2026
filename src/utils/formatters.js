/**
 * GlobeTrotter Formatters
 */

import { formatCurrency, formatDate, getDaysCount } from './helpers';

export const formatTripDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'TBD';
  const days = getDaysCount(startDate, endDate);
  return `${days} ${days === 1 ? 'day' : 'days'} (${formatDate(startDate)} - ${formatDate(endDate)})`;
};

export const formatBudgetSummary = (spent, total) => {
  return `${formatCurrency(spent)} / ${formatCurrency(total)}`;
};

export const formatTimeSlot = (timeString) => {
  if (!timeString) return 'Flex time';
  return timeString;
};
