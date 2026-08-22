/**
 * GlobeTrotter Helper Utilities
 */

// Format Currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format Date (e.g., Oct 15, 2026)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Format Short Date (e.g., Oct 15)
export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Calculate Days between two dates
export const getDaysCount = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

// Calculate percentage spent
export const calculateSpentPercentage = (spent, total) => {
  if (!total || total <= 0) return 0;
  const percent = Math.round((spent / total) * 100);
  return Math.min(percent, 100);
};

// Generate Unique ID
export const generateId = () => {
  return 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
};

// Validate Email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Validate Password (min 6 chars)
export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

// Capitalize String
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate Text
export const truncateText = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get Status Color Pill Class
export const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'ongoing':
    case 'active':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'completed':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'cancelled':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

// Get Category Icon / Color Class
export const getCategoryMeta = (category) => {
  switch (category?.toLowerCase()) {
    case 'accommodation':
    case 'hotel':
      return { label: 'Hotel & Stay', color: '#0ea5e9', bg: 'bg-sky-500/20 text-sky-400' };
    case 'flight':
    case 'transport':
      return { label: 'Transportation', color: '#14b8a6', bg: 'bg-teal-500/20 text-teal-400' };
    case 'food':
    case 'dining':
      return { label: 'Food & Dining', color: '#f97316', bg: 'bg-orange-500/20 text-orange-400' };
    case 'activity':
    case 'sightseeing':
      return { label: 'Activities', color: '#a855f7', bg: 'bg-purple-500/20 text-purple-400' };
    case 'shopping':
      return { label: 'Shopping', color: '#ec4899', bg: 'bg-pink-500/20 text-pink-400' };
    default:
      return { label: 'Miscellaneous', color: '#64748b', bg: 'bg-slate-500/20 text-slate-400' };
  }
};
