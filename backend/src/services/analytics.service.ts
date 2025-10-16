/**
 * Analytics Service
 * 
 * Tracks user and system events for:
 * - User behavior analysis
 * - Business intelligence
 * - ML training data
 * - Performance monitoring
 * - Anomaly detection
 * 
 * @module services/analytics.service
 */

import pool from '../config/database';
import logger from '../config/logger';

// ============================================
// INTERFACES
// ============================================

export interface AnalyticsEvent {
  user_id?: number;
  event_type: string;
  event_category?: string;
  event_data?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  page_url?: string;
  referrer?: string;
}

export interface BusinessMetric {
  metric_type: string;
  entity_type?: string;
  entity_id?: number;
  metric_value: number;
  metric_unit?: string;
  metadata?: any;
}

export interface UserSession {
  user_id?: number;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
}

// ============================================
// ANALYTICS SERVICE
// ============================================

class AnalyticsService {
  /**
   * Track analytics event
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const query = `
        INSERT INTO analytics_events (
          user_id, event_type, event_category, event_data,
          ip_address, user_agent, session_id, page_url, referrer
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      const values = [
        event.user_id || null,
        event.event_type,
        event.event_category || null,
        event.event_data ? JSON.stringify(event.event_data) : null,
        event.ip_address || null,
        event.user_agent || null,
        event.session_id || null,
        event.page_url || null,
        event.referrer || null,
      ];

      await pool.query(query, values);
    } catch (error: any) {
      logger.error('Failed to track analytics event', { error: error.message, event });
    }
  }

  /**
   * Record business metric
   */
  async recordMetric(metric: BusinessMetric): Promise<void> {
    try {
      const query = `
        INSERT INTO business_metrics (
          metric_type, entity_type, entity_id, metric_value,
          metric_unit, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      const values = [
        metric.metric_type,
        metric.entity_type || null,
        metric.entity_id || null,
        metric.metric_value,
        metric.metric_unit || null,
        metric.metadata ? JSON.stringify(metric.metadata) : null,
      ];

      await pool.query(query, values);
    } catch (error: any) {
      logger.error('Failed to record business metric', { error: error.message, metric });
    }
  }

  /**
   * Create or update user session
   */
  async trackSession(session: UserSession): Promise<number> {
    try {
      // Check if session exists
      const checkQuery = `
        SELECT id FROM user_sessions
        WHERE session_token = $1 AND ended_at IS NULL
      `;
      const checkResult = await pool.query(checkQuery, [session.session_token]);

      if (checkResult.rows.length > 0) {
        // Update existing session
        const updateQuery = `
          UPDATE user_sessions
          SET last_activity = NOW()
          WHERE id = $1
          RETURNING id
        `;
        const result = await pool.query(updateQuery, [checkResult.rows[0].id]);
        return result.rows[0].id;
      } else {
        // Create new session
        const insertQuery = `
          INSERT INTO user_sessions (
            user_id, session_token, ip_address, user_agent,
            device_type, browser, os, country, city
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
        `;

        const values = [
          session.user_id || null,
          session.session_token,
          session.ip_address || null,
          session.user_agent || null,
          session.device_type || null,
          session.browser || null,
          session.os || null,
          session.country || null,
          session.city || null,
        ];

        const result = await pool.query(insertQuery, values);
        return result.rows[0].id;
      }
    } catch (error: any) {
      logger.error('Failed to track user session', { error: error.message, session });
      return 0;
    }
  }

  /**
   * End user session
   */
  async endSession(sessionToken: string): Promise<void> {
    try {
      const query = `
        UPDATE user_sessions
        SET ended_at = NOW()
        WHERE session_token = $1 AND ended_at IS NULL
      `;

      await pool.query(query, [sessionToken]);
    } catch (error: any) {
      logger.error('Failed to end user session', { error: error.message, sessionToken });
    }
  }

  /**
   * Get analytics summary for date range
   */
  async getEventSummary(startDate: Date, endDate: Date, userId?: number): Promise<any> {
    try {
      const query = `
        SELECT 
          event_type,
          event_category,
          COUNT(*) as count,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT session_id) as unique_sessions
        FROM analytics_events
        WHERE created_at BETWEEN $1 AND $2
        ${userId ? 'AND user_id = $3' : ''}
        GROUP BY event_type, event_category
        ORDER BY count DESC
      `;

      const values = userId ? [startDate, endDate, userId] : [startDate, endDate];
      const result = await pool.query(query, values);

      return result.rows;
    } catch (error: any) {
      logger.error('Failed to get event summary', { error: error.message });
      return [];
    }
  }

  /**
   * Get business metrics summary
   */
  async getMetricsSummary(metricType: string, startDate: Date, endDate: Date): Promise<any> {
    try {
      const query = `
        SELECT 
          metric_type,
          entity_type,
          COUNT(*) as count,
          AVG(metric_value) as avg_value,
          MIN(metric_value) as min_value,
          MAX(metric_value) as max_value,
          SUM(metric_value) as total_value
        FROM business_metrics
        WHERE metric_type = $1
        AND created_at BETWEEN $2 AND $3
        GROUP BY metric_type, entity_type
      `;

      const result = await pool.query(query, [metricType, startDate, endDate]);
      return result.rows;
    } catch (error: any) {
      logger.error('Failed to get metrics summary', { error: error.message });
      return [];
    }
  }

  /**
   * Get user activity stats
   */
  async getUserActivity(userId: number, days: number = 30): Promise<any> {
    try {
      const query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as event_count,
          COUNT(DISTINCT event_type) as unique_events,
          COUNT(DISTINCT session_id) as sessions
        FROM analytics_events
        WHERE user_id = $1
        AND created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `;

      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error: any) {
      logger.error('Failed to get user activity', { error: error.message, userId });
      return [];
    }
  }

