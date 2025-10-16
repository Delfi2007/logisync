import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Customer Validators
 * Input validation for customer management endpoints
 */

/**
 * Validate customer creation
 */
export const createCustomerValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .toLowerCase(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid Indian phone number (must be 10 digits starting with 6-9)'),

  body('businessName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Business name must be less than 200 characters')
    .escape(),

  body('gstNumber')
    .optional()
    .trim()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid GST number format'),

  body('billingAddress')
    .optional()
    .isObject()
    .withMessage('Billing address must be an object'),

  body('billingAddress.line1')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address line 1 must be less than 200 characters')
    .escape(),

  body('billingAddress.line2')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address line 2 must be less than 200 characters')
    .escape(),

  body('billingAddress.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters')
    .escape(),

  body('billingAddress.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State must be less than 100 characters')
    .escape(),

  body('billingAddress.pincode')
    .optional()
    .trim()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Invalid pincode (must be 6 digits, cannot start with 0)'),

  body('segment')
    .optional()
    .isIn(['new', 'regular', 'premium'])
    .withMessage('Segment must be new, regular, or premium'),
];

/**
 * Validate customer update
 */
export const updateCustomerValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid customer ID')
    .toInt(),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters')
    .escape(),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .toLowerCase(),

  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid Indian phone number'),

  body('businessName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Business name must be less than 200 characters')
    .escape(),

  body('gstNumber')
    .optional()
    .trim()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid GST number format'),

  body('segment')
    .optional()
    .isIn(['new', 'regular', 'premium'])
    .withMessage('Segment must be new, regular, or premium'),
];

/**
 * Validate customer ID parameter
 */
export const customerIdValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid customer ID')
    .toInt(),
];

/**
 * Validate customer search/filter query
 */
export const customerSearchValidation: ValidationChain[] = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search query too long')
    .escape(),

  query('segment')
    .optional()
    .isIn(['new', 'regular', 'premium'])
    .withMessage('Invalid segment filter'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'total_orders', 'lifetime_value', 'created_at'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];
