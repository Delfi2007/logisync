/**
 * User Management Service
 * Handles user operations, role assignments, and status management
 */

import pool from '../config/database.js';
import bcrypt from 'bcrypt';

class UserService {
  /**
   * Get all users with their roles (admin only)
   * @param {Object} filters - { search, role, status, page, limit }
   */
  async getAllUsers(filters = {}) {
    const {
      search = '',
      role = null,
      status = null,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.is_active,
        u.is_verified,
        u.last_login,
        u.created_at,
        u.updated_at,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', r.id,
            'name', r.name,
            'description', r.description,
            'assigned_at', ur.assigned_at
          ) ORDER BY r.name
        ) FILTER (WHERE r.id IS NOT NULL) as roles,
        COUNT(DISTINCT ual.id) as activity_count
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN user_activity_log ual ON u.id = ual.user_id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Search filter
    if (search) {
      query += ` AND (
        u.first_name ILIKE $${paramCount} OR
        u.last_name ILIKE $${paramCount} OR
        u.email ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Role filter
    if (role) {
      query += ` AND EXISTS (
        SELECT 1 FROM user_roles ur2
        JOIN roles r2 ON ur2.role_id = r2.id
        WHERE ur2.user_id = u.id AND r2.name = $${paramCount}
      )`;
      params.push(role);
      paramCount++;
    }

    // Status filter
    if (status !== null) {
      query += ` AND u.is_active = $${paramCount}`;
      params.push(status === 'active');
      paramCount++;
    }

    query += ` GROUP BY u.id`;

    // Sorting
    const allowedSortFields = ['first_name', 'last_name', 'email', 'created_at', 'last_login'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY u.${sortField} ${order}`;

    // Pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE 1=1
      ${search ? `AND (
        u.first_name ILIKE '${search}' OR
        u.last_name ILIKE '${search}' OR
        u.email ILIKE '${search}'
      )` : ''}
      ${role ? `AND EXISTS (
        SELECT 1 FROM user_roles ur2
        JOIN roles r2 ON ur2.role_id = r2.id
        WHERE ur2.user_id = u.id AND r2.name = '${role}'
      )` : ''}
      ${status !== null ? `AND u.is_active = ${status === 'active'}` : ''}
    `;

    const [usersResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      users: usersResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  /**
   * Get user by ID with roles and permissions
   */
  async getUserById(userId) {
    const result = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.is_active,
        u.is_verified,
        u.last_login,
        u.created_at,
        u.updated_at,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', r.id,
            'name', r.name,
            'description', r.description,
            'permissions', r.permissions,
            'assigned_at', ur.assigned_at,
            'assigned_by', ur.assigned_by
          ) ORDER BY r.name
        ) FILTER (WHERE r.id IS NOT NULL) as roles,
        array_agg(DISTINCT r.permissions) FILTER (WHERE r.id IS NOT NULL) as all_permissions
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];

    // Flatten permissions
    if (user.all_permissions) {
      const permissionsSet = new Set();
      user.all_permissions.forEach(permArray => {
        if (permArray) {
          permArray.forEach(perm => permissionsSet.add(perm));
        }
      });
      user.permissions = Array.from(permissionsSet);
    } else {
      user.permissions = [];
    }
    delete user.all_permissions;

    return user;
  }

  /**
   * Assign roles to a user
   * @param {number} userId - User ID
   * @param {number[]} roleIds - Array of role IDs
   * @param {number} assignedBy - Admin user ID who is assigning
   */
  async assignRoles(userId, roleIds, assignedBy) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Validate user exists
      const userCheck = await client.query(
        'SELECT id FROM users WHERE id = $1',
        [userId]
      );

      if (userCheck.rows.length === 0) {
        throw new Error('User not found');
      }

      // Validate all role IDs exist
      if (roleIds.length > 0) {
        const roleCheck = await client.query(
          'SELECT id FROM roles WHERE id = ANY($1)',
          [roleIds]
        );

        if (roleCheck.rows.length !== roleIds.length) {
          throw new Error('One or more invalid role IDs');
        }
      }

      // Remove all existing roles
      await client.query(
        'DELETE FROM user_roles WHERE user_id = $1',
        [userId]
      );

      // Add new roles
      if (roleIds.length > 0) {
        const values = roleIds.map((roleId, index) => 
          `($1, $${index + 2}, $${roleIds.length + 2})`
        ).join(', ');

        await client.query(
          `INSERT INTO user_roles (user_id, role_id, assigned_by)
           VALUES ${values}`,
          [userId, ...roleIds, assignedBy]
        );
      }

      // Log activity
      await client.query(
        `INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, metadata)
         VALUES ($1, 'roles_updated', 'user', $2, $3)`,
        [assignedBy, userId, JSON.stringify({ roleIds })]
      );

      await client.query('COMMIT');

      // Get updated user with roles
      return await this.getUserById(userId);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Add a single role to a user (append, don't replace)
   */
  async addRole(userId, roleId, assignedBy) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if role is already assigned
      const existing = await client.query(
        'SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2',
        [userId, roleId]
      );

      if (existing.rows.length > 0) {
        throw new Error('User already has this role');
      }

      // Add role
      await client.query(
        `INSERT INTO user_roles (user_id, role_id, assigned_by)
         VALUES ($1, $2, $3)`,
        [userId, roleId, assignedBy]
      );

      // Log activity
      await client.query(
        `INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, metadata)
         VALUES ($1, 'role_added', 'user', $2, $3)`,
        [assignedBy, userId, JSON.stringify({ roleId })]
      );

      await client.query('COMMIT');

      return await this.getUserById(userId);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Remove a role from a user
   */
  async removeRole(userId, roleId, removedBy) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING *',
        [userId, roleId]
      );

      if (result.rows.length === 0) {
        throw new Error('User does not have this role');
      }

      // Log activity
      await client.query(
        `INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, metadata)
         VALUES ($1, 'role_removed', 'user', $2, $3)`,
        [removedBy, userId, JSON.stringify({ roleId })]
      );

      await client.query('COMMIT');

      return await this.getUserById(userId);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update user status (activate/deactivate)
   */
  async updateUserStatus(userId, isActive, updatedBy) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Prevent admin from deactivating themselves
      if (userId === updatedBy && !isActive) {
        throw new Error('You cannot deactivate your own account');
      }

      const result = await client.query(
        `UPDATE users 
         SET is_active = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [isActive, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      // Revoke all refresh tokens if deactivating
      if (!isActive) {
        await client.query(
          `UPDATE refresh_tokens 
           SET revoked_at = CURRENT_TIMESTAMP
           WHERE user_id = $1 AND revoked_at IS NULL`,
          [userId]
        );
      }

      // Log activity
      await client.query(
        `INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, metadata)
         VALUES ($1, $2, 'user', $3, '{}')`,
        [updatedBy, isActive ? 'user_activated' : 'user_deactivated', userId]
      );

      await client.query('COMMIT');

      return await this.getUserById(userId);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user activity log
   */
  async getUserActivity(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      action = null,
      startDate = null,
      endDate = null
    } = options;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        id,
        user_id,
        action,
        resource_type,
        resource_id,
        ip_address,
        user_agent,
        metadata,
        created_at
      FROM user_activity_log
      WHERE user_id = $1
    `;

    const params = [userId];
    let paramCount = 2;

    if (action) {
      query += ` AND action = $${paramCount}`;
      params.push(action);
      paramCount++;
    }

    if (startDate) {
      query += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_activity_log
      WHERE user_id = $1
      ${action ? `AND action = '${action}'` : ''}
      ${startDate ? `AND created_at >= '${startDate}'` : ''}
      ${endDate ? `AND created_at <= '${endDate}'` : ''}
    `;

    const [activitiesResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, [userId])
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      activities: activitiesResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  /**
   * Get all activity log (admin only)
   */
  async getAllActivity(options = {}) {
    const {
      page = 1,
      limit = 50,
      userId = null,
      action = null,
      startDate = null,
      endDate = null
    } = options;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        ual.id,
        ual.user_id,
        ual.action,
        ual.resource_type,
        ual.resource_id,
        ual.ip_address,
        ual.user_agent,
        ual.metadata,
        ual.created_at,
        u.first_name,
        u.last_name,
        u.email
      FROM user_activity_log ual
      JOIN users u ON ual.user_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (userId) {
      query += ` AND ual.user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    if (action) {
      query += ` AND ual.action = $${paramCount}`;
      params.push(action);
      paramCount++;
    }

    if (startDate) {
      query += ` AND ual.created_at >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND ual.created_at <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    query += ` ORDER BY ual.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM user_activity_log WHERE 1=1';
    if (userId) countQuery += ` AND user_id = ${userId}`;
    if (action) countQuery += ` AND action = '${action}'`;
    if (startDate) countQuery += ` AND created_at >= '${startDate}'`;
    if (endDate) countQuery += ` AND created_at <= '${endDate}'`;

    const [activitiesResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      activities: activitiesResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }
}

export default new UserService();
