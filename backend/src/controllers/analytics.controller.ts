/**
 * Analytics Controller
 * 
 * Endpoints for accessing analytics data
 * 
 * @module controllers/analytics.controller
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError } from '../utils/errors';
import analyticsService from '../services/analytics.service';
import auditService from '../services/audit.service';

class AnalyticsController {
  /**
   * GET /analytics/events - Get event summary
   */
  getEventSummary = asyncHandler(async (req: Request, res: Response) => {
    const { start_date, end_date, user_id } = req.query;

    if (!start_date || !end_date) {
      throw new ValidationError('start_date and end_date are required');
    }

    const startDate = new Date(start_date as string);
    const endDate = new Date(end_date as string);

    const summary = await analyticsService.getEventSummary(
      startDate,
      endDate,
      user_id ? parseInt(user_id as string) : undefined
    );

    res.json({
      success: true,
      data: summary,
    });
  });

  /**
   * GET /analytics/metrics - Get business metrics
   */
  getMetricsSummary = asyncHandler(async (req: Request, res: Response) => {
    const { metric_type, start_date, end_date } = req.query;

    if (!metric_type || !start_date || !end_date) {
      throw new ValidationError('metric_type, start_date, and end_date are required');
    }

    const startDate = new Date(start_date as string);
    const endDate = new Date(end_date as string);

    const summary = await analyticsService.getMetricsSummary(
      metric_type as string,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: summary,
    });
  });

  /**
   * GET /analytics/users/active - Get active users count
   */
  getActiveUsers = asyncHandler(async (req: Request, res: Response) => {
    const { period = 'day' } = req.query;

    const count = await analyticsService.getActiveUsers(
      period as 'hour' | 'day' | 'week' | 'month'
    );

    res.json({
      success: true,
      data: { count, period },
    });
  });

  /**
   * GET /analytics/users/:id/activity - Get user activity
   */
  getUserActivity = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const activity = await analyticsService.getUserActivity(
      parseInt(id),
      parseInt(days as string)
    );

    res.json({
      success: true,
      data: activity,
    });
  });

  /**
   * GET /analytics/pages/popular - Get popular pages
   */
  getPopularPages = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 10, days = 7 } = req.query;

    const pages = await analyticsService.getPopularPages(
      parseInt(limit as string),
      parseInt(days as string)
    );

    res.json({
      success: true,
      data: pages,
    });
  });

  /**
   * GET /analytics/sessions - Get session statistics
   */
  getSessionStats = asyncHandler(async (req: Request, res: Response) => {
    const { days = 7 } = req.query;

    const stats = await analyticsService.getSessionStats(parseInt(days as string));

    res.json({
      success: true,
      data: stats,
    });
  });

  /**
   * GET /analytics/aggregated - Get aggregated metrics
   */
  getAggregatedMetrics = asyncHandler(async (req: Request, res: Response) => {
    const { metric_name, period, limit = 30 } = req.query;

    if (!metric_name || !period) {
      throw new ValidationError('metric_name and period are required');
    }

    const metrics = await analyticsService.getAggregatedMetrics(
      metric_name as string,
      period as string,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: metrics,
    });
  });

  /**
   * GET /analytics/dashboard - Get dashboard summary
   */
  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const { days = 7 } = req.query;
    const daysNum = parseInt(days as string);

    // Get multiple metrics in parallel
    const [
      activeUsersDay,
      activeUsersWeek,
      activeUsersMonth,
      sessionStats,
      popularPages,
    ] = await Promise.all([
      analyticsService.getActiveUsers('day'),
      analyticsService.getActiveUsers('week'),
      analyticsService.getActiveUsers('month'),
      analyticsService.getSessionStats(daysNum),
      analyticsService.getPopularPages(5, daysNum),
    ]);

    res.json({
      success: true,
      data: {
        activeUsers: {
          day: activeUsersDay,
          week: activeUsersWeek,
          month: activeUsersMonth,
        },
        sessions: sessionStats,
        popularPages,
      },
    });
  });

  /**
   * GET /audit - Query audit trail
   */
  getAuditTrail = asyncHandler(async (req: Request, res: Response) => {
    const {
      user_id,
      entity_type,
      entity_id,
      action,
      start_date,
      end_date,
      limit = 100,
      offset = 0,
    } = req.query;

    const entries = await auditService.query({
      user_id: user_id ? parseInt(user_id as string) : undefined,
      entity_type: entity_type as string | undefined,
      entity_id: entity_id as string | undefined,
      action: action as string | undefined,
      start_date: start_date ? new Date(start_date as string) : undefined,
      end_date: end_date ? new Date(end_date as string) : undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    res.json({
      success: true,
      data: entries,
    });
  });

  /**
   * GET /audit/entity/:type/:id - Get entity change history
   */
  getEntityHistory = asyncHandler(async (req: Request, res: Response) => {
    const { type, id } = req.params;

    const history = await auditService.getEntityHistory(type, id);

    res.json({
      success: true,
      data: history,
    });
  });

  /**
   * GET /audit/user/:id - Get user audit activity
   */
  getUserAudit = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const activity = await auditService.getUserActivity(
      parseInt(id),
      parseInt(days as string)
    );

    res.json({
      success: true,
      data: activity,
    });
  });

  /**
   * GET /audit/recent - Get recent audit entries
   */
  getRecentAudit = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 50 } = req.query;

    const entries = await auditService.getRecentActivity(parseInt(limit as string));

    res.json({
      success: true,
      data: entries,
    });
  });

  /**
   * GET /audit/stats - Get audit statistics
   */
  getAuditStats = asyncHandler(async (req: Request, res: Response) => {
    const { days = 30 } = req.query;

    const stats = await auditService.getStatistics(parseInt(days as string));

    res.json({
      success: true,
      data: stats,
    });
  });
}

export default new AnalyticsController();
