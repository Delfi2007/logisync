/**
 * Health Check Routes
 * 
 * @module routes/health.routes
 */

import { Router } from 'express';
import healthController from '../controllers/health.controller';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Get overall system health
 * @access  Public
 */
router.get('/', healthController.getHealth);

/**
 * @route   GET /api/health/live
 * @desc    Liveness probe (Kubernetes)
 * @access  Public
 */
router.get('/live', healthController.getLiveness);

/**
 * @route   GET /api/health/ready
 * @desc    Readiness probe (Kubernetes)
 * @access  Public
 */
router.get('/ready', healthController.getReadiness);

/**
 * @route   GET /api/health/database
 * @desc    Database health check
 * @access  Public
 */
router.get('/database', healthController.getDatabaseHealth);

/**
 * @route   GET /api/health/system
 * @desc    System information and metrics
 * @access  Public
 */
router.get('/system', healthController.getSystemInfo);

/**
 * @route   GET /api/health/metrics
 * @desc    Performance metrics
 * @access  Public
 */
router.get('/metrics', healthController.getMetrics);

export default router;
