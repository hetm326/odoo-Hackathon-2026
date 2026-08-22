import axios from 'axios';
import { API_BASE_URL } from './endpoints';
import { INITIAL_TRIPS, POPULAR_DESTINATIONS, SAMPLE_ACTIVITIES } from '../utils/constants';

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized / Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('gt_token');
      localStorage.removeItem('gt_user');
    }
    return Promise.reject(error);
  }
);

// Helper Mock Storage Initializer
const initMockStorage = () => {
  if (!localStorage.getItem('gt_trips')) {
    localStorage.setItem('gt_trips', JSON.stringify(INITIAL_TRIPS));
  }
  if (!localStorage.getItem('gt_user')) {
    localStorage.setItem('gt_user', JSON.stringify({
      id: 'usr-1',
      name: 'Alex Rivera',
      email: 'alex@globetrotter.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      homeCity: 'San Francisco, CA',
      travelsCount: 14,
      countriesVisited: 8,
    }));
  }
};
initMockStorage();

// API Service Wrapper (Handles Real API with Mock Fallback for Demo Reliability)
export const ApiService = {
  // Auth Services
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch {
      // Mock Fallback
      const mockUser = JSON.parse(localStorage.getItem('gt_user'));
      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('gt_token', mockToken);
      return { token: mockToken, user: mockUser };
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch {
      // Mock Fallback
      const mockUser = {
        id: 'usr_' + Date.now(),
        name: userData.name || 'Traveler',
        email: userData.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        homeCity: 'New York, USA',
        travelsCount: 1,
        countriesVisited: 1,
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('gt_token', mockToken);
      localStorage.setItem('gt_user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    }
  },

  // Trips Services
  getTrips: async () => {
    try {
      const response = await api.get('/trips');
      return response.data;
    } catch {
      return JSON.parse(localStorage.getItem('gt_trips')) || INITIAL_TRIPS;
    }
  },

  saveTrip: async (tripData) => {
    try {
      const response = await api.post('/trips', tripData);
      return response.data;
    } catch {
      const trips = JSON.parse(localStorage.getItem('gt_trips')) || INITIAL_TRIPS;
      const newTrip = {
        ...tripData,
        id: tripData.id || 'trip-' + Date.now(),
        spentBudget: tripData.spentBudget || 0,
        status: tripData.status || 'Upcoming',
        itineraryDays: tripData.itineraryDays || [],
        expenses: tripData.expenses || [],
      };
      const updatedTrips = [newTrip, ...trips];
      localStorage.setItem('gt_trips', JSON.stringify(updatedTrips));
      return newTrip;
    }
  },

  deleteTrip: async (id) => {
    try {
      await api.delete(`/trips/${id}`);
    } catch {
      const trips = JSON.parse(localStorage.getItem('gt_trips')) || INITIAL_TRIPS;
      const updated = trips.filter(t => t.id !== id);
      localStorage.setItem('gt_trips', JSON.stringify(updated));
    }
  },

  // Search Services
  searchCities: async (query) => {
    try {
      const response = await api.get('/cities/search', { params: { q: query } });
      return response.data;
    } catch {
      if (!query) return POPULAR_DESTINATIONS;
      return POPULAR_DESTINATIONS.filter(d => 
        d.name.toLowerCase().includes(query.toLowerCase()) || 
        d.country.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  searchActivities: async (query, city) => {
    try {
      const response = await api.get('/activities/search', { params: { q: query, city } });
      return response.data;
    } catch {
      let filtered = SAMPLE_ACTIVITIES;
      if (city) {
        filtered = filtered.filter(a => a.city.toLowerCase() === city.toLowerCase());
      }
      if (query) {
        filtered = filtered.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
      }
      return filtered;
    }
  }
};

export default api;