  /**
   * Get popular pages
   */
  async getPopularPages(limit: number = 10, days: number = 7): Promise<any> {
    try {
      const query = `
        SELECT 
          page_url,
          COUNT(*) as views,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT session_id) as unique_sessions
        FROM analytics_events
        WHERE page_url IS NOT NULL
        AND created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY page_url
        ORDER BY views DESC
        LIMIT $1
      `;

      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error: any) {
      logger.error('Failed to get popular pages', { error: error.message });
      return [];
    }
  }

  /**
   * Get active users count
   */
  async getActiveUsers(period: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<number> {
    try {
      const intervals = {
        hour: '1 hour',
        day: '1 day',
        week: '7 days',
        month: '30 days',
      };

      const query = `
        SELECT COUNT(DISTINCT user_id) as count
        FROM analytics_events
        WHERE user_id IS NOT NULL
        AND created_at >= NOW() - INTERVAL '${intervals[period]}'
      `;

      const result = await pool.query(query);
      return parseInt(result.rows[0].count) || 0;
    } catch (error: any) {
      logger.error('Failed to get active users', { error: error.message });
      return 0;
    }
  }

  /**
   * Get session statistics
   */
  async getSessionStats(days: number = 7): Promise<any> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(DISTINCT user_id) as unique_users,
          AVG(EXTRACT(EPOCH FROM (COALESCE(ended_at, NOW()) - started_at))) as avg_duration_seconds,
          COUNT(CASE WHEN device_type = 'mobile' THEN 1 END) as mobile_sessions,
          COUNT(CASE WHEN device_type = 'desktop' THEN 1 END) as desktop_sessions,
          COUNT(CASE WHEN device_type = 'tablet' THEN 1 END) as tablet_sessions
        FROM user_sessions
        WHERE started_at >= NOW() - INTERVAL '${days} days'
      `;

      const result = await pool.query(query);
      return result.rows[0];
    } catch (error: any) {
      logger.error('Failed to get session stats', { error: error.message });
      return null;
    }
  }

  /**
   * Get aggregated metrics (from pre-computed table)
   */
  async getAggregatedMetrics(metricName: string, period: string, limit: number = 30): Promise<any> {
    try {
      const query = `
        SELECT 
          metric_date,
          metric_value,
          metadata
        FROM aggregated_metrics
        WHERE metric_name = $1
        AND period = $2
        ORDER BY metric_date DESC
        LIMIT $3
      `;

      const result = await pool.query(query, [metricName, period, limit]);
      return result.rows;
    } catch (error: any) {
      logger.error('Failed to get aggregated metrics', { error: error.message });
      return [];
    }
  }

  /**
   * Track order fulfillment time (for ML training)
   */
  async trackOrderMetrics(orderId: number, metrics: {
    processingTime?: number;
    deliveryTime?: number;
    distance?: number;
    cost?: number;
    route?: string;
  }): Promise<void> {
    try {
      if (metrics.processingTime) {
        await this.recordMetric({
          metric_type: 'order_processing_time',
          entity_type: 'order',
          entity_id: orderId,
          metric_value: metrics.processingTime,
          metric_unit: 'minutes',
        });
      }

      if (metrics.deliveryTime) {
        await this.recordMetric({
          metric_type: 'delivery_time',
          entity_type: 'order',
          entity_id: orderId,
          metric_value: metrics.deliveryTime,
          metric_unit: 'hours',
        });
      }

      if (metrics.distance) {
        await this.recordMetric({
          metric_type: 'delivery_distance',
          entity_type: 'order',
          entity_id: orderId,
          metric_value: metrics.distance,
          metric_unit: 'km',
        });
      }

      if (metrics.cost) {
        await this.recordMetric({
          metric_type: 'delivery_cost',
          entity_type: 'order',
          entity_id: orderId,
          metric_value: metrics.cost,
          metric_unit: 'INR',
        });
      }

      if (metrics.route) {
        await this.recordMetric({
          metric_type: 'delivery_route',
          entity_type: 'order',
          entity_id: orderId,
          metric_value: 1,
          metadata: { route: metrics.route },
        });
      }
    } catch (error: any) {
      logger.error('Failed to track order metrics', { error: error.message, orderId });
    }
  }

  /**
   * Track inventory metrics (for ML training)
   */
  async trackInventoryMetrics(productId: number, metrics: {
    stockLevel?: number;
    turnoverRate?: number;
    daysUntilReorder?: number;
  }): Promise<void> {
    try {
      if (metrics.stockLevel !== undefined) {
        await this.recordMetric({
          metric_type: 'stock_level',
          entity_type: 'product',
          entity_id: productId,
          metric_value: metrics.stockLevel,
          metric_unit: 'units',
        });
      }

      if (metrics.turnoverRate) {
        await this.recordMetric({
          metric_type: 'inventory_turnover',
          entity_type: 'product',
          entity_id: productId,
          metric_value: metrics.turnoverRate,
          metric_unit: 'ratio',
        });
      }

      if (metrics.daysUntilReorder) {
        await this.recordMetric({
          metric_type: 'days_until_reorder',
          entity_type: 'product',
          entity_id: productId,
          metric_value: metrics.daysUntilReorder,
          metric_unit: 'days',
        });
      }
    } catch (error: any) {
      logger.error('Failed to track inventory metrics', { error: error.message, productId });
    }
  }
}

export default new AnalyticsService();
