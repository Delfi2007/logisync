import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress
} from '../controllers/customersController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/customers
 * @desc Get all customers with filtering and pagination
 * @access Private
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('segment').optional().isIn(['premium', 'regular', 'new']).withMessage('Invalid segment'),
    query('search').optional().isString().trim(),
    query('sortBy').optional().isIn(['name', 'email', 'segment', 'total_orders', 'total_revenue', 'created_at']),
    query('order').optional().isIn(['ASC', 'DESC'])
  ],
  validate,
  getAllCustomers
);

/**
 * @route GET /api/customers/:id
 * @desc Get single customer with addresses and orders
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid customer ID')
  ],
  validate,
  getCustomerById
);

/**
 * @route POST /api/customers
 * @desc Create new customer
 * @access Private
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Customer name is required')
      .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty().withMessage('Phone number is required')
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).withMessage('Invalid phone number'),
    body('business_name')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Business name must be less than 255 characters'),
    body('gst_number')
      .optional()
      .trim()
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).withMessage('Invalid GST number format'),
    body('address').optional().isObject().withMessage('Address must be an object'),
    body('address.type').optional().isIn(['billing', 'shipping']).withMessage('Address type must be billing or shipping'),
    body('address.street').optional().trim().notEmpty().withMessage('Street address is required'),
    body('address.city').optional().trim().notEmpty().withMessage('City is required'),
    body('address.state').optional().trim().notEmpty().withMessage('State is required'),
    body('address.pincode').optional().trim().matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits')
  ],
  validate,
  createCustomer
);

/**
 * @route PUT /api/customers/:id
 * @desc Update customer
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid customer ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).withMessage('Invalid phone number'),
    body('business_name')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Business name must be less than 255 characters'),
    body('gst_number')
      .optional()
      .trim()
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).withMessage('Invalid GST number format'),
    body('segment')
      .optional()
      .isIn(['premium', 'regular', 'new']).withMessage('Invalid segment')
  ],
  validate,
  updateCustomer
);

/**
 * @route DELETE /api/customers/:id
 * @desc Delete customer
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid customer ID')
  ],
  validate,
  deleteCustomer
);

/**
 * @route POST /api/customers/:id/addresses
 * @desc Add customer address
 * @access Private
 */
router.post(
  '/:id/addresses',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid customer ID'),
    body('type')
      .isIn(['billing', 'shipping']).withMessage('Address type must be billing or shipping'),
    body('street')
      .trim()
      .notEmpty().withMessage('Street address is required')
      .isLength({ max: 500 }).withMessage('Street address must be less than 500 characters'),
    body('city')
      .trim()
      .notEmpty().withMessage('City is required')
      .isLength({ max: 100 }).withMessage('City must be less than 100 characters'),
    body('state')
      .trim()
      .notEmpty().withMessage('State is required')
      .isLength({ max: 100 }).withMessage('State must be less than 100 characters'),
    body('pincode')
      .trim()
      .notEmpty().withMessage('Pincode is required')
      .matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
    body('is_default')
      .optional()
      .isBoolean().withMessage('is_default must be a boolean')
  ],
  validate,
  addCustomerAddress
);

/**
 * @route PUT /api/customers/:id/addresses/:addressId
 * @desc Update customer address
 * @access Private
 */
router.put(
  '/:id/addresses/:addressId',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid customer ID'),
    param('addressId').isInt({ min: 1 }).withMessage('Invalid address ID'),
    body('type')
      .optional()
      .isIn(['billing', 'shipping']).withMessage('Address type must be billing or shipping'),
    body('street')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Street address must be less than 500 characters'),
    body('city')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('City must be less than 100 characters'),
    body('state')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('State must be less than 100 characters'),
    body('pincode')
      .optional()
      .trim()
      .matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
    body('is_default')
      .optional()
      .isBoolean().withMessage('is_default must be a boolean')
  ],
  validate,
  updateCustomerAddress
);

/**
 * @route DELETE /api/customers/:id/addresses/:addressId
 * @desc Delete customer address
 * @access Private
 */
router.delete(
  '/:id/addresses/:addressId',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid customer ID'),
    param('addressId').isInt({ min: 1 }).withMessage('Invalid address ID')
  ],
  validate,
  deleteCustomerAddress
);

export default router;
