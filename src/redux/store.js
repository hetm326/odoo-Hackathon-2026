import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tripReducer from './slices/tripSlice';
import itineraryReducer from './slices/itinerarySlice';
import searchReducer from './slices/searchSlice';
import budgetReducer from './slices/budgetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    itinerary: itineraryReducer,
    search: searchReducer,
    budget: budgetReducer,
  },
});

export default store;
