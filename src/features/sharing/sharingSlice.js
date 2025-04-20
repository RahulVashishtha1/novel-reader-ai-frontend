import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sharingAPI } from '../../services/api';

// Async thunks
export const getSharedContent = createAsyncThunk(
  'sharing/getSharedContent',
  async (shareId, { rejectWithValue }) => {
    try {
      const response = await sharingAPI.getSharedContent(shareId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get shared content');
    }
  }
);

export const sharePassage = createAsyncThunk(
  'sharing/sharePassage',
  async ({ novelId, passageData }, { rejectWithValue }) => {
    try {
      const response = await sharingAPI.sharePassage(novelId, passageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to share passage');
    }
  }
);

export const shareProgress = createAsyncThunk(
  'sharing/shareProgress',
  async ({ novelId, progressData }, { rejectWithValue }) => {
    try {
      const response = await sharingAPI.shareProgress(novelId, progressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to share progress');
    }
  }
);

export const generateSocialImage = createAsyncThunk(
  'sharing/generateSocialImage',
  async (shareId, { rejectWithValue }) => {
    try {
      const response = await sharingAPI.generateSocialImage(shareId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to generate social image');
    }
  }
);

export const getUserSharedContent = createAsyncThunk(
  'sharing/getUserSharedContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sharingAPI.getUserSharedContent();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get user shared content');
    }
  }
);

export const deleteSharedContent = createAsyncThunk(
  'sharing/deleteSharedContent',
  async (shareId, { rejectWithValue }) => {
    try {
      const response = await sharingAPI.deleteSharedContent(shareId);
      return { shareId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to delete shared content');
    }
  }
);

// Initial state
const initialState = {
  sharedContent: null,
  userSharedContent: [],
  socialImage: null,
  loading: false,
  error: null,
};

// Sharing slice
const sharingSlice = createSlice({
  name: 'sharing',
  initialState,
  reducers: {
    clearSharedContent: (state) => {
      state.sharedContent = null;
      state.socialImage = null;
    },
    clearSharingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get shared content
      .addCase(getSharedContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSharedContent.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedContent = action.payload.sharedContent;
      })
      .addCase(getSharedContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Share passage
      .addCase(sharePassage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sharePassage.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedContent = action.payload.sharedContent;
        state.userSharedContent.unshift(action.payload.sharedContent);
      })
      .addCase(sharePassage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Share progress
      .addCase(shareProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedContent = action.payload.sharedContent;
        state.userSharedContent.unshift(action.payload.sharedContent);
      })
      .addCase(shareProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate social image
      .addCase(generateSocialImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSocialImage.fulfilled, (state, action) => {
        state.loading = false;
        state.socialImage = action.payload;
      })
      .addCase(generateSocialImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user shared content
      .addCase(getUserSharedContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserSharedContent.fulfilled, (state, action) => {
        state.loading = false;
        state.userSharedContent = action.payload.sharedContent;
      })
      .addCase(getUserSharedContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete shared content
      .addCase(deleteSharedContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSharedContent.fulfilled, (state, action) => {
        state.loading = false;
        state.userSharedContent = state.userSharedContent.filter(
          (content) => content.shareId !== action.payload.shareId
        );
        if (state.sharedContent && state.sharedContent.shareId === action.payload.shareId) {
          state.sharedContent = null;
        }
      })
      .addCase(deleteSharedContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSharedContent, clearSharingError } = sharingSlice.actions;

export default sharingSlice.reducer;
