/**
 * Role Management Controller
 * Handles HTTP requests for role operations
 */

import roleService from '../services/role.service.js';

class RoleController {
  /**
   * Get all roles
   * GET /api/roles
   */
  async getAll(req, res) {
    try {
      const roles = await roleService.getAllRoles();

      res.json({
        success: true,
        data: roles
      });

    } catch (error) {
      console.error('Get all roles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch roles',
        error: error.message
      });
    }
  }

  /**
   * Get role by ID
   * GET /api/roles/:id
   */
  async getById(req, res) {
    try {
      const roleId = parseInt(req.params.id);

      if (isNaN(roleId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role ID'
        });
      }

      const role = await roleService.getRoleById(roleId);

      res.json({
        success: true,
        data: role
      });

    } catch (error) {
      console.error('Get role by ID error:', error);

      if (error.message === 'Role not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch role',
        error: error.message
      });
    }
  }

  /**
   * Get role by name
   * GET /api/roles/name/:name
   */
  async getByName(req, res) {
    try {
      const { name } = req.params;

      const role = await roleService.getRoleByName(name);

      res.json({
        success: true,
        data: role
      });

    } catch (error) {
      console.error('Get role by name error:', error);

      if (error.message === 'Role not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch role',
        error: error.message
      });
    }
  }

  /**
   * Get role permissions
   * GET /api/roles/:id/permissions
   */
  async getPermissions(req, res) {
    try {
      const roleId = parseInt(req.params.id);

      if (isNaN(roleId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role ID'
        });
      }

      const permissions = await roleService.getRolePermissions(roleId);

      res.json({
        success: true,
        data: permissions
      });

    } catch (error) {
      console.error('Get permissions error:', error);

      if (error.message === 'Role not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch permissions',
        error: error.message
      });
    }
  }

  /**
   * Get all unique permissions
   * GET /api/roles/permissions/all
   */
  async getAllPermissions(req, res) {
    try {
      const permissions = await roleService.getAllPermissions();

      res.json({
        success: true,
        data: permissions
      });

    } catch (error) {
      console.error('Get all permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch permissions',
        error: error.message
      });
    }
  }

  /**
   * Get role statistics
   * GET /api/roles/stats
   */
  async getStats(req, res) {
    try {
      const stats = await roleService.getRoleStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get role stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch role statistics',
        error: error.message
      });
    }
  }
}

export default new RoleController();
