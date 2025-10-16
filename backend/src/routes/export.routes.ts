/**
 * Export Routes
 * 
 * Data export endpoints
 * 
 * @module routes/export.routes
 */

import express from 'express';
import { authenticate } from '../middleware/auth.enhanced';
import { apiRateLimiter } from '../middleware/rateLimiter';
import exportController from '../controllers/export.controller';

const router = express.Router();

// ============================================
// ROUTES
// ============================================

/**
 * @route   POST /api/export/orders
 * @desc    Export orders to CSV/Excel
 * @access  Private
 */
router.post(
  '/orders',
  authenticate,
  apiRateLimiter,
  exportController.exportOrders
);

/**
 * @route   POST /api/export/products
 * @desc    Export products to CSV/Excel
 * @access  Private
 */
router.post(
  '/products',
  authenticate,
  apiRateLimiter,
  exportController.exportProducts
);

/**
 * @route   POST /api/export/customers
 * @desc    Export customers to CSV/Excel
 * @access  Private
 */
router.post(
  '/customers',
  authenticate,
  apiRateLimiter,
  exportController.exportCustomers
);

/**
 * @route   POST /api/export/inventory
 * @desc    Export inventory to CSV/Excel
 * @access  Private
 */
router.post(
  '/inventory',
  authenticate,
  apiRateLimiter,
  exportController.exportInventory
);

/**
 * @route   POST /api/export/sales-report
 * @desc    Export sales report
 * @access  Private
 */
router.post(
  '/sales-report',
  authenticate,
  apiRateLimiter,
  exportController.exportSalesReport
);

/**
 * @route   GET /api/export/download/:filename
 * @desc    Download exported file
 * @access  Private
 */
router.get(
  '/download/:filename',
  authenticate,
  apiRateLimiter,
  exportController.downloadExport
);

export default router;
