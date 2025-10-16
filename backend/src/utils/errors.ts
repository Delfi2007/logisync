/**
 * Custom Error Classes
 * 
 * Standardized error classes for the application with:
 * - HTTP status codes
 * - Error codes for client handling
 * - Detailed error messages
 * - Additional context data
 * 
 * @module utils/errors
 */

// ============================================
// BASE ERROR CLASS
// ============================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly context?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    context?: any
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context
    };
  }
}

// ============================================
// 400 BAD REQUEST ERRORS
// ============================================

/**
 * Validation Error - 400
 * Used when request data fails validation
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', context?: any) {
    super(message, 400, 'VALIDATION_ERROR', true, context);
  }
}

/**
 * Invalid Input Error - 400
 * Used when request parameters are invalid
 */
export class InvalidInputError extends AppError {
  constructor(message: string = 'Invalid input provided', context?: any) {
    super(message, 400, 'INVALID_INPUT', true, context);
  }
}

/**
 * Missing Field Error - 400
 * Used when required fields are missing
 */
export class MissingFieldError extends AppError {
  constructor(field: string, context?: any) {
    super(`Required field missing: ${field}`, 400, 'MISSING_FIELD', true, { field, ...context });
  }
}

// ============================================
// 401 UNAUTHORIZED ERRORS
// ============================================

/**
 * Authentication Error - 401
 * Used when authentication fails
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', true, context);
  }
}

/**
 * Invalid Credentials Error - 401
 * Used when login credentials are incorrect
 */
export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid email or password', context?: any) {
    super(message, 401, 'INVALID_CREDENTIALS', true, context);
  }
}

/**
 * Token Expired Error - 401
 * Used when JWT token has expired
 */
export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token has expired', context?: any) {
    super(message, 401, 'TOKEN_EXPIRED', true, context);
  }
}

/**
 * Invalid Token Error - 401
 * Used when JWT token is invalid
 */
export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid token', context?: any) {
    super(message, 401, 'INVALID_TOKEN', true, context);
  }
}

// ============================================
// 403 FORBIDDEN ERRORS
// ============================================

/**
 * Authorization Error - 403
 * Used when user lacks permission
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', true, context);
  }
}

/**
 * Insufficient Permissions Error - 403
 * Used when user role lacks required permissions
 */
export class InsufficientPermissionsError extends AppError {
  constructor(resource: string, context?: any) {
    super(`Insufficient permissions to access ${resource}`, 403, 'INSUFFICIENT_PERMISSIONS', true, { resource, ...context });
  }
}

/**
 * Account Suspended Error - 403
 * Used when user account is suspended
 */
export class AccountSuspendedError extends AppError {
  constructor(message: string = 'Account has been suspended', context?: any) {
    super(message, 403, 'ACCOUNT_SUSPENDED', true, context);
  }
}

// ============================================
// 404 NOT FOUND ERRORS
// ============================================

/**
 * Not Found Error - 404
 * Used when resource is not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', context?: any) {
    super(`${resource} not found`, 404, 'NOT_FOUND', true, { resource, ...context });
  }
}

/**
 * User Not Found Error - 404
 */
export class UserNotFoundError extends AppError {
  constructor(identifier?: string, context?: any) {
    const message = identifier ? `User not found: ${identifier}` : 'User not found';
    super(message, 404, 'USER_NOT_FOUND', true, { identifier, ...context });
  }
}

/**
 * Order Not Found Error - 404
 */
export class OrderNotFoundError extends AppError {
  constructor(orderId?: string | number, context?: any) {
    const message = orderId ? `Order not found: ${orderId}` : 'Order not found';
    super(message, 404, 'ORDER_NOT_FOUND', true, { orderId, ...context });
  }
}

/**
 * Product Not Found Error - 404
 */
export class ProductNotFoundError extends AppError {
  constructor(productId?: string | number, context?: any) {
    const message = productId ? `Product not found: ${productId}` : 'Product not found';
    super(message, 404, 'PRODUCT_NOT_FOUND', true, { productId, ...context });
  }
}

