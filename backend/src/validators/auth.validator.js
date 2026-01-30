/**
 * Authentication Validation Rules
 * Input validation for authentication endpoints
 */

import { body } from 'express-validator';

export const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must contain at least one special character'),

  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('Invalid phone number format')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),

  body('roles')
    .optional()
    .isArray()
    .withMessage('Roles must be an array')
    .custom((roles) => {
      const validRoles = ['admin', 'manager', 'driver', 'customer', 'vendor'];
      return roles.every(role => validRoles.includes(role));
    })
    .withMessage('Invalid role specified')
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const forgotPasswordValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .toLowerCase()
];

export const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 32, max: 500 })
    .withMessage('Invalid token format'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must contain at least one special character'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('New password must contain at least one special character')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from current password'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match')
];

export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isString()
    .withMessage('Invalid refresh token format')
];

export default {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  refreshTokenValidation
};
