import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Product Validators
 * Input validation for product/inventory endpoints
 */

/**
 * Validate product creation
 */
export const createProductValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters')
    .escape(),

  body('sku')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('SKU must be between 3 and 50 characters')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('SKU can only contain uppercase letters, numbers, and hyphens'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .escape(),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
    .toFloat(),

  body('cost')
    .notEmpty()
    .withMessage('Cost is required')
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price && value > req.body.price) {
        throw new Error('Cost cannot be greater than price');
      }
      return true;
    }),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
    .toInt(),

  body('reorderLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reorder level must be a non-negative integer')
    .toInt(),

  body('unit')
    .optional()
    .trim()
    .isIn(['pieces', 'kg', 'liters', 'meters', 'boxes'])
    .withMessage('Invalid unit type'),

  body('supplier')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Supplier name must be less than 200 characters')
    .escape(),

  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid image URL'),
];

/**
 * Validate product update
 */
export const updateProductValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid product ID')
    .toInt(),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters')
    .escape(),

  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .escape(),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
    .toFloat(),

  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number')
    .toFloat(),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
    .toInt(),

  body('reorderLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reorder level must be a non-negative integer')
    .toInt(),
];

/**
 * Validate stock update
 */
export const updateStockValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid product ID')
    .toInt(),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt()
    .withMessage('Quantity must be an integer')
    .toInt(),

  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['add', 'subtract', 'set'])
    .withMessage('Type must be either add, subtract, or set'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason must be less than 500 characters')
    .escape(),
];

/**
 * Validate product ID parameter
 */
export const productIdValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid product ID')
    .toInt(),
];

/**
 * Validate product search/filter query
 */
export const productSearchValidation: ValidationChain[] = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search query too long')
    .escape(),

  query('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category filter too long')
    .escape(),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number')
    .toFloat(),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number')
    .toFloat(),

  query('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean')
    .toBoolean(),

  query('lowStock')
    .optional()
    .isBoolean()
    .withMessage('lowStock must be a boolean')
    .toBoolean(),

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
    .isIn(['name', 'price', 'stock', 'created_at'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

/**
 * Validate bulk delete
 */
export const bulkDeleteValidation: ValidationChain[] = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs array is required and must not be empty'),

  body('ids.*')
    .isInt({ min: 1 })
    .withMessage('Each ID must be a positive integer')
    .toInt(),
];
