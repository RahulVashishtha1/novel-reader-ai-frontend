import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { novelAPI } from '../../services/api';

// Async thunks
export const uploadNovel = createAsyncThunk(
  'novels/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await novelAPI.uploadNovel(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Upload failed');
    }
  }
);

export const getUserNovels = createAsyncThunk(
  'novels/getUserNovels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await novelAPI.getUserNovels();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get novels');
    }
  }
);

export const getNovel = createAsyncThunk(
  'novels/getNovel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await novelAPI.getNovel(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get novel');
    }
  }
);

export const getNovelPage = createAsyncThunk(
  'novels/getNovelPage',
  async ({ id, page }, { rejectWithValue }) => {
    try {
      const response = await novelAPI.getNovelPage(id, page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get page');
    }
  }
);

export const deleteNovel = createAsyncThunk(
  'novels/deleteNovel',
  async (id, { rejectWithValue }) => {
    try {
      await novelAPI.deleteNovel(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to delete novel');
    }
  }
);

export const addBookmark = createAsyncThunk(
  'novels/addBookmark',
  async ({ id, bookmarkData }, { rejectWithValue }) => {
    try {
      const response = await novelAPI.addBookmark(id, bookmarkData);
      return { id, bookmarks: response.data.bookmarks };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to add bookmark');
    }
  }
);

export const removeBookmark = createAsyncThunk(
  'novels/removeBookmark',
  async ({ id, bookmarkId }, { rejectWithValue }) => {
    try {
      const response = await novelAPI.removeBookmark(id, bookmarkId);
      return { id, bookmarks: response.data.bookmarks };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to remove bookmark');
    }
  }
);

export const addNote = createAsyncThunk(
  'novels/addNote',
  async ({ id, noteData }, { rejectWithValue }) => {
    try {
      const response = await novelAPI.addNote(id, noteData);
      return { id, notes: response.data.notes };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to add note');
    }
  }
);

export const updateNote = createAsyncThunk(
  'novels/updateNote',
  async ({ id, noteId, noteData }, { rejectWithValue }) => {
    try {
      const response = await novelAPI.updateNote(id, noteId, noteData);
      return { id, notes: response.data.notes };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update note');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'novels/deleteNote',
  async ({ id, noteId }, { rejectWithValue }) => {
    try {
      const response = await novelAPI.deleteNote(id, noteId);
      return { id, notes: response.data.notes };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to delete note');
    }
  }
);

export const updateReadingProgress = createAsyncThunk(
  'novels/updateReadingProgress',
  async ({ id, progressData }, { rejectWithValue }) => {
    try {
      const response = await novelAPI.updateReadingProgress(id, progressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update progress');
    }
  }
);

export const getAllNovels = createAsyncThunk(
  'novels/getAllNovels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await novelAPI.getAllNovels();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to get all novels');
    }
  }
);

// Initial state
const initialState = {
  novels: [],
  currentNovel: null,
  currentPage: {
    content: '',
    pageNumber: 1,
    totalPages: 0,
    metadata: null,
  },
  loading: false,
  error: null,
};

// Novel slice
const novelSlice = createSlice({
  name: 'novels',
  initialState,
  reducers: {
    clearNovelError: (state) => {
      state.error = null;
    },
    clearCurrentNovel: (state) => {
      state.currentNovel = null;
      state.currentPage = {
        content: '',
        pageNumber: 1,
        totalPages: 0,
        metadata: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload novel
      .addCase(uploadNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadNovel.fulfilled, (state, action) => {
        state.loading = false;
        state.novels.unshift(action.payload.novel);
      })
      .addCase(uploadNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user novels
      .addCase(getUserNovels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNovels.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = action.payload.novels;
      })
      .addCase(getUserNovels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get novel
      .addCase(getNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNovel.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNovel = action.payload.novel;
      })
      .addCase(getNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get novel page
      .addCase(getNovelPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNovelPage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPage = {
          content: action.payload.content,
          pageNumber: action.payload.page,
          totalPages: action.payload.totalPages,
          metadata: action.payload.metadata || null,
        };
      })
      .addCase(getNovelPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete novel
      .addCase(deleteNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNovel.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = state.novels.filter((novel) => novel._id !== action.payload);
        if (state.currentNovel && state.currentNovel._id === action.payload) {
          state.currentNovel = null;
        }
      })
      .addCase(deleteNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add bookmark
      .addCase(addBookmark.fulfilled, (state, action) => {
        if (state.currentNovel && state.currentNovel._id === action.payload.id) {
          state.currentNovel.bookmarks = action.payload.bookmarks;
        }
      })
      // Remove bookmark
      .addCase(removeBookmark.fulfilled, (state, action) => {
        if (state.currentNovel && state.currentNovel._id === action.payload.id) {
          state.currentNovel.bookmarks = action.payload.bookmarks;
        }
      })
      // Add note
      .addCase(addNote.fulfilled, (state, action) => {
        if (state.currentNovel && state.currentNovel._id === action.payload.id) {
          state.currentNovel.notes = action.payload.notes;
        }
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        if (state.currentNovel && state.currentNovel._id === action.payload.id) {
          state.currentNovel.notes = action.payload.notes;
        }
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        if (state.currentNovel && state.currentNovel._id === action.payload.id) {
          state.currentNovel.notes = action.payload.notes;
        }
      })
      // Update reading progress
      .addCase(updateReadingProgress.fulfilled, (state, action) => {
        if (state.currentNovel && state.currentNovel._id === action.payload.novel._id) {
          state.currentNovel = action.payload.novel;
        }

        // Update novel in the novels list
        const index = state.novels.findIndex((novel) => novel._id === action.payload.novel._id);
        if (index !== -1) {
          state.novels[index] = action.payload.novel;
        }
      })
      // Get all novels (admin)
      .addCase(getAllNovels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNovels.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = action.payload.novels;
      })
      .addCase(getAllNovels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNovelError, clearCurrentNovel } = novelSlice.actions;
export default novelSlice.reducer;
