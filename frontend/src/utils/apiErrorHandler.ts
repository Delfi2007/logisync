/**
 * API Error Handler
 * 
 * Utilities for handling API errors with:
 * - Error parsing
 * - User-friendly messages
 * - Retry logic
 * - Network error detection
 * 
 * @module utils/apiErrorHandler
 */

import { ToastType } from '../contexts/ToastContext';

// ============================================
// INTERFACES
// ============================================

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoff: boolean; // Exponential backoff
  shouldRetry?: (error: ApiError) => boolean;
}

// ============================================
// ERROR MESSAGES
// ============================================

const ErrorMessages: Record<string, string> = {
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',

  // Authentication
  AUTHENTICATION_ERROR: 'Please log in to continue.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_TOKEN: 'Invalid session. Please log in again.',

  // Authorization
  AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support.',

  // Validation
  VALIDATION_ERROR: 'Please check your input and try again.',
  INVALID_INPUT: 'Invalid input provided.',
  MISSING_FIELD: 'Required field is missing.',

  // Resources
  NOT_FOUND: 'The requested resource was not found.',
  USER_NOT_FOUND: 'User not found.',
  ORDER_NOT_FOUND: 'Order not found.',
  PRODUCT_NOT_FOUND: 'Product not found.',

  // Conflicts
  CONFLICT: 'This resource already exists.',
  DUPLICATE_ENTRY: 'Duplicate entry found.',
  EMAIL_EXISTS: 'This email is already registered.',

  // Business Logic
  BUSINESS_LOGIC_ERROR: 'Unable to process your request.',
  INSUFFICIENT_STOCK: 'Insufficient stock available.',
  INVALID_STATUS_TRANSITION: 'Invalid status change.',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',

  // Server errors
  INTERNAL_ERROR: 'Something went wrong. Please try again.',
  DATABASE_ERROR: 'Database error. Please try again.',
  EXTERNAL_SERVICE_ERROR: 'External service error. Please try again.',
  FILE_SYSTEM_ERROR: 'File operation failed. Please try again.',

  // Default
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// ============================================
// ERROR HANDLER CLASS
// ============================================

export class ApiErrorHandler {
  /**
   * Parse API error response
   */
  static parseError(error: any): ApiError {
    // Network error
    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: ErrorMessages.NETWORK_ERROR,
        statusCode: 0
      };
    }

    // API error response
    const response = error.response;
    const data = response.data;

    if (data && data.error) {
      return {
        code: data.error.code || 'UNKNOWN_ERROR',
        message: data.error.message || ErrorMessages.UNKNOWN_ERROR,
        statusCode: data.error.statusCode || response.status,
        details: data.error.details,
        requestId: data.error.requestId
      };
    }

    // Fallback
    return {
      code: 'UNKNOWN_ERROR',
      message: response.statusText || ErrorMessages.UNKNOWN_ERROR,
      statusCode: response.status
    };
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: ApiError): string {
    return ErrorMessages[error.code] || error.message || ErrorMessages.UNKNOWN_ERROR;
  }

  /**
   * Get toast type based on error code
   */
  static getToastType(error: ApiError): ToastType {
    if (error.statusCode >= 500) {
      return 'error';
    }
    if (error.statusCode === 401 || error.statusCode === 403) {
      return 'warning';
    }
    if (error.statusCode === 429) {
      return 'warning';
    }
    return 'error';
  }

  /**
   * Check if error is network error
   */
  static isNetworkError(error: ApiError): boolean {
    return error.code === 'NETWORK_ERROR' || error.statusCode === 0;
  }

  /**
   * Check if error is authentication error
   */
  static isAuthError(error: ApiError): boolean {
    return (
      error.statusCode === 401 ||
      error.code === 'AUTHENTICATION_ERROR' ||
      error.code === 'TOKEN_EXPIRED' ||
      error.code === 'INVALID_TOKEN'
    );
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: ApiError): boolean {
    // Retry on network errors
    if (this.isNetworkError(error)) {
      return true;
    }

    // Retry on server errors (500+)
    if (error.statusCode >= 500) {
      return true;
    }

    // Retry on rate limit (after delay)
    if (error.statusCode === 429) {
      return true;
    }

    // Don't retry client errors (400-499 except 429)
    return false;
  }

  /**
   * Handle API error with automatic actions
   */
  static handleError(error: any, options: {
    showToast?: (message: string, type: ToastType) => void;
    onAuthError?: () => void;
    onNetworkError?: () => void;
  } = {}): ApiError {
    const apiError = this.parseError(error);
    const message = this.getUserMessage(apiError);

    // Show toast notification
    if (options.showToast) {
      const toastType = this.getToastType(apiError);
      options.showToast(message, toastType);
    }

    // Handle auth errors (redirect to login)
    if (this.isAuthError(apiError) && options.onAuthError) {
      options.onAuthError();
    }

    // Handle network errors
    if (this.isNetworkError(apiError) && options.onNetworkError) {
      options.onNetworkError();
    }

    return apiError;
  }
}

// ============================================
// RETRY LOGIC
// ============================================

/**
 * Retry failed requests with exponential backoff
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    shouldRetry = ApiErrorHandler.isRetryable
  } = config;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      const apiError = ApiErrorHandler.parseError(error);

      // Check if should retry
      if (attempt === maxAttempts || !shouldRetry(apiError)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const retryDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;

      console.log(`Request failed (attempt ${attempt}/${maxAttempts}). Retrying in ${retryDelay}ms...`);

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError;
}

// ============================================
// REQUEST HELPERS
// ============================================

/**
 * Wrap fetch with error handling
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  retryConfig?: Partial<RetryConfig>
): Promise<T> {
  const requestFn = async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Check if response is ok
    if (!response.ok) {
      const error: any = new Error('HTTP Error');
      error.response = response;
      try {
        error.response.data = await response.json();
      } catch {
        error.response.data = { error: { message: response.statusText } };
      }
      throw error;
    }

    return response.json();
  };

  // With retry
  if (retryConfig) {
    return retryRequest(requestFn, retryConfig);
  }

  // Without retry
  return requestFn();
}

/**
 * GET request with error handling
 */
export async function apiGet<T>(
  url: string,
  options: RequestInit = {},
  retry?: boolean
): Promise<T> {
  return apiRequest<T>(
    url,
    { ...options, method: 'GET' },
    retry ? {} : undefined
  );
}

/**
 * POST request with error handling
 */
export async function apiPost<T>(
  url: string,
  data: any,
  options: RequestInit = {},
  retry?: boolean
): Promise<T> {
  return apiRequest<T>(
    url,
    {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    },
    retry ? {} : undefined
  );
}

/**
 * PUT request with error handling
 */
export async function apiPut<T>(
  url: string,
  data: any,
  options: RequestInit = {},
  retry?: boolean
): Promise<T> {
  return apiRequest<T>(
    url,
    {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    },
    retry ? {} : undefined
  );
}

/**
 * DELETE request with error handling
 */
export async function apiDelete<T>(
  url: string,
  options: RequestInit = {},
  retry?: boolean
): Promise<T> {
  return apiRequest<T>(
    url,
    { ...options, method: 'DELETE' },
    retry ? {} : undefined
  );
}

// ============================================
// EXPORTS
// ============================================

export default {
  ApiErrorHandler,
  retryRequest,
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  ErrorMessages
};
