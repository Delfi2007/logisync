/**
 * Logger Configuration
 * 
 * Winston-based logging system with:
 * - Multiple transports (console, file, error file)
 * - Log rotation (daily)
 * - Log levels (error, warn, info, http, debug)
 * - Structured logging (JSON format)
 * - Request logging
 * - Error logging
 * - Performance logging
 * 
 * @module config/logger
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// ============================================
// CONFIGURATION
// ============================================

const LOG_DIR = process.env.LOG_DIR || 'logs';
const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const MAX_LOG_SIZE = process.env.MAX_LOG_SIZE || '20m';
const MAX_LOG_FILES = process.env.MAX_LOG_FILES || '14d';

// ============================================
// LOG LEVELS
// ============================================

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

winston.addColors(colors);

// ============================================
// LOG FORMAT
// ============================================

/**
 * Format for console output (colorized, human-readable)
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

/**
 * Format for file output (JSON, structured)
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// ============================================
// TRANSPORTS
// ============================================

/**
 * Console transport (for development)
 */
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: LOG_LEVEL,
});

/**
 * Combined log file (all logs)
 */
const combinedFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: MAX_LOG_SIZE,
  maxFiles: MAX_LOG_FILES,
  format: fileFormat,
  level: LOG_LEVEL,
});

/**
 * Error log file (errors only)
 */
const errorFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: MAX_LOG_SIZE,
  maxFiles: MAX_LOG_FILES,
  format: fileFormat,
  level: 'error',
});

/**
 * HTTP log file (API requests)
 */
const httpFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'http-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: MAX_LOG_SIZE,
  maxFiles: MAX_LOG_FILES,
  format: fileFormat,
  level: 'http',
});

// ============================================
// LOGGER INSTANCE
// ============================================

/**
 * Main logger instance
 */
const logger = winston.createLogger({
  levels,
  transports: [
    consoleTransport,
    combinedFileTransport,
    errorFileTransport,
    httpFileTransport,
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: MAX_LOG_SIZE,
      maxFiles: MAX_LOG_FILES,
      format: fileFormat,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: MAX_LOG_SIZE,
      maxFiles: MAX_LOG_FILES,
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Log error with context
 */
export function logError(error: Error, context?: any): void {
  logger.error(error.message, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  });
}

/**
 * Log HTTP request
 */
export function logRequest(req: any, res: any, duration: number): void {
  logger.http('HTTP Request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
  });
}

/**
 * Log database query
 */
export function logQuery(query: string, duration: number, params?: any): void {
  logger.debug('Database Query', {
    query,
    duration: `${duration}ms`,
    params,
  });
}

/**
 * Log performance metric
 */
export function logPerformance(operation: string, duration: number, metadata?: any): void {
  logger.info('Performance', {
    operation,
    duration: `${duration}ms`,
    ...metadata,
  });
}

/**
 * Log security event
 */
export function logSecurity(event: string, details: any): void {
  logger.warn('Security Event', {
    event,
    ...details,
  });
}

/**
 * Log business event
 */
export function logEvent(event: string, data: any): void {
  logger.info('Business Event', {
    event,
    data,
  });
}

// ============================================
// STREAM FOR MORGAN (HTTP REQUEST LOGGING)
// ============================================

/**
 * Stream for Morgan middleware
 */
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// ============================================
// EXPORTS
// ============================================

export default logger;
