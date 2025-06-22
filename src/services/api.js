import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.patch('/users/profile', userData),
  getStats: () => api.get('/users/stats'),
  updateStats: (statsData) => api.patch('/users/stats', statsData),
  resetStats: () => api.post('/users/stats/reset'),
  getReadingPreferences: () => api.get('/users/preferences'),
  updateReadingPreferences: (preferencesData) => api.patch('/users/preferences', preferencesData),
  getAllUsers: () => api.get('/users/all'),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
};

// Novel API
export const novelAPI = {
  uploadNovel: (formData) => {
    return api.post('/novels', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getUserNovels: () => api.get('/novels'),
  getNovel: (id) => api.get(`/novels/${id}`),
  getNovelPage: (id, page) => api.get(`/novels/${id}/page/${page}`),
  deleteNovel: (id) => api.delete(`/novels/${id}`),
  addBookmark: (id, bookmarkData) => api.post(`/novels/${id}/bookmarks`, bookmarkData),
  removeBookmark: (id, bookmarkId) => api.delete(`/novels/${id}/bookmarks/${bookmarkId}`),
  addNote: (id, noteData) => api.post(`/novels/${id}/notes`, noteData),
  updateNote: (id, noteId, noteData) => api.patch(`/novels/${id}/notes/${noteId}`, noteData),
  deleteNote: (id, noteId) => api.delete(`/novels/${id}/notes/${noteId}`),
  updateReadingProgress: (id, progressData) => api.patch(`/novels/${id}/progress`, progressData),
  getAllNovels: () => api.get('/novels/admin/all'),
};

// Image API
export const imageAPI = {
  generateImage: (novelId, page, style) => api.post(`/images/${novelId}/page/${page}`, { style }),
  getImagesForPage: (novelId, page) => api.get(`/images/${novelId}/page/${page}`),
  getAllImageLogs: () => api.get('/images/logs'),
};

// Annotation API
export const annotationAPI = {
  getAnnotations: (novelId) => api.get(`/annotations/novels/${novelId}`),
  getPageAnnotations: (novelId, page) => api.get(`/annotations/novels/${novelId}/pages/${page}`),
  createAnnotation: (novelId, annotationData) => api.post(`/annotations/novels/${novelId}`, annotationData),
  updateAnnotation: (annotationId, annotationData) => api.patch(`/annotations/${annotationId}`, annotationData),
  deleteAnnotation: (annotationId) => api.delete(`/annotations/${annotationId}`),
};

// Sharing API
export const sharingAPI = {
  getSharedContent: (shareId) => api.get(`/sharing/${shareId}`),
  sharePassage: (novelId, passageData) => api.post(`/sharing/novels/${novelId}/passage`, passageData),
  shareProgress: (novelId, progressData) => api.post(`/sharing/novels/${novelId}/progress`, progressData),
  generateSocialImage: (shareId) => api.post(`/sharing/${shareId}/social-image`),
  getUserSharedContent: () => api.get('/sharing/user/all'),
  deleteSharedContent: (shareId) => api.delete(`/sharing/${shareId}`),
};

export default api;