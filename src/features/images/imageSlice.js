import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { imageAPI } from '../../services/api';

// Async thunks
export const generateImage = createAsyncThunk(
  'images/generate',
  async ({ novelId, page, style }, { rejectWithValue }) => {
    try {
      console.log(`Generating image for novel ${novelId}, page ${page}, style ${style}`);
      const response = await imageAPI.generateImage(novelId, page, style);
      console.log("Image generation response:", response);
      console.log("Image data:", response.data);

      // Check if the image has an error field
      if (response.data.image && response.data.image.error) {
        console.warn('Image generated with error:', response.data.image.error);
      }

      return response.data;
    } catch (error) {
      console.error('Image generation failed:', error);
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.data);
        return rejectWithValue(error.response.data.message || 'Image generation failed');
      }
      return rejectWithValue(error.message || 'Image generation failed');
    }
  }
);

export const getImagesForPage = createAsyncThunk(
  'images/getImagesForPage',
  async ({ novelId, page }, { rejectWithValue }) => {
    try {
      console.log(`Getting images for novel ${novelId}, page ${page}`);
      const response = await imageAPI.getImagesForPage(novelId, page);
      console.log('Images for page response:', response.data);

      // Log if no images were found
      if (!response.data.images || response.data.images.length === 0) {
        console.log('No images found for this page');
      }

      return response.data;
    } catch (error) {
      console.error('Failed to get images:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to get images');
      }
      return rejectWithValue(error.message || 'Failed to get images');
    }
  }
);

export const getAllImageLogs = createAsyncThunk(
  'images/getAllLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await imageAPI.getAllImageLogs();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get image logs');
    }
  }
);

// Initial state
const initialState = {
  currentImages: [],
  allLogs: [],
  generatingImage: false,
  loading: false,
  error: null,
};

// Image slice
const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearImageError: (state) => {
      state.error = null;
    },
    clearCurrentImages: (state) => {
      state.currentImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate image
      .addCase(generateImage.pending, (state) => {
        state.generatingImage = true;
        state.error = null;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.generatingImage = false;
        state.currentImages.unshift(action.payload.image);
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.generatingImage = false;
        state.error = action.payload;
      })
      // Get images for page
      .addCase(getImagesForPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getImagesForPage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentImages = action.payload.images;
      })
      .addCase(getImagesForPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all image logs
      .addCase(getAllImageLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllImageLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.allLogs = action.payload.logs;
      })
      .addCase(getAllImageLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImageError, clearCurrentImages } = imageSlice.actions;
export default imageSlice.reducer;
