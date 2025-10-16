/**
 * Order Validators
 * 
 * Express-validator validation rules for order endpoints.
 * Complements database constraints with request-level validation.
 * 
 * Phase 4 Task 5: Data Validation & Constraints
 * Date: October 16, 2025
 */

import { body, param, query } from 'express-validator';

/**
 * Validate order creation
 */
export const validateCreateOrder = [
  body('customer_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Customer ID must be a positive integer'),

  body('status')
    .optional()
    .isIn(['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid order status'),

  body('payment_status')
    .optional()
    .isIn(['pending', 'partial', 'paid', 'refunded'])
    .withMessage('Invalid payment status'),

  body('subtotal')
    .notEmpty()
    .withMessage('Subtotal is required')
    .isFloat({ min: 0.01 })
    .withMessage('Subtotal must be greater than 0'),

  body('tax_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax amount must be non-negative'),

  body('total_amount')
    .notEmpty()
    .withMessage('Total amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Total amount must be greater than 0')
    .custom((value, { req }) => {
      const subtotal = parseFloat(req.body.subtotal) || 0;
      const tax = parseFloat(req.body.tax_amount) || 0;
      const expected = Math.round((subtotal + tax) * 100) / 100;
      const actual = Math.round(value * 100) / 100;
      
      if (actual !== expected) {
        throw new Error(`Total amount must equal subtotal + tax (expected ${expected}, got ${actual})`);
      }
      return true;
    }),

  body('shipping_street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Shipping street must be 5-500 characters'),

  body('shipping_city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Shipping city must be 2-100 characters'),

  body('shipping_state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Shipping state must be 2-100 characters'),

  body('shipping_pincode')
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('Shipping pincode must be 6 digits')
    .custom((value) => {
      const pincode = parseInt(value, 10);
      if (pincode < 110001 || pincode > 855118) {
        throw new Error('Invalid Indian pincode range');
      }
      return true;
    }),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),

  // Validate items array
  body('items')
    .notEmpty()
    .withMessage('Order must have at least one item')
    .isArray({ min: 1 })
    .withMessage('Items must be an array with at least one item'),

  body('items.*.product_id')
    .notEmpty()
    .withMessage('Product ID is required for each item')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required for each item')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Quantity must be between 1 and 10,000'),

  body('items.*.unit_price')
    .notEmpty()
    .withMessage('Unit price is required for each item')
    .isFloat({ min: 0.01 })
    .withMessage('Unit price must be greater than 0'),

  // Custom validation for shipping address completeness
  body()
    .custom((value, { req }) => {
      const { shipping_street, shipping_city, shipping_state, shipping_pincode } = req.body;
      const hasAny = shipping_street || shipping_city || shipping_state || shipping_pincode;
      const hasAll = shipping_street && shipping_city && shipping_state && shipping_pincode;

      if (hasAny && !hasAll) {
        throw new Error('Either provide all shipping address fields or none');
      }
      return true;
    })
];

/**
 * Validate order update
 */
export const validateUpdateOrder = [
  body('customer_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Customer ID must be a positive integer'),

  body('status')
    .optional()
    .isIn(['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid order status'),

  body('payment_status')
    .optional()
    .isIn(['pending', 'partial', 'paid', 'refunded'])
    .withMessage('Invalid payment status'),

  body('subtotal')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Subtotal must be greater than 0'),

  body('tax_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax amount must be non-negative'),

  body('total_amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Total amount must be greater than 0'),

  body('shipping_street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Shipping street must be 5-500 characters'),

  body('shipping_city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Shipping city must be 2-100 characters'),

  body('shipping_state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Shipping state must be 2-100 characters'),

  body('shipping_pincode')
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('Shipping pincode must be 6 digits'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters')
];

/**
 * Validate order status update
 */
export const validateUpdateOrderStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid order status'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

/**
 * Validate order ID parameter
 */
export const validateOrderId = [
  param('id')
    .notEmpty()
    .withMessage('Order ID is required')
    .isInt({ min: 1 })
    .withMessage('Order ID must be a positive integer')
];

/**
 * Validate order search/filter query
 */
export const validateOrderQuery = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search query must not exceed 255 characters'),

  query('status')
    .optional()
    .isIn(['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid status filter'),

  query('payment_status')
    .optional()
    .isIn(['pending', 'partial', 'paid', 'refunded'])
    .withMessage('Invalid payment status filter'),

  query('customer_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Customer ID must be a positive integer'),

  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date (ISO 8601)'),

  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date (ISO 8601)'),

  query('min_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum amount must be non-negative'),

  query('max_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum amount must be non-negative'),

  query('sort_by')
    .optional()
    .isIn(['created_at', 'updated_at', 'total_amount', 'order_number', 'status'])
    .withMessage('Invalid sort field'),

  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Validate bulk order operation
 */
export const validateBulkOrderOperation = [
  body('order_ids')
    .notEmpty()
    .withMessage('Order IDs are required')
    .isArray({ min: 1, max: 100 })
    .withMessage('Order IDs must be an array of 1-100 IDs'),

  body('order_ids.*')
    .isInt({ min: 1 })
    .withMessage('Each order ID must be a positive integer')
];

/**
 * Validate bulk status update
 */
export const validateBulkStatusUpdate = [
  body('order_ids')
    .notEmpty()
    .withMessage('Order IDs are required')
    .isArray({ min: 1, max: 100 })
    .withMessage('Order IDs must be an array of 1-100 IDs'),

  body('order_ids.*')
    .isInt({ min: 1 })
    .withMessage('Each order ID must be a positive integer'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid order status')
];

/**
 * Validate order export
 */
export const validateOrderExport = [
  query('format')
    .optional()
    .isIn(['csv', 'excel', 'pdf'])
    .withMessage('Format must be csv, excel, or pdf'),

  query('status')
    .optional()
    .isIn(['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid status filter'),

  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
];

export default {
  validateCreateOrder,
  validateUpdateOrder,
  validateUpdateOrderStatus,
  validateOrderId,
  validateOrderQuery,
  validateBulkOrderOperation,
  validateBulkStatusUpdate,
  validateOrderExport
};
