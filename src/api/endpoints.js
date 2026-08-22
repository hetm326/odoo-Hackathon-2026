/**
 * GlobeTrotter API Endpoints List (Spring Boot / Express Compatible)
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/register',
  ME: '/auth/me',
  REFRESH_TOKEN: '/auth/refresh',

  // Trips
  TRIPS: '/trips',
  TRIP_BY_ID: (id) => `/trips/${id}`,
  TRIP_ITINERARY: (id) => `/trips/${id}/itinerary`,
  TRIP_EXPENSES: (id) => `/trips/${id}/expenses`,
  PUBLIC_TRIP: (id) => `/trips/shared/${id}`,

  // Search & Destinations
  SEARCH_CITIES: '/cities/search',
  SEARCH_ACTIVITIES: '/activities/search',
  DESTINATION_DETAILS: (id) => `/cities/${id}`,

  // Profile & User
  PROFILE: '/user/profile',
};
