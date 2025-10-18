/**
 * Role Management Service
 * Handles role operations and permissions
 */

import pool from '../config/database.js';

class RoleService {
  /**
   * Get all roles
   */
  async getAllRoles() {
    const result = await pool.query(
      `SELECT 
        r.id,
        r.name,
        r.description,
        r.permissions,
        r.created_at,
        COUNT(DISTINCT ur.user_id) as user_count
       FROM roles r
       LEFT JOIN user_roles ur ON r.id = ur.role_id
       GROUP BY r.id
       ORDER BY r.name`
    );

    return result.rows;
  }

  /**
   * Get role by ID with user count
   */
  async getRoleById(roleId) {
    const result = await pool.query(
      `SELECT 
        r.id,
        r.name,
        r.description,
        r.permissions,
        r.created_at,
        COUNT(DISTINCT ur.user_id) as user_count,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', u.id,
            'email', u.email,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'assigned_at', ur.assigned_at
          ) ORDER BY u.first_name
        ) FILTER (WHERE u.id IS NOT NULL) as users
       FROM roles r
       LEFT JOIN user_roles ur ON r.id = ur.role_id
       LEFT JOIN users u ON ur.user_id = u.id
       WHERE r.id = $1
       GROUP BY r.id`,
      [roleId]
    );

    if (result.rows.length === 0) {
      throw new Error('Role not found');
    }

    return result.rows[0];
  }

  /**
   * Get role by name
   */
  async getRoleByName(name) {
    const result = await pool.query(
      `SELECT 
        r.id,
        r.name,
        r.description,
        r.permissions,
        r.created_at,
        COUNT(DISTINCT ur.user_id) as user_count
       FROM roles r
       LEFT JOIN user_roles ur ON r.id = ur.role_id
       WHERE r.name = $1
       GROUP BY r.id`,
      [name]
    );

    if (result.rows.length === 0) {
      throw new Error('Role not found');
    }

    return result.rows[0];
  }

  /**
   * Get permissions for a role
   */
  async getRolePermissions(roleId) {
    const result = await pool.query(
      'SELECT permissions FROM roles WHERE id = $1',
      [roleId]
    );

    if (result.rows.length === 0) {
      throw new Error('Role not found');
    }

    return result.rows[0].permissions || [];
  }

  /**
   * Check if a permission exists in role permissions
   * Supports wildcard matching (e.g., 'orders.*' matches 'orders.create')
   */
  hasPermission(rolePermissions, requiredPermission) {
    if (!rolePermissions || rolePermissions.length === 0) {
      return false;
    }

    // Check for wildcard permission
    if (rolePermissions.includes('*')) {
      return true;
    }

    // Check exact match
    if (rolePermissions.includes(requiredPermission)) {
      return true;
    }

    // Check wildcard patterns
    for (const permission of rolePermissions) {
      if (permission.endsWith('.*')) {
        const prefix = permission.slice(0, -2);
        if (requiredPermission.startsWith(prefix + '.')) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get all unique permissions across all roles
   */
  async getAllPermissions() {
    const result = await pool.query(
      `SELECT DISTINCT jsonb_array_elements_text(permissions) as permission
       FROM roles
       ORDER BY permission`
    );

    return result.rows.map(row => row.permission);
  }

  /**
   * Get role statistics
   */
  async getRoleStats() {
    const result = await pool.query(
      `SELECT 
        r.name,
        r.description,
        COUNT(DISTINCT ur.user_id) as user_count,
        COUNT(DISTINCT CASE WHEN u.is_active THEN ur.user_id END) as active_user_count
       FROM roles r
       LEFT JOIN user_roles ur ON r.id = ur.role_id
       LEFT JOIN users u ON ur.user_id = u.id
       GROUP BY r.id, r.name, r.description
       ORDER BY user_count DESC`
    );

    return result.rows;
  }
}

export default new RoleService();
