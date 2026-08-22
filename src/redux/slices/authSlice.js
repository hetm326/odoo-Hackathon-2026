import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../../api/api';

const savedToken = localStorage.getItem('gt_token');
const savedUser = localStorage.getItem('gt_user') ? JSON.parse(localStorage.getItem('gt_user')) : null;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await ApiService.login(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to login');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await ApiService.signup(userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to signup');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser || {
      id: 'usr-1',
      name: 'Alex Rivera',
      email: 'alex@globetrotter.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      homeCity: 'San Francisco, CA',
      travelsCount: 14,
      countriesVisited: 8,
    },
    token: savedToken || 'demo_token_123',
    isAuthenticated: true,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('gt_token');
      localStorage.removeItem('gt_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('gt_user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
