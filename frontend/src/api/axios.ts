import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT from localStorage to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gigflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handles common errors like 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 401 Unauthorized -> clear token and redirect to login page
      if (status === 401) {
        localStorage.removeItem('gigflow_token');
        localStorage.removeItem('gigflow_user');
        // Avoid infinite loop if already on login or register page
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login?expired=true';
        }
      }

      // Extract error message for easy display
      const message = error.response.data?.message || 'Something went wrong';
      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error(error.message || 'Network error'));
  }
);

export default api;
