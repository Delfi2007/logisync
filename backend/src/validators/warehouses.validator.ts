/**
 * Warehouse Validators
 * 
 * Express-validator validation rules for warehouse endpoints.
 * Complements database constraints with request-level validation.
 * 
 * Phase 4 Task 5: Data Validation & Constraints
 * Date: October 16, 2025
 */

import { body, param, query } from 'express-validator';

/**
 * Validate warehouse creation
 */
export const validateCreateWarehouse = [
  body('name')
    .notEmpty()
    .withMessage('Warehouse name is required')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Warehouse name must be 2-255 characters'),

  body('code')
    .notEmpty()
    .withMessage('Warehouse code is required')
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Warehouse code must contain only uppercase letters, numbers, hyphens, and underscores')
    .isLength({ min: 3, max: 50 })
    .withMessage('Warehouse code must be 3-50 characters'),

  body('street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Street address must be 5-500 characters'),

  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),

  body('state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be 2-100 characters'),

  body('pincode')
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be exactly 6 digits')
    .custom((value) => {
      if (value) {
        const pincode = parseInt(value, 10);
        if (pincode < 110001 || pincode > 855118) {
          throw new Error('Invalid Indian pincode range');
        }
      }
      return true;
    }),

  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90 degrees'),

  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180 degrees'),

  // Custom validation: both latitude and longitude must be provided together
  body()
    .custom((value, { req }) => {
      const { latitude, longitude } = req.body;
      const hasLat = latitude !== null && latitude !== undefined;
      const hasLng = longitude !== null && longitude !== undefined;

      if ((hasLat && !hasLng) || (!hasLat && hasLng)) {
        throw new Error('Both latitude and longitude must be provided together');
      }
      return true;
    }),

  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1, max: 1000000 })
    .withMessage('Capacity must be between 1 and 1,000,000'),

  body('occupied')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Occupied space must be non-negative')
    .custom((value, { req }) => {
      const capacity = parseInt(req.body.capacity) || 0;
      const occupied = parseInt(value) || 0;
      
      if (occupied > capacity) {
        throw new Error('Occupied space cannot exceed capacity');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Status must be active, inactive, or maintenance'),

  body('is_verified')
    .optional()
    .isBoolean()
    .withMessage('is_verified must be a boolean'),

  body('operating_hours')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Operating hours must not exceed 255 characters'),

  body('contact_person')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Contact person name must be 2-255 characters'),

  body('contact_phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$|^\+91[0-9]{10}$/)
    .withMessage('Contact phone must be 10 digits or +91 followed by 10 digits'),

  body('cost_per_sqft')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost per sqft must be non-negative'),

  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),

  body('amenities.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each amenity must be 2-100 characters')
];

/**
 * Validate warehouse update
 */
export const validateUpdateWarehouse = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Warehouse name must be 2-255 characters'),

  body('code')
    .optional()
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Warehouse code must contain only uppercase letters, numbers, hyphens, and underscores')
    .isLength({ min: 3, max: 50 })
    .withMessage('Warehouse code must be 3-50 characters'),

  body('street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Street address must be 5-500 characters'),

  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),

  body('state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be 2-100 characters'),

  body('pincode')
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be exactly 6 digits'),

  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90 degrees'),

  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180 degrees'),

  body('capacity')
    .optional()
    .isInt({ min: 1, max: 1000000 })
    .withMessage('Capacity must be between 1 and 1,000,000'),

  body('occupied')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Occupied space must be non-negative'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Status must be active, inactive, or maintenance'),

  body('is_verified')
    .optional()
    .isBoolean()
    .withMessage('is_verified must be a boolean'),

  body('operating_hours')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Operating hours must not exceed 255 characters'),

  body('contact_person')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Contact person name must be 2-255 characters'),

  body('contact_phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$|^\+91[0-9]{10}$/)
    .withMessage('Contact phone must be 10 digits or +91 followed by 10 digits'),

  body('cost_per_sqft')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost per sqft must be non-negative'),

  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),

  body('amenities.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each amenity must be 2-100 characters')
];

