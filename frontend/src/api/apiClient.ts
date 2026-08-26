// API Client — frontend/src/api/apiClient.ts
// Single Axios instance. All API calls go through here.
// Base URL is read from environment — never hardcoded.

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token if needed in future
apiClient.interceptors.request.use(
  (config) => {
    // TODO: attach bearer token when auth is implemented
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