// ============================================
// 409 CONFLICT ERRORS
// ============================================

/**
 * Conflict Error - 409
 * Used when resource already exists
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists', context?: any) {
    super(message, 409, 'CONFLICT', true, context);
  }
}

/**
 * Duplicate Entry Error - 409
 */
export class DuplicateEntryError extends AppError {
  constructor(field: string, value: string, context?: any) {
    super(`Duplicate entry: ${field} '${value}' already exists`, 409, 'DUPLICATE_ENTRY', true, { field, value, ...context });
  }
}

/**
 * Email Already Exists Error - 409
 */
export class EmailAlreadyExistsError extends AppError {
  constructor(email: string, context?: any) {
    super(`Email already exists: ${email}`, 409, 'EMAIL_EXISTS', true, { email, ...context });
  }
}

// ============================================
// 422 UNPROCESSABLE ENTITY ERRORS
// ============================================

/**
 * Business Logic Error - 422
 * Used when business rules are violated
 */
export class BusinessLogicError extends AppError {
  constructor(message: string, context?: any) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR', true, context);
  }
}

/**
 * Insufficient Stock Error - 422
 */
export class InsufficientStockError extends AppError {
  constructor(productId: number, available: number, requested: number, context?: any) {
    super(
      `Insufficient stock: Product ${productId} has ${available} units available, but ${requested} requested`,
      422,
      'INSUFFICIENT_STOCK',
      true,
      { productId, available, requested, ...context }
    );
  }
}

/**
 * Invalid Status Transition Error - 422
 */
export class InvalidStatusTransitionError extends AppError {
  constructor(from: string, to: string, context?: any) {
    super(
      `Invalid status transition from '${from}' to '${to}'`,
      422,
      'INVALID_STATUS_TRANSITION',
      true,
      { from, to, ...context }
    );
  }
}

// ============================================
// 429 TOO MANY REQUESTS ERRORS
// ============================================

/**
 * Rate Limit Error - 429
 * Used when rate limit is exceeded
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later', context?: any) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true, context);
  }
}

// ============================================
// 500 INTERNAL SERVER ERRORS
// ============================================

/**
 * Internal Server Error - 500
 * Used for unexpected server errors
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', context?: any) {
    super(message, 500, 'INTERNAL_ERROR', false, context);
  }
}

/**
 * Database Error - 500
 * Used when database operations fail
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', context?: any) {
    super(message, 500, 'DATABASE_ERROR', false, context);
  }
}

/**
 * Database Constraint Error - 400
 * Used when database constraints are violated
 */
export class DatabaseConstraintError extends AppError {
  constructor(message: string = 'Database constraint violation', context?: any) {
    super(message, 400, 'DATABASE_CONSTRAINT_ERROR', true, context);
  }
}

/**
 * External Service Error - 500
 * Used when external API calls fail
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string, context?: any) {
    super(
      message || `External service error: ${service}`,
      500,
      'EXTERNAL_SERVICE_ERROR',
      false,
      { service, ...context }
    );
  }
}

/**
 * File System Error - 500
 * Used when file operations fail
 */
export class FileSystemError extends AppError {
  constructor(message: string = 'File system operation failed', context?: any) {
    super(message, 500, 'FILE_SYSTEM_ERROR', false, context);
  }
}

// ============================================
// ERROR MESSAGES DICTIONARY
// ============================================

