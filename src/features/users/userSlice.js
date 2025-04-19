import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../services/api';

// Async thunks
export const getUserProfile = createAsyncThunk(
  'users/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get profile');
    }
  }
);

export const getUserStats = createAsyncThunk(
  'users/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get stats');
    }
  }
);

export const updateReadingStats = createAsyncThunk(
  'users/updateStats',
  async (statsData, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateStats(statsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update stats');
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get users');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await userAPI.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to delete user');
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  stats: null,
  novelsWithProgress: [],
  allUsers: [],
  loading: false,
  error: null,
};

// User slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user stats
      .addCase(getUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.novelsWithProgress = action.payload.novelsWithProgress;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update reading stats
      .addCase(updateReadingStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      })
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = state.allUsers.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
