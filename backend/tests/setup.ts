/**
 * Jest Setup File
 * 
 * Global setup and configuration for all tests
 * - Environment variables
 * - Mock configurations
 * 
 * Phase 4 Task 6: Testing Suite
 * Date: October 16, 2025
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.PORT = '5001';
process.env.LOG_LEVEL = 'error'; // Reduce log noise in tests

// Mock environment variables for database
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'logisync_test';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'password';

// Mock email configuration
process.env.SMTP_HOST = 'smtp.test.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test@test.com';
process.env.SMTP_PASSWORD = 'testpassword';
process.env.SMTP_FROM = 'test@test.com';

// File upload configuration
process.env.UPLOAD_DIR = 'uploads/test';
process.env.MAX_FILE_SIZE = '10485760'; // 10MB

// Log configuration
process.env.LOG_DIR = 'logs/test';

export {};
