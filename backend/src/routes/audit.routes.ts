/**
 * Audit Routes
 * 
 * @module routes/audit.routes
 */

import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(apiRateLimiter);

// Audit endpoints
router.get('/', analyticsController.getAuditTrail);
router.get('/entity/:type/:id', analyticsController.getEntityHistory);
router.get('/user/:id', analyticsController.getUserAudit);
router.get('/recent', analyticsController.getRecentAudit);
router.get('/stats', analyticsController.getAuditStats);

export default router;
