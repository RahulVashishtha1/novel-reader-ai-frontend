import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { annotationAPI } from '../../services/api';

// Async thunks
export const getAnnotations = createAsyncThunk(
  'annotations/getAnnotations',
  async (novelId, { rejectWithValue }) => {
    try {
      const response = await annotationAPI.getAnnotations(novelId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get annotations');
    }
  }
);

export const getPageAnnotations = createAsyncThunk(
  'annotations/getPageAnnotations',
  async ({ novelId, page }, { rejectWithValue }) => {
    try {
      const response = await annotationAPI.getPageAnnotations(novelId, page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get page annotations');
    }
  }
);

export const createAnnotation = createAsyncThunk(
  'annotations/createAnnotation',
  async ({ novelId, annotationData }, { rejectWithValue }) => {
    try {
      const response = await annotationAPI.createAnnotation(novelId, annotationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to create annotation');
    }
  }
);

export const updateAnnotation = createAsyncThunk(
  'annotations/updateAnnotation',
  async ({ annotationId, annotationData }, { rejectWithValue }) => {
    try {
      const response = await annotationAPI.updateAnnotation(annotationId, annotationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update annotation');
    }
  }
);

export const deleteAnnotation = createAsyncThunk(
  'annotations/deleteAnnotation',
  async (annotationId, { rejectWithValue }) => {
    try {
      const response = await annotationAPI.deleteAnnotation(annotationId);
      return { annotationId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to delete annotation');
    }
  }
);

// Initial state
const initialState = {
  annotations: [],
  pageAnnotations: [],
  loading: false,
  error: null,
  currentAnnotation: null,
};

// Annotations slice
const annotationsSlice = createSlice({
  name: 'annotations',
  initialState,
  reducers: {
    clearAnnotations: (state) => {
      state.annotations = [];
      state.pageAnnotations = [];
      state.currentAnnotation = null;
    },
    setCurrentAnnotation: (state, action) => {
      state.currentAnnotation = action.payload;
    },
    clearCurrentAnnotation: (state) => {
      state.currentAnnotation = null;
    },
    clearAnnotationsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all annotations
      .addCase(getAnnotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnnotations.fulfilled, (state, action) => {
        state.loading = false;
        state.annotations = action.payload.annotations;
      })
      .addCase(getAnnotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get page annotations
      .addCase(getPageAnnotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPageAnnotations.fulfilled, (state, action) => {
        state.loading = false;
        state.pageAnnotations = action.payload.annotations;
      })
      .addCase(getPageAnnotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create annotation
      .addCase(createAnnotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnotation.fulfilled, (state, action) => {
        state.loading = false;
        state.pageAnnotations.push(action.payload.annotation);
        state.annotations.push(action.payload.annotation);
        state.currentAnnotation = action.payload.annotation;
      })
      .addCase(createAnnotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update annotation
      .addCase(updateAnnotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnnotation.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in pageAnnotations
        const pageIndex = state.pageAnnotations.findIndex(
          (a) => a._id === action.payload.annotation._id
        );
        if (pageIndex !== -1) {
          state.pageAnnotations[pageIndex] = action.payload.annotation;
        }
        
        // Update in annotations
        const index = state.annotations.findIndex(
          (a) => a._id === action.payload.annotation._id
        );
        if (index !== -1) {
          state.annotations[index] = action.payload.annotation;
        }
        
        // Update currentAnnotation if it's the same one
        if (state.currentAnnotation && state.currentAnnotation._id === action.payload.annotation._id) {
          state.currentAnnotation = action.payload.annotation;
        }
      })
      .addCase(updateAnnotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete annotation
      .addCase(deleteAnnotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnnotation.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove from pageAnnotations
        state.pageAnnotations = state.pageAnnotations.filter(
          (a) => a._id !== action.payload.annotationId
        );
        
        // Remove from annotations
        state.annotations = state.annotations.filter(
          (a) => a._id !== action.payload.annotationId
        );
        
        // Clear currentAnnotation if it's the same one
        if (state.currentAnnotation && state.currentAnnotation._id === action.payload.annotationId) {
          state.currentAnnotation = null;
        }
      })
      .addCase(deleteAnnotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAnnotations,
  setCurrentAnnotation,
  clearCurrentAnnotation,
  clearAnnotationsError,
} = annotationsSlice.actions;

export default annotationsSlice.reducer;
