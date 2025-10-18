/**
 * User Management Routes
 * Admin routes for managing users, roles, and activity
 */

import express from 'express';
import userController from '../controllers/user.controller.js';
import { authenticate, hasPermission } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Get all users with filtering, search, and pagination
 * @access  Admin, Manager
 */
router.get('/', 
  hasPermission('users.read', 'users.manage'),
  userController.getAll
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID with roles and permissions
 * @access  Admin, Manager
 */
router.get('/:id',
  hasPermission('users.read', 'users.manage'),
  userController.getById
);

/**
 * @route   PUT /api/users/:id/roles
 * @desc    Assign roles to user (replaces existing roles)
 * @access  Admin only
 */
router.put('/:id/roles',
  hasPermission('users.manage_roles'),
  userController.assignRoles
);

/**
 * @route   POST /api/users/:id/roles
 * @desc    Add a role to user (append, don't replace)
 * @access  Admin only
 */
router.post('/:id/roles',
  hasPermission('users.manage_roles'),
  userController.addRole
);

/**
 * @route   DELETE /api/users/:id/roles/:roleId
 * @desc    Remove a role from user
 * @access  Admin only
 */
router.delete('/:id/roles/:roleId',
  hasPermission('users.manage_roles'),
  userController.removeRole
);

/**
 * @route   PUT /api/users/:id/status
 * @desc    Activate or deactivate user
 * @access  Admin only
 */
router.put('/:id/status',
  hasPermission('users.manage_status'),
  userController.updateStatus
);

/**
 * @route   GET /api/users/:id/activity
 * @desc    Get user activity log
 * @access  Admin, Manager (own activity for users)
 */
router.get('/:id/activity',
  hasPermission('activity.read'),
  userController.getActivity
);

/**
 * @route   GET /api/activity
 * @desc    Get all activity log (admin dashboard)
 * @access  Admin only
 */
router.get('/activity/all',
  hasPermission('activity.read'),
  userController.getAllActivity
);

export default router;
