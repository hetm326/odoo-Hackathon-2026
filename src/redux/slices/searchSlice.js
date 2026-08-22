import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../../api/api';

export const executeCitySearch = createAsyncThunk(
  'search/executeCitySearch',
  async (query, { rejectWithValue }) => {
    try {
      const results = await ApiService.searchCities(query);
      return results;
    } catch (err) {
      return rejectWithValue(err.message || 'City search failed');
    }
  }
);

export const executeActivitySearch = createAsyncThunk(
  'search/executeActivitySearch',
  async ({ query, city }, { rejectWithValue }) => {
    try {
      const results = await ApiService.searchActivities(query, city);
      return results;
    } catch (err) {
      return rejectWithValue(err.message || 'Activity search failed');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    cityResults: [],
    activityResults: [],
    cityQuery: '',
    activityQuery: '',
    selectedFilterCategory: 'All',
    loadingCities: false,
    loadingActivities: false,
  },
  reducers: {
    setCityQuery: (state, action) => {
      state.cityQuery = action.payload;
    },
    setActivityQuery: (state, action) => {
      state.activityQuery = action.payload;
    },
    setSelectedFilterCategory: (state, action) => {
      state.selectedFilterCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // City Search
      .addCase(executeCitySearch.pending, (state) => {
        state.loadingCities = true;
      })
      .addCase(executeCitySearch.fulfilled, (state, action) => {
        state.loadingCities = false;
        state.cityResults = action.payload;
      })
      .addCase(executeCitySearch.rejected, (state) => {
        state.loadingCities = false;
      })
      // Activity Search
      .addCase(executeActivitySearch.pending, (state) => {
        state.loadingActivities = true;
      })
      .addCase(executeActivitySearch.fulfilled, (state, action) => {
        state.loadingActivities = false;
        state.activityResults = action.payload;
      })
      .addCase(executeActivitySearch.rejected, (state) => {
        state.loadingActivities = false;
      });
  }
});

export const { setCityQuery, setActivityQuery, setSelectedFilterCategory } = searchSlice.actions;
export default searchSlice.reducer;
