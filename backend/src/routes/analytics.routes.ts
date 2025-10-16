/**
 * Analytics Routes
 * 
 * @module routes/analytics.routes
 */

import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(apiRateLimiter);

// Analytics endpoints
router.get('/events', analyticsController.getEventSummary);
router.get('/metrics', analyticsController.getMetricsSummary);
router.get('/users/active', analyticsController.getActiveUsers);
router.get('/users/:id/activity', analyticsController.getUserActivity);
router.get('/pages/popular', analyticsController.getPopularPages);
router.get('/sessions', analyticsController.getSessionStats);
router.get('/aggregated', analyticsController.getAggregatedMetrics);
router.get('/dashboard', analyticsController.getDashboard);

export default router;
