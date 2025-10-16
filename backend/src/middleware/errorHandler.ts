/**
 * Global Error Handler Middleware
 * 
 * Centralized error handling for Express with:
 * - Error classification (operational vs programming errors)
 * - Appropriate HTTP status codes
 * - Detailed logging
 * - User-friendly error messages
 * - Stack trace in development
 * 
 * @module middleware/errorHandler
 */

import { Request, Response, NextFunction } from 'express';
import {
  AppError,
  isOperationalError,
  createErrorResponse,
  mapDatabaseError,
  InternalServerError,
  ErrorMessages
} from '../utils/errors';

// ============================================
// ERROR HANDLER MIDDLEWARE
// ============================================

/**
 * Global error handler - should be the last middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logError(err, req);

  // Check if error is operational
  let error: AppError;
  
  if (err instanceof AppError) {
    error = err;
  } else if (isDatabaseError(err)) {
    error = mapDatabaseError(err);
  } else {
    // Unknown error - treat as internal server error
    error = new InternalServerError(
      process.env.NODE_ENV === 'development' ? err.message : undefined
    );
  }

  // Send error response
  const includeStack = process.env.NODE_ENV === 'development';
  const response = createErrorResponse(error, includeStack);

  // Add request ID if available
  if (req.headers['x-request-id']) {
    response.error.requestId = req.headers['x-request-id'];
  }

  // Send response
  res.status(error.statusCode).json(response);
};

// ============================================
// NOT FOUND HANDLER
// ============================================

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(
    `Route not found: ${req.method} ${req.path}`,
    404,
    'ROUTE_NOT_FOUND'
  );

  next(error);
};

// ============================================
// ASYNC ERROR WRAPPER
// ============================================

/**
 * Wrapper for async route handlers to catch errors
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ============================================
// ERROR LOGGING
// ============================================

/**
 * Log error details
 */
function logError(err: Error, req: Request): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  };

  if (err instanceof AppError) {
    errorInfo.error = {
      ...errorInfo.error,
      code: err.code,
      statusCode: err.statusCode,
      context: err.context,
      isOperational: err.isOperational
    } as any;
  }

  // Log based on error type
  if (isOperationalError(err)) {
    // Expected errors (user errors, validation, etc.)
    if ((err as AppError).statusCode >= 500) {
      console.error('[ERROR]', JSON.stringify(errorInfo, null, 2));
    } else {
      console.warn('[WARN]', JSON.stringify(errorInfo, null, 2));
    }
  } else {
    // Programming errors (bugs)
    console.error('[CRITICAL]', JSON.stringify(errorInfo, null, 2));
    
    // In production, you might want to send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry, Rollbar, or similar service
      // Example: Sentry.captureException(err);
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if error is a database error
 */
function isDatabaseError(err: any): boolean {
  return (
    err.code && // Has error code
    (err.code.startsWith('23') || // PostgreSQL constraint violations
      err.code.startsWith('22') || // PostgreSQL data exceptions
      err.code === '42P01' || // PostgreSQL undefined table
      err.code === '42703') // PostgreSQL undefined column
  );
}

/**
 * Handle unhandled promise rejections
 */
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    console.error('[UNHANDLED REJECTION]', {
      timestamp: new Date().toISOString(),
      reason: reason.message,
      stack: reason.stack
    });

    // Exit process with failure
    if (!isOperationalError(reason)) {
      console.error('Shutting down due to unhandled rejection...');
      process.exit(1);
    }
  });
};

/**
 * Handle uncaught exceptions
 */
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error: Error) => {
    console.error('[UNCAUGHT EXCEPTION]', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });

    // Exit process with failure
    console.error('Shutting down due to uncaught exception...');
    process.exit(1);
  });
};

/**
 * Graceful shutdown handler
 */
export const handleShutdown = (server: any) => {
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(() => {
      console.log('HTTP server closed');
      
      // Close database connections, etc.
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

// ============================================
// VALIDATION ERROR FORMATTER
// ============================================

/**
 * Format validation errors from express-validator
 */
export const formatValidationErrors = (errors: any[]): any => {
  return errors.reduce((acc, error) => {
    const field = error.param || error.path;
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(error.msg);
    return acc;
  }, {});
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  handleShutdown,
  formatValidationErrors
};
