import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validator.js';
import {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getNearbyWarehouses,
  updateAmenities
} from '../controllers/warehousesController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/warehouses/nearby
 * @desc Find nearby warehouses by pincode
 * @access Private
 */
router.get(
  '/nearby',
  [
    query('pincode')
      .notEmpty().withMessage('Pincode is required')
      .matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
    query('radius')
      .optional()
      .isInt({ min: 1, max: 1000 }).withMessage('Radius must be between 1 and 1000 km')
  ],
  validate,
  getNearbyWarehouses
);

/**
 * @route GET /api/warehouses
 * @desc Get all warehouses with filtering and pagination
 * @access Private
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid status'),
    query('is_verified').optional().isBoolean().withMessage('is_verified must be a boolean'),
    query('search').optional().isString().trim(),
    query('sortBy').optional().isIn(['name', 'code', 'city', 'capacity', 'occupied', 'created_at']),
    query('order').optional().isIn(['ASC', 'DESC'])
  ],
  validate,
  getAllWarehouses
);

/**
 * @route GET /api/warehouses/:id
 * @desc Get single warehouse with amenities
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid warehouse ID')
  ],
  validate,
  getWarehouseById
);

/**
 * @route POST /api/warehouses
 * @desc Create new warehouse
 * @access Private
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Warehouse name is required')
      .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    body('code')
      .trim()
      .notEmpty().withMessage('Warehouse code is required')
      .isLength({ min: 2, max: 50 }).withMessage('Code must be between 2 and 50 characters')
      .matches(/^[A-Z0-9-]+$/i).withMessage('Code can only contain letters, numbers, and hyphens'),
    body('street')
      .trim()
      .notEmpty().withMessage('Street address is required')
      .isLength({ max: 500 }).withMessage('Street must be less than 500 characters'),
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
    body('latitude')
      .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('capacity')
      .isInt({ min: 0 }).withMessage('Capacity must be a non-negative integer'),
    body('occupied')
      .optional()
      .isInt({ min: 0 }).withMessage('Occupied space must be a non-negative integer'),
    body('contact_person')
      .trim()
      .notEmpty().withMessage('Contact person is required')
      .isLength({ max: 255 }).withMessage('Contact person name must be less than 255 characters'),
    body('contact_phone')
      .trim()
      .notEmpty().withMessage('Contact phone is required')
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).withMessage('Invalid phone number'),
    body('contact_email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    body('cost_per_sqft')
      .optional()
      .isFloat({ min: 0 }).withMessage('Cost per sqft must be a positive number'),
    body('amenities')
      .optional()
      .isArray().withMessage('Amenities must be an array'),
    body('amenities.*')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Amenity name must be between 2 and 100 characters')
  ],
  validate,
  createWarehouse
);

/**
 * @route PUT /api/warehouses/:id
 * @desc Update warehouse
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid warehouse ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    body('code')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Code must be between 2 and 50 characters')
      .matches(/^[A-Z0-9-]+$/i).withMessage('Code can only contain letters, numbers, and hyphens'),
    body('street')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Street must be less than 500 characters'),
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
    body('latitude')
      .optional()
      .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .optional()
      .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('capacity')
      .optional()
      .isInt({ min: 0 }).withMessage('Capacity must be a non-negative integer'),
    body('occupied')
      .optional()
      .isInt({ min: 0 }).withMessage('Occupied space must be a non-negative integer'),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid status'),
    body('is_verified')
      .optional()
      .isBoolean().withMessage('is_verified must be a boolean'),
    body('contact_person')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Contact person name must be less than 255 characters'),
    body('contact_phone')
      .optional()
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).withMessage('Invalid phone number'),
    body('contact_email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    body('cost_per_sqft')
      .optional()
      .isFloat({ min: 0 }).withMessage('Cost per sqft must be a positive number')
  ],
  validate,
  updateWarehouse
);

/**
 * @route PUT /api/warehouses/:id/amenities
 * @desc Update warehouse amenities
 * @access Private
 */
router.put(
  '/:id/amenities',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid warehouse ID'),
    body('amenities')
      .isArray().withMessage('Amenities must be an array'),
    body('amenities.*')
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Amenity name must be between 2 and 100 characters')
  ],
  validate,
  updateAmenities
);

/**
 * @route DELETE /api/warehouses/:id
 * @desc Delete warehouse
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid warehouse ID')
  ],
  validate,
  deleteWarehouse
);

export default router;
