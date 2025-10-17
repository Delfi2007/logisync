import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validator.js';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  getOrderStats
} from '../controllers/ordersController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/orders/stats
 * @desc Get order statistics
 * @access Private
 */
router.get('/stats', getOrderStats);

/**
 * @route GET /api/orders
 * @desc Get all orders with filtering and pagination
 * @access Private
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),
    query('payment_status').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
    query('customer_id').optional().isInt({ min: 1 }).withMessage('Invalid customer ID'),
    query('search').optional().isString().trim(),
    query('sortBy').optional().isIn(['order_number', 'status', 'total_amount', 'created_at', 'delivered_at']),
    query('order').optional().isIn(['ASC', 'DESC'])
  ],
  validate,
  getAllOrders
);

/**
 * @route GET /api/orders/:id
 * @desc Get single order with items
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid order ID')
  ],
  validate,
  getOrderById
);

/**
 * @route POST /api/orders
 * @desc Create new order with items
 * @access Private
 */
router.post(
  '/',
  [
    body('customer_id')
      .isInt({ min: 1 }).withMessage('Valid customer ID is required'),
    body('items')
      .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.product_id')
      .isInt({ min: 1 }).withMessage('Valid product ID is required'),
    body('items.*.quantity')
      .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.unit_price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Unit price must be positive'),
    body('shipping_street')
      .trim()
      .notEmpty().withMessage('Shipping street is required')
      .isLength({ max: 500 }).withMessage('Street must be less than 500 characters'),
    body('shipping_city')
      .trim()
      .notEmpty().withMessage('Shipping city is required')
      .isLength({ max: 100 }).withMessage('City must be less than 100 characters'),
    body('shipping_state')
      .trim()
      .notEmpty().withMessage('Shipping state is required')
      .isLength({ max: 100 }).withMessage('State must be less than 100 characters'),
    body('shipping_pincode')
      .trim()
      .notEmpty().withMessage('Shipping pincode is required')
      .matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
    body('payment_method')
      .optional()
      .isIn(['cash', 'card', 'upi', 'netbanking', 'wallet']).withMessage('Invalid payment method'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
  ],
  validate,
  createOrder
);

/**
 * @route PUT /api/orders/:id/status
 * @desc Update order status
 * @access Private
 */
router.put(
  '/:id/status',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid order ID'),
    body('status')
      .optional()
      .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
      .withMessage('Invalid order status'),
    body('payment_status')
      .optional()
      .isIn(['pending', 'paid', 'failed', 'refunded'])
      .withMessage('Invalid payment status')
  ],
  validate,
  updateOrderStatus
);

/**
 * @route PUT /api/orders/:id
 * @desc Update order details
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid order ID'),
    body('shipping_street')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Street must be less than 500 characters'),
    body('shipping_city')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('City must be less than 100 characters'),
    body('shipping_state')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('State must be less than 100 characters'),
    body('shipping_pincode')
      .optional()
      .trim()
      .matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
    body('payment_method')
      .optional()
      .isIn(['cash', 'card', 'upi', 'netbanking', 'wallet']).withMessage('Invalid payment method'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
  ],
  validate,
  updateOrder
);

/**
 * @route DELETE /api/orders/:id
 * @desc Delete order
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid order ID')
  ],
  validate,
  deleteOrder
);

export default router;
