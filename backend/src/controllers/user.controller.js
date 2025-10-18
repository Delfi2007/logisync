/**
 * User Management Controller
 * Handles HTTP requests for user operations
 */

import userService from '../services/user.service.js';

class UserController {
  /**
   * Get all users
   * GET /api/users
   */
  async getAll(req, res) {
    try {
      const filters = {
        search: req.query.search,
        role: req.query.role,
        status: req.query.status,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'DESC'
      };

      const result = await userService.getAllUsers(filters);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getById(req, res) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const user = await userService.getUserById(userId);

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Get user by ID error:', error);

      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  }

  /**
   * Assign roles to user
   * PUT /api/users/:id/roles
   */
  async assignRoles(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const { roleIds } = req.body;
      const assignedBy = req.userId; // From auth middleware

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      if (!Array.isArray(roleIds)) {
        return res.status(400).json({
          success: false,
          message: 'roleIds must be an array'
        });
      }

      // Validate all roleIds are numbers
      if (!roleIds.every(id => Number.isInteger(id))) {
        return res.status(400).json({
          success: false,
          message: 'All role IDs must be integers'
        });
      }

      const user = await userService.assignRoles(userId, roleIds, assignedBy);

      res.json({
        success: true,
        message: 'Roles updated successfully',
        data: user
      });

    } catch (error) {
      console.error('Assign roles error:', error);

      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'One or more invalid role IDs') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to assign roles',
        error: error.message
      });
    }
  }

  /**
   * Add role to user
   * POST /api/users/:id/roles
   */
  async addRole(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const { roleId } = req.body;
      const assignedBy = req.userId;

      if (isNaN(userId) || !Number.isInteger(roleId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID or role ID'
        });
      }

      const user = await userService.addRole(userId, roleId, assignedBy);

      res.json({
        success: true,
        message: 'Role added successfully',
        data: user
      });

    } catch (error) {
      console.error('Add role error:', error);

      if (error.message === 'User already has this role') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to add role',
        error: error.message
      });
    }
  }

  /**
   * Remove role from user
   * DELETE /api/users/:id/roles/:roleId
   */
  async removeRole(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const roleId = parseInt(req.params.roleId);
      const removedBy = req.userId;

      if (isNaN(userId) || isNaN(roleId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID or role ID'
        });
      }

      const user = await userService.removeRole(userId, roleId, removedBy);

      res.json({
        success: true,
        message: 'Role removed successfully',
        data: user
      });

    } catch (error) {
      console.error('Remove role error:', error);

      if (error.message === 'User does not have this role') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to remove role',
        error: error.message
      });
    }
  }

  /**
   * Update user status
   * PUT /api/users/:id/status
   */
  async updateStatus(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const { isActive } = req.body;
      const updatedBy = req.userId;

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isActive must be a boolean'
        });
      }

      const user = await userService.updateUserStatus(userId, isActive, updatedBy);

      res.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: user
      });

    } catch (error) {
      console.error('Update status error:', error);

      if (error.message === 'You cannot deactivate your own account') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update user status',
        error: error.message
      });
    }
  }

  /**
   * Get user activity log
   * GET /api/users/:id/activity
   */
  async getActivity(req, res) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        action: req.query.action,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const result = await userService.getUserActivity(userId, options);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Get activity error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activity log',
        error: error.message
      });
    }
  }

  /**
   * Get all activity (admin only)
   * GET /api/activity
   */
  async getAllActivity(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50,
        userId: req.query.userId ? parseInt(req.query.userId) : null,
        action: req.query.action,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const result = await userService.getAllActivity(options);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Get all activity error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activity log',
        error: error.message
      });
    }
  }
}

export default new UserController();
