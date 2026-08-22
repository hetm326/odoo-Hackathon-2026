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

// Known City-Country Mappings for Destinations without Explicit Country
const CITY_TO_COUNTRY = {
  paris: 'France',
  tokyo: 'Japan',
  kyoto: 'Japan',
  bali: 'Indonesia',
  'new york': 'USA',
  nyc: 'USA',
  rome: 'Italy',
  goa: 'India',
  london: 'UK',
  barcelona: 'Spain',
  sydney: 'Australia',
  dubai: 'UAE',
  berlin: 'Germany',
  amsterdam: 'Netherlands',
  venice: 'Italy',
  santorini: 'Greece',
};

// Extract Country from Destination (e.g. "Paris, France" -> "France", "Tokyo" -> "Japan")
export const extractCountry = (destination) => {
  if (!destination) return '';
  const trimmed = destination.trim();
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',');
    return parts[parts.length - 1].trim();
  }
  const lower = trimmed.toLowerCase();
  if (CITY_TO_COUNTRY[lower]) {
    return CITY_TO_COUNTRY[lower];
  }
  return capitalize(trimmed);
};

// Dynamically resolve trip status based on Start Date, End Date, and Current Date
export const getTripStatus = (startDate, endDate, currentStatus = null) => {
  if (currentStatus && ['cancelled', 'completed', 'ongoing', 'upcoming'].includes(currentStatus.toLowerCase())) {
    // If explicitly set, respect current status unless dates clearly indicate completed past trip
    if (currentStatus.toLowerCase() === 'completed') return 'Completed';
  }

  if (!startDate || !endDate) return 'Upcoming';

  const todayStr = new Date().toISOString().split('T')[0];
  const startStr = new Date(startDate).toISOString().split('T')[0];
  const endStr = new Date(endDate).toISOString().split('T')[0];

  if (endStr < todayStr) {
    return 'Completed';
  }
  if (startStr <= todayStr && endStr >= todayStr) {
    return 'Ongoing';
  }
  return 'Upcoming';
};

// Calculate User Trip Statistics Dynamically
export const calculateUserStats = (trips = []) => {
  const totalTrips = trips.length;
  
  // Unique countries visited
  const countriesSet = new Set();
  trips.forEach((trip) => {
    const country = extractCountry(trip.destination || trip.country);
    if (country) {
      countriesSet.add(country.toLowerCase());
    }
  });

  const countriesVisited = countriesSet.size;

  // Active / Upcoming trips
  const upcomingTrips = trips.filter((t) => {
    const status = getTripStatus(t.startDate, t.endDate, t.status).toLowerCase();
    return status === 'upcoming' || status === 'ongoing' || status === 'active';
  }).length;

  // Completed trips / adventures
  const completedAdventures = trips.filter((t) => {
    const status = getTripStatus(t.startDate, t.endDate, t.status).toLowerCase();
    return status === 'completed';
  }).length;

  // Total budget allocated and spent
  const totalBudget = trips.reduce((acc, t) => acc + (Number(t.totalBudget) || 0), 0);
  const totalSpent = trips.reduce((acc, t) => acc + (Number(t.spentBudget) || 0), 0);

  return {
    totalTrips,
    countriesVisited,
    upcomingTrips,
    completedAdventures,
    totalBudget,
    totalSpent,
  };
};

