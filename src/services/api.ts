import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

// Search API
export const searchAPI = {
  search: async (query: string, mode: 'ai' | 'web' | 'both') => {
    const response = await api.post('/search', { query, mode });
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getProgress: async () => {
    const response = await api.get('/users/progress');
    return response.data;
  },
  updateProgress: async (lessonId: string, data: any) => {
    const response = await api.put(`/users/progress/${lessonId}`, data);
    return response.data;
  },
};

// Subject API
export const subjectAPI = {
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },
  getSubject: async (id: string) => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },
};

// Lesson API
export const lessonAPI = {
  getLessons: async () => {
    const response = await api.get('/lessons');
    return response.data;
  },
  getLesson: async (id: string) => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },
  completeLesson: async (id: string, data: any) => {
    const response = await api.post(`/lessons/${id}/complete`, data);
    return response.data;
  },
};

export default api; 