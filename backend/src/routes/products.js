import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validator.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getCategories,
  updateStock
} from '../controllers/productsController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/products/alerts/low-stock
 * @desc Get products with low stock
 * @access Private
 */
router.get('/alerts/low-stock', getLowStockProducts);

/**
 * @route GET /api/products/categories
 * @desc Get product categories with stats
 * @access Private
 */
router.get('/categories', getCategories);

/**
 * @route GET /api/products
 * @desc Get all products with filtering and pagination
 * @access Private
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isString().trim(),
    query('status').optional().isIn(['active', 'discontinued', 'out_of_stock']).withMessage('Invalid status'),
    query('search').optional().isString().trim(),
    query('sortBy').optional().isIn(['name', 'sku', 'price', 'stock', 'created_at', 'category']),
    query('order').optional().isIn(['ASC', 'DESC'])
  ],
  validate,
  getAllProducts
);

/**
 * @route GET /api/products/:id
 * @desc Get single product by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product ID')
  ],
  validate,
  getProductById
);

/**
 * @route POST /api/products
 * @desc Create new product
 * @access Private
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Product name is required')
      .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    body('sku')
      .trim()
      .notEmpty().withMessage('SKU is required')
      .isLength({ min: 2, max: 100 }).withMessage('SKU must be between 2 and 100 characters')
      .matches(/^[A-Z0-9-]+$/i).withMessage('SKU can only contain letters, numbers, and hyphens'),
    body('category')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters'),
    body('price')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number')
      .toFloat(),
    body('cost')
      .optional()
      .isFloat({ min: 0 }).withMessage('Cost must be a positive number')
      .toFloat(),
    body('stock')
      .optional()
      .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
      .toInt(),
    body('reorder_level')
      .optional()
      .isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer')
      .toInt(),
    body('supplier')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Supplier name must be less than 255 characters')
  ],
  validate,
  createProduct
);

/**
 * @route PUT /api/products/:id
 * @desc Update product
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    body('sku')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('SKU must be between 2 and 100 characters')
      .matches(/^[A-Z0-9-]+$/i).withMessage('SKU can only contain letters, numbers, and hyphens'),
    body('category')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Price must be a positive number')
      .toFloat(),
    body('cost')
      .optional()
      .isFloat({ min: 0 }).withMessage('Cost must be a positive number')
      .toFloat(),
    body('stock')
      .optional()
      .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
      .toInt(),
    body('reorder_level')
      .optional()
      .isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer')
      .toInt(),
    body('supplier')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Supplier name must be less than 255 characters'),
    body('status')
      .optional()
      .isIn(['active', 'discontinued', 'out_of_stock']).withMessage('Invalid status')
  ],
  validate,
  updateProduct
);

/**
 * @route PATCH /api/products/:id/stock
 * @desc Update product stock
 * @access Private
 */
router.patch(
  '/:id/stock',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
    body('adjustment')
      .isInt().withMessage('Adjustment must be an integer')
      .notEmpty().withMessage('Adjustment value is required'),
    body('type')
      .optional()
      .isIn(['purchase', 'sale', 'return', 'adjustment', 'damage']).withMessage('Invalid stock movement type'),
    body('reference')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Reference must be less than 255 characters')
  ],
  validate,
  updateStock
);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product ID')
  ],
  validate,
  deleteProduct
);

export default router;
