/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

import authService from '../services/auth.service.js';
import { validationResult } from 'express-validator';
import pool from '../config/database.js';

class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password, firstName, lastName, phone, roles } = req.body;

      // Register user
      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
        roleNames: roles || ['customer']
      });

      // Don't send password hash to client
      delete result.user.password_hash;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });

    } catch (error) {
      console.error('Registration error:', error);

      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('user-agent');

      // Login user
      const result = await authService.login({
        email,
        password,
        ipAddress,
        userAgent
      });

      // Don't send password hash to client
      delete result.user.password_hash;

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });

    } catch (error) {
      console.error('Login error:', error);

      if (error.message.includes('Invalid') || error.message.includes('inactive')) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh-token
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      // Refresh token
      const result = await authService.refreshToken(refreshToken);

      // Don't send password hash to client
      delete result.user.password_hash;

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });

    } catch (error) {
      console.error('Refresh token error:', error);

      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      await authService.logout(refreshToken);

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);

      // Even if logout fails, return success
      res.json({
        success: true,
        message: 'Logout successful'
      });
    }
  }

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      const result = await authService.requestPasswordReset(email);

      res.json({
        success: true,
        message: result.message,
        // Remove debug info in production
        debug: process.env.NODE_ENV === 'development' ? result.debug : undefined
      });

    } catch (error) {
      console.error('Forgot password error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request'
      });
    }
  }

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { token, password } = req.body;

      const result = await authService.resetPassword(token, password);

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Reset password error:', error);

      if (error.message.includes('Invalid') || error.message.includes('expired') || error.message.includes('used')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }

  /**
   * Change password (for logged-in user)
   * POST /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const result = await authService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Change password error:', error);

      if (error.message.includes('incorrect')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async getProfile(req, res) {
    try {
      const user = req.user;

      // Don't send sensitive data
      delete user.password_hash;

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Get profile error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  }

  /**
   * Verify token (check if token is valid)
   * POST /api/auth/verify-token
   */
  async verifyToken(req, res) {
    try {
      // If middleware passed, token is valid
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          userId: req.user.id,
          email: req.user.email,
          roles: req.user.roles.map(r => r.name)
        }
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }

  /**
   * Get user activity log
   * GET /api/auth/activity
   */
  async getActivity(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const result = await pool.query(
        `SELECT 
          id, action, resource_type, resource_id, 
          ip_address, user_agent, metadata, created_at
         FROM user_activity_log
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      const countResult = await pool.query(
        'SELECT COUNT(*) FROM user_activity_log WHERE user_id = $1',
        [userId]
      );

      res.json({
        success: true,
        data: {
          activities: result.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(countResult.rows[0].count)
          }
        }
      });

    } catch (error) {
      console.error('Get activity error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to get activity log'
      });
    }
  }

  /**
   * Verify email address
   * GET /api/auth/verify-email/:token
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      // Verify the email
      const result = await authService.verifyEmail(token);

      res.json({
        success: true,
        message: 'Email verified successfully',
        data: result
      });

    } catch (error) {
      console.error('Email verification error:', error);

      // Handle specific error cases
      if (error.message === 'Invalid or expired verification token') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Email already verified') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to verify email'
      });
    }
  }

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      await authService.resendVerificationEmail(email);

      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });

    } catch (error) {
      console.error('Resend verification error:', error);

      if (error.message === 'User not found') {
        // Don't reveal if email exists
        return res.json({
          success: true,
          message: 'If an account exists, a verification email will be sent'
        });
      }

      if (error.message === 'Email already verified') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
  }
}

export default new AuthController();
