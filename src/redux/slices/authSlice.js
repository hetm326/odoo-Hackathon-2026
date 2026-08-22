import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../../api/api';

const savedToken = localStorage.getItem('gt_token');
const savedUser = localStorage.getItem('gt_user') ? JSON.parse(localStorage.getItem('gt_user')) : null;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await ApiService.login(credentials);
      if (data.token) {
        localStorage.setItem('gt_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('gt_user', JSON.stringify(data.user));
      }
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
      if (data.token) {
        localStorage.setItem('gt_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('gt_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to signup');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser || null,
    token: savedToken || null,
    isAuthenticated: !!(savedToken && savedUser),
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
      if (!state.user) {
        state.user = {};
      }
      // Only update fields that are provided (not undefined or empty)
      const updatedFields = {};
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined && action.payload[key] !== '') {
          updatedFields[key] = action.payload[key];
        }
      });

      const updatedUser = { ...state.user, ...updatedFields };
      state.user = updatedUser;
      localStorage.setItem('gt_user', JSON.stringify(updatedUser));

      try {
        const users = JSON.parse(localStorage.getItem('gt_users')) || [];
        const index = users.findIndex((u) => u.id === updatedUser.id || u.email === updatedUser.email);
        if (index !== -1) {
          users[index] = updatedUser;
        } else {
          users.push(updatedUser);
        }
        localStorage.setItem('gt_users', JSON.stringify(users));
      } catch {
        // localStorage fallback
      }
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
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
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
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, updateProfile } = authSlice.actions;
export default authSlice.reducer;