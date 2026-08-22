import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../../api/api';

export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiService.getTrips();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load trips');
    }
  }
);

export const createNewTrip = createAsyncThunk(
  'trips/createNewTrip',
  async (tripData, { rejectWithValue }) => {
    try {
      const newTrip = await ApiService.saveTrip(tripData);
      return newTrip;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create trip');
    }
  }
);

export const deleteTripById = createAsyncThunk(
  'trips/deleteTripById',
  async (id, { rejectWithValue }) => {
    try {
      await ApiService.deleteTrip(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete trip');
    }
  }
);

const tripSlice = createSlice({
  name: 'trips',
  initialState: {
    trips: [],
    selectedTrip: null,
    statusFilter: 'All', // 'All' | 'Upcoming' | 'Ongoing' | 'Completed'
    searchQuery: '',
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedTrip: (state, action) => {
      const found = state.trips.find(t => t.id === action.payload);
      state.selectedTrip = found || null;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addExpenseToTrip: (state, action) => {
      const { tripId, expense } = action.payload;
      const trip = state.trips.find(t => t.id === tripId);
      if (trip) {
        if (!trip.expenses) trip.expenses = [];
        trip.expenses.push(expense);
        trip.spentBudget = (trip.spentBudget || 0) + Number(expense.amount);
        if (state.selectedTrip?.id === tripId) {
          state.selectedTrip = { ...trip };
        }
        localStorage.setItem('gt_trips', JSON.stringify(state.trips));
      }
    },
    addStopToItinerary: (state, action) => {
      const { tripId, dayNumber, stop } = action.payload;
      const trip = state.trips.find(t => t.id === tripId);
      if (trip) {
        if (!trip.itineraryDays) trip.itineraryDays = [];
        let dayObj = trip.itineraryDays.find(d => d.day === dayNumber);
        if (!dayObj) {
          dayObj = { day: dayNumber, title: `Day ${dayNumber}`, stops: [] };
          trip.itineraryDays.push(dayObj);
        }
        dayObj.stops.push(stop);
        if (state.selectedTrip?.id === tripId) {
          state.selectedTrip = { ...trip };
        }
        localStorage.setItem('gt_trips', JSON.stringify(state.trips));
      }
    },
    removeExpenseFromTrip: (state, action) => {
      const { tripId, expenseId } = action.payload;
      const trip = state.trips.find(t => t.id === tripId);
      if (trip && trip.expenses) {
        const foundExp = trip.expenses.find(e => e.id === expenseId);
        if (foundExp) {
          trip.spentBudget = Math.max(0, (trip.spentBudget || 0) - Number(foundExp.amount));
          trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
          if (state.selectedTrip?.id === tripId) {
            state.selectedTrip = { ...trip };
          }
          localStorage.setItem('gt_trips', JSON.stringify(state.trips));
        }
      }
    },
    removeStopFromItinerary: (state, action) => {
      const { tripId, dayNumber, stopId } = action.payload;
      const trip = state.trips.find(t => t.id === tripId);
      if (trip && trip.itineraryDays) {
        const dayObj = trip.itineraryDays.find(d => d.day === dayNumber);
        if (dayObj && dayObj.stops) {
          dayObj.stops = dayObj.stops.filter(s => s.id !== stopId);
          if (state.selectedTrip?.id === tripId) {
            state.selectedTrip = { ...trip };
          }
          localStorage.setItem('gt_trips', JSON.stringify(state.trips));
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
        if (action.payload.length > 0 && !state.selectedTrip) {
          state.selectedTrip = action.payload[0];
        }
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Trip
      .addCase(createNewTrip.fulfilled, (state, action) => {
        state.trips.unshift(action.payload);
        state.selectedTrip = action.payload;
      })
      // Delete Trip
      .addCase(deleteTripById.fulfilled, (state, action) => {
        state.trips = state.trips.filter(t => t.id !== action.payload);
        if (state.selectedTrip?.id === action.payload) {
          state.selectedTrip = state.trips[0] || null;
        }
      });
  },
});

export const {
  setSelectedTrip,
  setStatusFilter,
  setSearchQuery,
  addExpenseToTrip,
  addStopToItinerary,
  removeExpenseFromTrip,
  removeStopFromItinerary
} = tripSlice.actions;

export default tripSlice.reducer;
