/**
 * Health Check Controller
 * 
 * Endpoints for monitoring system health
 * 
 * @module controllers/health.controller
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import healthService from '../services/health.service';

class HealthController {
  /**
   * GET /health - Basic health check
   */
  getHealth = asyncHandler(async (req: Request, res: Response) => {
    const health = await healthService.getHealth();

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json({
      success: true,
      data: health,
    });
  });

  /**
   * GET /health/live - Liveness probe (for Kubernetes)
   */
  getLiveness = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /health/ready - Readiness probe (for Kubernetes)
   */
  getReadiness = asyncHandler(async (req: Request, res: Response) => {
    const health = await healthService.getHealth();

    if (health.status === 'unhealthy') {
      return res.status(503).json({
        success: false,
        status: 'not ready',
        reason: 'System unhealthy',
        checks: health.checks,
      });
    }

    res.status(200).json({
      success: true,
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /health/database - Database health check
   */
  getDatabaseHealth = asyncHandler(async (req: Request, res: Response) => {
    const check = await healthService.checkDatabase();

    const statusCode = check.status === 'ok' ? 200 : check.status === 'warning' ? 200 : 503;

    res.status(statusCode).json({
      success: true,
      data: check,
    });
  });

  /**
   * GET /health/system - System information
   */
  getSystemInfo = asyncHandler(async (req: Request, res: Response) => {
    const systemInfo = healthService.getSystemInfo();
    const metrics = healthService.getPerformanceMetrics();

    res.json({
      success: true,
      data: {
        system: systemInfo,
        metrics,
      },
    });
  });

  /**
   * GET /health/metrics - Performance metrics
   */
  getMetrics = asyncHandler(async (req: Request, res: Response) => {
    const metrics = healthService.getPerformanceMetrics();

    res.json({
      success: true,
      data: metrics,
    });
  });
}

export default new HealthController();
