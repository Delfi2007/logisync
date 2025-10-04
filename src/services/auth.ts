/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

import apiClient, { ApiSuccessResponse, handleApiResponse } from './api';

// Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'user' | 'manager';
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Authentication API calls
export const authService = {
  /**
   * Login user
   * @param credentials Email and password
   * @returns Auth token and user data
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    const data = handleApiResponse<AuthResponse>(response);
    
    // Store token and user in localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  /**
   * Register new user
   * @param userData User registration data
   * @returns Auth token and user data
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      '/auth/register',
      userData
    );
    const data = handleApiResponse<AuthResponse>(response);
    
    // Store token and user in localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  /**
   * Logout user
   * Clears token and user data from localStorage
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns User data or null
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Get current auth token
   * @returns Token or null
   */
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  /**
   * Check if user is authenticated
   * @returns true if token exists
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

export default authService;