/**
 * Validate warehouse capacity update
 */
export const validateUpdateCapacity = [
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1, max: 1000000 })
    .withMessage('Capacity must be between 1 and 1,000,000'),

  body('occupied')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Occupied space must be non-negative')
    .custom((value, { req }) => {
      const capacity = parseInt(req.body.capacity) || 0;
      const occupied = parseInt(value) || 0;
      
      if (occupied > capacity) {
        throw new Error('Occupied space cannot exceed capacity');
      }
      return true;
    })
];

/**
 * Validate warehouse status update
 */
export const validateUpdateWarehouseStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Status must be active, inactive, or maintenance'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

/**
 * Validate warehouse ID parameter
 */
export const validateWarehouseId = [
  param('id')
    .notEmpty()
    .withMessage('Warehouse ID is required')
    .isInt({ min: 1 })
    .withMessage('Warehouse ID must be a positive integer')
];

/**
 * Validate warehouse code parameter
 */
export const validateWarehouseCode = [
  param('code')
    .notEmpty()
    .withMessage('Warehouse code is required')
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Warehouse code must contain only uppercase letters, numbers, hyphens, and underscores')
];

/**
 * Validate warehouse search/filter query
 */
export const validateWarehouseQuery = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search query must not exceed 255 characters'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Invalid status filter'),

  query('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City filter must not exceed 100 characters'),

  query('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State filter must not exceed 100 characters'),

  query('pincode')
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be 6 digits'),

  query('is_verified')
    .optional()
    .isBoolean()
    .withMessage('is_verified must be true or false'),

  query('min_capacity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum capacity must be non-negative'),

  query('max_capacity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum capacity must be non-negative'),

  query('has_amenity')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Amenity filter must not exceed 100 characters'),

  query('sort_by')
    .optional()
    .isIn(['name', 'code', 'city', 'capacity', 'occupied', 'created_at', 'status'])
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
 * Validate nearby warehouse search
 */
export const validateNearbyWarehouseSearch = [
  query('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90 degrees'),

  query('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180 degrees'),

  query('radius')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('Radius must be between 1 and 500 km'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Invalid status filter'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

/**
 * Validate bulk warehouse operation
 */
export const validateBulkWarehouseOperation = [
  body('warehouse_ids')
    .notEmpty()
    .withMessage('Warehouse IDs are required')
    .isArray({ min: 1, max: 100 })
    .withMessage('Warehouse IDs must be an array of 1-100 IDs'),

  body('warehouse_ids.*')
    .isInt({ min: 1 })
    .withMessage('Each warehouse ID must be a positive integer')
];

/**
 * Validate warehouse amenity management
 */
export const validateManageAmenities = [
  body('amenities')
    .notEmpty()
    .withMessage('Amenities are required')
    .isArray({ min: 1 })
    .withMessage('Amenities must be an array with at least one item'),

  body('amenities.*')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each amenity must be 2-100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Amenity can only contain letters, numbers, spaces, hyphens, and underscores')
];

/**
 * Validate warehouse export
 */
export const validateWarehouseExport = [
  query('format')
    .optional()
    .isIn(['csv', 'excel', 'pdf'])
    .withMessage('Format must be csv, excel, or pdf'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Invalid status filter'),

  query('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City filter must not exceed 100 characters')
];

/**
 * Validate warehouse utilization report
 */
export const validateUtilizationReport = [
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date (ISO 8601)'),

  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date (ISO 8601)'),

  query('warehouse_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Warehouse ID must be a positive integer'),

  query('group_by')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('group_by must be day, week, or month')
];

export default {
  validateCreateWarehouse,
  validateUpdateWarehouse,
  validateUpdateCapacity,
  validateUpdateWarehouseStatus,
  validateWarehouseId,
  validateWarehouseCode,
  validateWarehouseQuery,
  validateNearbyWarehouseSearch,
  validateBulkWarehouseOperation,
  validateManageAmenities,
  validateWarehouseExport,
  validateUtilizationReport
};
