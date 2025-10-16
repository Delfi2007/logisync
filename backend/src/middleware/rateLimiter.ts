import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate Limiting Configuration
 * Prevents abuse by limiting the number of requests per time window
 */

/**
 * Custom key generator that uses both IP and user ID if authenticated
 */
const createKeyGenerator = () => {
  return (req: Request): string => {
    // @ts-ignore - user is added by auth middleware
    const userId = req.user?.userId;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    
    return userId ? `user:${userId}` : `ip:${ip}`;
  };
};

/**
 * Custom rate limit message
 */
const rateLimitMessage = (req: Request, res: Response) => {
  const retryAfter = res.getHeader('Retry-After');
  
  return {
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Please try again later.',
    retryAfter: retryAfter ? parseInt(retryAfter as string) : undefined,
    code: 'RATE_LIMIT_EXCEEDED',
  };
};

/**
 * Rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  message: rateLimitMessage,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count all requests
  skipFailedRequests: false,
  keyGenerator: createKeyGenerator(),
});

/**
 * Strict rate limiter for failed login attempts
 * 3 requests per 15 minutes per IP
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 attempts per window
  message: (req: Request, res: Response) => ({
    error: 'Too many login attempts',
    message: 'Account temporarily locked. Please try again in 15 minutes.',
    retryAfter: res.getHeader('Retry-After'),
    code: 'LOGIN_RATE_LIMIT',
  }),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  keyGenerator: createKeyGenerator(),
});

/**
 * Rate limiter for API endpoints (authenticated users)
 * 100 requests per 15 minutes per user
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createKeyGenerator(),
});

/**
 * Rate limiter for public endpoints
 * 20 requests per minute per IP
 */
export const publicRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Max 20 requests per window
  message: rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

/**
 * Rate limiter for file upload endpoints
 * 10 requests per hour per user
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 uploads per hour
  message: (req: Request, res: Response) => ({
    error: 'Upload limit exceeded',
    message: 'You have exceeded the file upload limit. Please try again later.',
    retryAfter: res.getHeader('Retry-After'),
    code: 'UPLOAD_RATE_LIMIT',
  }),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createKeyGenerator(),
});

/**
 * Rate limiter for password reset requests
 * 3 requests per hour per IP
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 password reset requests per hour
  message: (req: Request, res: Response) => ({
    error: 'Too many password reset attempts',
    message: 'You have exceeded the password reset limit. Please try again in an hour.',
    retryAfter: res.getHeader('Retry-After'),
    code: 'PASSWORD_RESET_RATE_LIMIT',
  }),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for registration/signup
 * 3 registrations per hour per IP
 */
export const registrationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 registrations per hour per IP
  message: (req: Request, res: Response) => ({
    error: 'Registration limit exceeded',
    message: 'Too many accounts created from this IP. Please try again later.',
    retryAfter: res.getHeader('Retry-After'),
    code: 'REGISTRATION_RATE_LIMIT',
  }),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Very strict rate limiter for sensitive operations
 * 5 requests per hour per user
 */
export const sensitiveOperationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 operations per hour
  message: (req: Request, res: Response) => ({
    error: 'Operation limit exceeded',
    message: 'You have exceeded the limit for sensitive operations.',
    retryAfter: res.getHeader('Retry-After'),
    code: 'SENSITIVE_OPERATION_RATE_LIMIT',
  }),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createKeyGenerator(),
});

/**
 * Create custom rate limiter with specific configuration
 */
export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || rateLimitMessage,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    skipFailedRequests: options.skipFailedRequests || false,
    keyGenerator: createKeyGenerator(),
  });
};

/**
 * Export rate limit configuration for documentation
 */
export const rateLimitConfig = {
  auth: { window: '15 minutes', max: 5 },
  login: { window: '15 minutes', max: 3 },
  api: { window: '15 minutes', max: 100 },
  public: { window: '1 minute', max: 20 },
  upload: { window: '1 hour', max: 10 },
  passwordReset: { window: '1 hour', max: 3 },
  registration: { window: '1 hour', max: 3 },
  sensitiveOperation: { window: '1 hour', max: 5 },
};
