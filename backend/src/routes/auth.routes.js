/**
 * Authentication Routes
 * API endpoints for user authentication
 */

import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate, logActivity, preventDemoModification } from '../middleware/auth.middleware.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  refreshTokenValidation
} from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  registerValidation,
  logActivity('user_registered'),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  loginValidation,
  authController.login
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh-token',
  refreshTokenValidation,
  authController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Public
 */
router.post(
  '/logout',
  authController.logout
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  forgotPasswordValidation,
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  resetPasswordValidation,
  logActivity('password_reset'),
  authController.resetPassword
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password (for logged-in user)
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  preventDemoModification,
  changePasswordValidation,
  logActivity('password_changed'),
  authController.changePassword
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  authController.getProfile
);

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verify if token is valid
 * @access  Private
 */
router.post(
  '/verify-token',
  authenticate,
  authController.verifyToken
);

/**
 * @route   GET /api/auth/activity
 * @desc    Get user activity log
 * @access  Private
 */
router.get(
  '/activity',
  authenticate,
  authController.getActivity
);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address with token
 * @access  Public
 */
router.get(
  '/verify-email/:token',
  logActivity('email_verified'),
  authController.verifyEmail
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post(
  '/resend-verification',
  authController.resendVerification
);

export default router;
