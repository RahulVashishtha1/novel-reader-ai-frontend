import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../services/api';

// Async thunks
export const getReadingPreferences = createAsyncThunk(
  'preferences/getReadingPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getReadingPreferences();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get preferences');
    }
  }
);

export const updateReadingPreferences = createAsyncThunk(
  'preferences/updateReadingPreferences',
  async (preferencesData, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateReadingPreferences(preferencesData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update preferences');
    }
  }
);

// Initial state
const initialState = {
  preferences: {
    theme: 'light',
    fontSize: 16,
    fontFamily: 'system-ui',
    lineSpacing: 1.5,
    letterSpacing: 0,
    dyslexiaFriendly: false,
  },
  loading: false,
  error: null,
};

// Preferences slice
const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    setFontSize: (state, action) => {
      state.preferences.fontSize = action.payload;
    },
    setFontFamily: (state, action) => {
      state.preferences.fontFamily = action.payload;
    },
    setLineSpacing: (state, action) => {
      state.preferences.lineSpacing = action.payload;
    },
    setLetterSpacing: (state, action) => {
      state.preferences.letterSpacing = action.payload;
    },
    setDyslexiaFriendly: (state, action) => {
      state.preferences.dyslexiaFriendly = action.payload;
    },
    clearPreferencesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get reading preferences
      .addCase(getReadingPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReadingPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload.preferences;
      })
      .addCase(getReadingPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update reading preferences
      .addCase(updateReadingPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReadingPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload.preferences;
      })
      .addCase(updateReadingPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setTheme,
  setFontSize,
  setFontFamily,
  setLineSpacing,
  setLetterSpacing,
  setDyslexiaFriendly,
  clearPreferencesError,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
