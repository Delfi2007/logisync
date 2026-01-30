/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

import apiClient, { ApiSuccessResponse, handleApiResponse } from './api';

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string; // Added for compatibility
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  roles: Array<{
    id: number;
    name: string;
    description: string;
    permissions: string[];
  }>;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
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

    // Store tokens and user in localStorage
    localStorage.setItem('authToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
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

    // Store tokens and user in localStorage
    localStorage.setItem('authToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  /**
   * Logout user
   * Clears token and user data from localStorage
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
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
   * Get refresh token
   * @returns Refresh token or null
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  /**
   * Refresh access token using refresh token
   * @returns New tokens
   */
  refreshAccessToken: async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }

      const response = await apiClient.post<ApiSuccessResponse<{ tokens: { accessToken: string; refreshToken: string; expiresIn: string } }>>(
        '/auth/refresh-token',
        { refreshToken }
      );
      const data = handleApiResponse(response);

      // Update tokens in localStorage
      localStorage.setItem('authToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);

      return {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken
      };
    } catch (error) {
      // If refresh fails, logout user
      authService.logout();
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns true if token exists
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Verify email with token
   * @param token Verification token from email
   * @returns Verification result
   */
  verifyEmail: async (token: string): Promise<{ message: string; verified: boolean }> => {
    const response = await apiClient.get<ApiSuccessResponse<{ message: string; verified: boolean }>>(
      `/auth/verify-email/${token}`
    );
    return handleApiResponse(response);
  },

  /**
   * Resend verification email
   * @param email User email address
   * @returns Success message
   */
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiSuccessResponse<{ message: string }>>(
      '/auth/resend-verification',
      { email }
    );
    return handleApiResponse(response);
  },

  /**
   * Request password reset
   * @param email User email address
   * @returns Success message
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiSuccessResponse<{ message: string }>>(
      '/auth/forgot-password',
      { email }
    );
    return handleApiResponse(response);
  },

  /**
   * Reset password with token
   * @param token Reset token from email
   * @param newPassword New password
   * @returns Success message
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiSuccessResponse<{ message: string }>>(
      '/auth/reset-password',
      { token, password: newPassword, confirmPassword: newPassword }
    );
    return handleApiResponse(response);
  },
};

export default authService;
