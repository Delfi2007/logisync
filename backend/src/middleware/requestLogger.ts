/**
 * Request Logging Middleware
 * 
 * Logs HTTP requests with:
 * - Request details (method, URL, status, duration)
 * - User information
 * - IP address
 * - User agent
 * - Response time
 * 
 * @module middleware/requestLogger
 */

import morgan from 'morgan';
import { Request, Response } from 'express';
import logger, { stream } from '../config/logger';
import analyticsService from '../services/analytics.service';

// ============================================
// MORGAN CONFIGURATION
// ============================================

/**
 * Custom morgan format
 */
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

/**
 * Skip logging for health check endpoints
 */
const skip = (req: Request, res: Response) => {
  return req.url.startsWith('/api/health');
};

/**
 * Morgan middleware instance
 */
export const requestLogger = morgan(morganFormat, {
  stream,
  skip,
});

// ============================================
// CUSTOM REQUEST LOGGER
// ============================================

/**
 * Enhanced request logger with analytics
 */
export const enhancedRequestLogger = (req: Request, res: Response, next: Function) => {
  const startTime = Date.now();

  // Capture response
  const originalSend = res.send;
  res.send = function (data: any) {
    res.send = originalSend;

    const duration = Date.now() - startTime;

    // Log request
    logger.http('HTTP Request', {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.id,
      contentLength: res.get('content-length'),
    });

    // Track analytics (async, don't wait)
    if ((req as any).user?.id) {
      analyticsService.trackEvent({
        user_id: (req as any).user.id,
        event_type: 'api_request',
        event_category: 'http',
        event_data: {
          method: req.method,
          url: req.originalUrl || req.url,
          statusCode: res.statusCode,
          duration,
        },
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.get('user-agent'),
        page_url: req.originalUrl || req.url,
      }).catch(err => {
        logger.error('Failed to track analytics event', { error: err.message });
      });
    }

    return originalSend.call(this, data);
  };

  next();
};

// ============================================
// PERFORMANCE LOGGER
// ============================================

/**
 * Log slow requests
 */
export const slowRequestLogger = (threshold: number = 1000) => {
  return (req: Request, res: Response, next: Function) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      if (duration > threshold) {
        logger.warn('Slow Request', {
          method: req.method,
          url: req.originalUrl || req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`,
          userId: (req as any).user?.id,
        });
      }
    });

    next();
  };
};

// ============================================
// ERROR REQUEST LOGGER
// ============================================

/**
 * Log failed requests
 */
export const errorRequestLogger = (req: Request, res: Response, next: Function) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      logger.warn('Failed Request', {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
        userId: (req as any).user?.id,
        body: req.body,
        query: req.query,
      });
    }
  });

  next();
};

export default {
  requestLogger,
  enhancedRequestLogger,
  slowRequestLogger,
  errorRequestLogger,
};
