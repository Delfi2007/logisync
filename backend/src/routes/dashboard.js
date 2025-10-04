import express from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import {
  getDashboardStats,
  getRecentOrders,
  getLowStockProducts,
  getTopCustomers,
  getRevenueChart,
  getOrderStatusDistribution,
  getProductCategoryDistribution,
  getCustomerSegmentDistribution,
  getWarehouseUtilization,
  getAllDashboardData
} from '../controllers/dashboardController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/dashboard
 * @desc Get all dashboard data (combined endpoint)
 * @access Private
 */
router.get('/', getAllDashboardData);

/**
 * @route GET /api/dashboard/stats
 * @desc Get dashboard overview statistics
 * @access Private
 */
router.get('/stats', getDashboardStats);

/**
 * @route GET /api/dashboard/recent-orders
 * @desc Get recent orders
 * @access Private
 */
router.get(
  '/recent-orders',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  validate,
  getRecentOrders
);

/**
 * @route GET /api/dashboard/low-stock
 * @desc Get products with low stock
 * @access Private
 */
router.get(
  '/low-stock',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  validate,
  getLowStockProducts
);

/**
 * @route GET /api/dashboard/top-customers
 * @desc Get top customers by revenue
 * @access Private
 */
router.get(
  '/top-customers',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  validate,
  getTopCustomers
);

/**
 * @route GET /api/dashboard/revenue-chart
 * @desc Get revenue chart data
 * @access Private
 */
router.get(
  '/revenue-chart',
  [
    query('period').optional().isIn(['7days', '30days', '12months']).withMessage('Period must be 7days, 30days, or 12months')
  ],
  validate,
  getRevenueChart
);

/**
 * @route GET /api/dashboard/order-status
 * @desc Get order status distribution
 * @access Private
 */
router.get('/order-status', getOrderStatusDistribution);

/**
 * @route GET /api/dashboard/product-categories
 * @desc Get product category distribution
 * @access Private
 */
router.get('/product-categories', getProductCategoryDistribution);

/**
 * @route GET /api/dashboard/customer-segments
 * @desc Get customer segment distribution
 * @access Private
 */
router.get('/customer-segments', getCustomerSegmentDistribution);

/**
 * @route GET /api/dashboard/warehouse-utilization
 * @desc Get warehouse utilization metrics
 * @access Private
 */
router.get('/warehouse-utilization', getWarehouseUtilization);

export default router;