export const ErrorMessages = {
  // Authentication
  AUTH_REQUIRED: 'Authentication required. Please log in.',
  AUTH_INVALID: 'Invalid authentication credentials.',
  AUTH_EXPIRED: 'Your session has expired. Please log in again.',
  AUTH_FORBIDDEN: 'You do not have permission to access this resource.',

  // Validation
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Invalid email address.',
  INVALID_PHONE: 'Invalid phone number.',
  INVALID_DATE: 'Invalid date format.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  PASSWORD_MISMATCH: 'Passwords do not match.',

  // Resources
  NOT_FOUND: 'The requested resource was not found.',
  USER_NOT_FOUND: 'User not found.',
  ORDER_NOT_FOUND: 'Order not found.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  CUSTOMER_NOT_FOUND: 'Customer not found.',

  // Conflicts
  EMAIL_EXISTS: 'This email address is already registered.',
  PHONE_EXISTS: 'This phone number is already registered.',
  SKU_EXISTS: 'This SKU already exists.',

  // Business Logic
  INSUFFICIENT_STOCK: 'Insufficient stock available.',
  INVALID_QUANTITY: 'Invalid quantity specified.',
  ORDER_CANNOT_CANCEL: 'This order cannot be cancelled.',
  PAYMENT_FAILED: 'Payment processing failed.',

  // System
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
  DATABASE_ERROR: 'Database operation failed.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  FILE_UPLOAD_ERROR: 'File upload failed.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed size.',

  // Rate Limiting
  RATE_LIMIT: 'Too many requests. Please try again later.',
  TOO_MANY_ATTEMPTS: 'Too many failed attempts. Please try again later.'
} as const;

// ============================================
// ERROR HELPER FUNCTIONS
// ============================================

/**
 * Check if error is operational (known error) or programming error
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error): string {
  if (error instanceof AppError) {
    return error.message;
  }

  // Don't expose internal error details to users
  return ErrorMessages.INTERNAL_ERROR;
}

/**
 * Create error response object for API
 */
export function createErrorResponse(error: Error, includeStack: boolean = false) {
  if (error instanceof AppError) {
    const response: any = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode
      }
    };

    if (error.context) {
      response.error.details = error.context;
    }

    if (includeStack && error.stack) {
      response.error.stack = error.stack;
    }

    return response;
  }

  // Generic error response
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: includeStack ? error.message : ErrorMessages.INTERNAL_ERROR,
      statusCode: 500,
      ...(includeStack && error.stack ? { stack: error.stack } : {})
    }
  };
}

/**
 * Map common database errors to custom errors
 */
export function mapDatabaseError(error: any): AppError {
  // PostgreSQL error codes
  const pgErrorCode = error.code;

  switch (pgErrorCode) {
    case '23505': // unique_violation
      return new DuplicateEntryError(
        error.constraint || 'field',
        error.detail || 'value'
      );
    
    case '23503': // foreign_key_violation
      return new BusinessLogicError('Referenced record does not exist', {
        constraint: error.constraint,
        detail: error.detail
      });
    
    case '23502': // not_null_violation
      return new ValidationError('Required field cannot be null', {
        column: error.column
      });
    
    case '22001': // string_data_right_truncation
      return new ValidationError('Value too long for field', {
        column: error.column
      });
    
    case '22P02': // invalid_text_representation
      return new InvalidInputError('Invalid data type', {
        detail: error.detail
      });
    
    default:
      return new DatabaseError(error.message, {
        code: pgErrorCode,
        detail: error.detail
      });
  }
}

export default {
  AppError,
  ValidationError,
  InvalidInputError,
  MissingFieldError,
  AuthenticationError,
  InvalidCredentialsError,
  TokenExpiredError,
  InvalidTokenError,
  AuthorizationError,
  InsufficientPermissionsError,
  AccountSuspendedError,
  NotFoundError,
  UserNotFoundError,
  OrderNotFoundError,
  ProductNotFoundError,
  ConflictError,
  DuplicateEntryError,
  EmailAlreadyExistsError,
  BusinessLogicError,
  InsufficientStockError,
  InvalidStatusTransitionError,
  RateLimitError,
  InternalServerError,
  DatabaseError,
  DatabaseConstraintError,
  ExternalServiceError,
  FileSystemError,
  ErrorMessages,
  isOperationalError,
  getUserFriendlyMessage,
  createErrorResponse,
  mapDatabaseError
};
