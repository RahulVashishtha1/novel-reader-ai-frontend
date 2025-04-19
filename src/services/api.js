import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
  getStats: () => api.get('/users/stats'),
  updateStats: (statsData) => api.patch('/users/stats', statsData),
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

export default api;
