import axios from 'axios';
import { API_URL } from '../utils/constants';
import { storage } from '../utils/helpers';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    let token = storage.get('token');
    // Strip surrounding quotes if double-serialized
    if (token && typeof token === 'string') {
      token = token.replace(/^"|"$/g, '');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          storage.remove('token');
          storage.remove('user');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          break;
      }
    } else if (error.request) {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

export default api;