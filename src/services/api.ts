/**
 * Base API Configuration
 * Handles axios setup, interceptors, and common API utilities
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// API base URL - uses environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Add Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the data directly for successful responses
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - try to refresh token
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              // Dynamically import authService to avoid circular dependency
              const { default: authService } = await import('./auth');
              const tokens = await authService.refreshAccessToken();
              
              if (tokens && originalRequest.headers) {
                // Update Authorization header with new token
                originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                // Retry the original request
                return apiClient(originalRequest);
              }
            } catch (refreshError) {
              // Refresh failed, redirect to login
              localStorage.removeItem('authToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            }
          }
          
          // If retry failed or already retried, clear auth and redirect
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', data.error);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data.error);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.error);
          break;
          
        default:
          console.error('API error:', data.error);
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data.error || 'An error occurred',
        errors: data.errors || [],
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your connection',
        errors: [],
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message,
        errors: [],
      });
    }
  }
);

// Types
export interface ApiErrorResponse {
  success: false;
  error: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

// Utility function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<ApiSuccessResponse<T>>): T => {
  return response.data.data;
};

// Utility function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.errors && error.errors.length > 0) {
    // Return first validation error
    return error.errors[0].message;
  }
  return error.message || 'An unexpected error occurred';
};

export default apiClient;
