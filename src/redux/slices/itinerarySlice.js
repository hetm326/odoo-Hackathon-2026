import { createSlice } from '@reduxjs/toolkit';

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState: {
    activeDay: 1,
    isAddingStop: false,
    selectedCategory: 'all',
    searchCity: '',
  },
  reducers: {
    setActiveDay: (state, action) => {
      state.activeDay = action.payload;
    },
    setIsAddingStop: (state, action) => {
      state.isAddingStop = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchCity: (state, action) => {
      state.searchCity = action.payload;
    }
  }
});

export const { setActiveDay, setIsAddingStop, setSelectedCategory, setSearchCity } = itinerarySlice.actions;
export default itinerarySlice.reducer;
