/**
 * Audit Trail Service
 * 
 * Tracks all data modifications for:
 * - Compliance
 * - Security auditing
 * - Change history
 * - Rollback capability
 * - User accountability
 * 
 * @module services/audit.service
 */

import pool from '../config/database';
import logger from '../config/logger';

// ============================================
// INTERFACES
// ============================================

export interface AuditEntry {
  user_id?: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ACCESS' | 'EXPORT' | 'IMPORT';
  entity_type: string;
  entity_id?: number | string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  description?: string;
  metadata?: any;
}

export interface AuditQuery {
  user_id?: number;
  entity_type?: string;
  entity_id?: number | string;
  action?: string;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
  offset?: number;
}

// ============================================
// AUDIT SERVICE
// ============================================

class AuditService {
  /**
   * Create database table if not exists
   */
  async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS audit_trail (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(100),
        old_values JSONB,
        new_values JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_audit_user (user_id),
        INDEX idx_audit_entity (entity_type, entity_id),
        INDEX idx_audit_action (action),
        INDEX idx_audit_created (created_at)
      );
    `;

    try {
      await pool.query(query);
    } catch (error: any) {
      if (!error.message.includes('already exists')) {
        logger.error('Failed to create audit_trail table', { error: error.message });
      }
    }
  }

  /**
   * Log audit entry
   */
  async log(entry: AuditEntry): Promise<number | null> {
    try {
      const query = `
        INSERT INTO audit_trail (
          user_id, action, entity_type, entity_id,
          old_values, new_values, ip_address, user_agent,
          description, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `;

      const values = [
        entry.user_id || null,
        entry.action,
        entry.entity_type,
        entry.entity_id?.toString() || null,
        entry.old_values ? JSON.stringify(entry.old_values) : null,
        entry.new_values ? JSON.stringify(entry.new_values) : null,
        entry.ip_address || null,
        entry.user_agent || null,
        entry.description || null,
        entry.metadata ? JSON.stringify(entry.metadata) : null,
      ];

      const result = await pool.query(query, values);
      return result.rows[0].id;
    } catch (error: any) {
      logger.error('Failed to log audit entry', { error: error.message, entry });
      return null;
    }
  }

  /**
   * Log create operation
   */
  async logCreate(
    userId: number | undefined,
    entityType: string,
    entityId: number | string,
    data: any,
    context?: { ip?: string; userAgent?: string }
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: 'CREATE',
      entity_type: entityType,
      entity_id: entityId,
      new_values: data,
      ip_address: context?.ip,
      user_agent: context?.userAgent,
      description: `Created ${entityType} #${entityId}`,
    });
  }

  /**
   * Log update operation
   */
  async logUpdate(
    userId: number | undefined,
    entityType: string,
    entityId: number | string,
    oldData: any,
    newData: any,
    context?: { ip?: string; userAgent?: string }
  ): Promise<void> {
    // Calculate changed fields
    const changes: any = {};
    for (const key in newData) {
      if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        changes[key] = { from: oldData[key], to: newData[key] };
      }
    }

    await this.log({
      user_id: userId,
      action: 'UPDATE',
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldData,
      new_values: newData,
      ip_address: context?.ip,
      user_agent: context?.userAgent,
      description: `Updated ${entityType} #${entityId}`,
      metadata: { changed_fields: Object.keys(changes) },
    });
  }

  /**
   * Log delete operation
   */
  async logDelete(
    userId: number | undefined,
    entityType: string,
    entityId: number | string,
    data: any,
    context?: { ip?: string; userAgent?: string }
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: 'DELETE',
      entity_type: entityType,
      entity_id: entityId,
      old_values: data,
      ip_address: context?.ip,
      user_agent: context?.userAgent,
      description: `Deleted ${entityType} #${entityId}`,
    });
  }

  /**
   * Log user login
   */
  async logLogin(
    userId: number,
    success: boolean,
    context?: { ip?: string; userAgent?: string; reason?: string }
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: 'LOGIN',
      entity_type: 'user',
      entity_id: userId,
      ip_address: context?.ip,
      user_agent: context?.userAgent,
      description: success ? 'User logged in' : 'Login failed',
      metadata: { success, reason: context?.reason },
    });
  }

  /**
   * Log user logout
   */
  async logLogout(
    userId: number,
    context?: { ip?: string; userAgent?: string }
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: 'LOGOUT',
      entity_type: 'user',
      entity_id: userId,
      ip_address: context?.ip,
      user_agent: context?.userAgent,
      description: 'User logged out',
    });
  }

  /**
   * Log data access
   */
  async logAccess(
    userId: number | undefined,
    entityType: string,
    entityId: number | string,
    context?: { ip?: string; userAgent?: string }
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: 'ACCESS',
      entity_type: entityType,
      entity_id: entityId,
      ip_address: context?.ip,
      user_agent: context?.userAgent,
      description: `Accessed ${entityType} #${entityId}`,
    });
  }

  /**
   * Log data export
   */
  async logExport(
    userId: number | undefined,
    entityType: string,
    format: string,
    count: number,
    context?: { ip?: string; userAgent?: string; filters?: any }
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: 'EXPORT',
      entity_type: entityType,
      ip_address: context?.ip,
      user_agent: context?.userAgent,
      description: `Exported ${count} ${entityType} records as ${format}`,
      metadata: { format, count, filters: context?.filters },
    });
  }

  /**
   * Log data import
   */
  async logImport(
    userId: number | undefined,
    entityType: string,
    count: number,
    context?: { ip?: string; userAgent?: string; filename?: string }
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: 'IMPORT',
      entity_type: entityType,
      ip_address: context?.ip,
      user_agent: context?.userAgent,
      description: `Imported ${count} ${entityType} records`,
      metadata: { count, filename: context?.filename },
    });
  }

  /**
   * Query audit trail
   */
  async query(params: AuditQuery): Promise<any[]> {
    try {
      const conditions: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (params.user_id) {
        conditions.push(`user_id = $${paramIndex++}`);
        values.push(params.user_id);
      }

      if (params.entity_type) {
        conditions.push(`entity_type = $${paramIndex++}`);
        values.push(params.entity_type);
      }

      if (params.entity_id) {
        conditions.push(`entity_id = $${paramIndex++}`);
        values.push(params.entity_id.toString());
      }

      if (params.action) {
        conditions.push(`action = $${paramIndex++}`);
        values.push(params.action);
      }

      if (params.start_date) {
        conditions.push(`created_at >= $${paramIndex++}`);
        values.push(params.start_date);
      }

      if (params.end_date) {
        conditions.push(`created_at <= $${paramIndex++}`);
        values.push(params.end_date);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = params.limit || 100;
      const offset = params.offset || 0;

      const query = `
        SELECT 
          a.*,
          u.email as user_email,
          u.name as user_name
        FROM audit_trail a
        LEFT JOIN users u ON a.user_id = u.id
        ${whereClause}
        ORDER BY a.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      values.push(limit, offset);

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error: any) {
      logger.error('Failed to query audit trail', { error: error.message, params });
      return [];
    }
  }

  /**
   * Get entity change history
   */
  async getEntityHistory(entityType: string, entityId: number | string): Promise<any[]> {
    return this.query({
      entity_type: entityType,
      entity_id: entityId,
      limit: 100,
    });
  }

  /**
   * Get user activity
   */
  async getUserActivity(userId: number, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.query({
      user_id: userId,
      start_date: startDate,
      limit: 1000,
    });
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 50): Promise<any[]> {
    return this.query({ limit });
  }

  /**
   * Get audit statistics
   */
  async getStatistics(days: number = 30): Promise<any> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_entries,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT entity_type) as entity_types,
          COUNT(CASE WHEN action = 'CREATE' THEN 1 END) as creates,
          COUNT(CASE WHEN action = 'UPDATE' THEN 1 END) as updates,
          COUNT(CASE WHEN action = 'DELETE' THEN 1 END) as deletes,
          COUNT(CASE WHEN action = 'LOGIN' THEN 1 END) as logins,
          COUNT(CASE WHEN action = 'ACCESS' THEN 1 END) as accesses
        FROM audit_trail
        WHERE created_at >= NOW() - INTERVAL '${days} days'
      `;

      const result = await pool.query(query);
      return result.rows[0];
    } catch (error: any) {
      logger.error('Failed to get audit statistics', { error: error.message });
      return null;
    }
  }

  /**
   * Clean up old audit entries
   */
  async cleanup(daysToKeep: number = 365): Promise<number> {
    try {
      const query = `
        DELETE FROM audit_trail
        WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
      `;

      const result = await pool.query(query);
      logger.info(`Cleaned up ${result.rowCount} old audit entries`);
      return result.rowCount || 0;
    } catch (error: any) {
      logger.error('Failed to cleanup audit trail', { error: error.message });
      return 0;
    }
  }
}

export default new AuditService();
