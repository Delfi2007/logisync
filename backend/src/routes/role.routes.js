/**
 * Role Management Routes
 * Routes for viewing roles and permissions
 */

import express from 'express';
import roleController from '../controllers/role.controller.js';
import { authenticate, hasPermission } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/roles
 * @desc    Get all roles with user counts
 * @access  Admin, Manager
 */
router.get('/',
  hasPermission('users.read', 'users.manage'),
  roleController.getAll
);

/**
 * @route   GET /api/roles/stats
 * @desc    Get role statistics
 * @access  Admin, Manager
 */
router.get('/stats',
  hasPermission('users.read'),
  roleController.getStats
);

/**
 * @route   GET /api/roles/permissions/all
 * @desc    Get all unique permissions across roles
 * @access  Admin
 */
router.get('/permissions/all',
  hasPermission('users.manage_roles'),
  roleController.getAllPermissions
);

/**
 * @route   GET /api/roles/:id
 * @desc    Get role by ID with users
 * @access  Admin, Manager
 */
router.get('/:id',
  hasPermission('users.read', 'users.manage'),
  roleController.getById
);

/**
 * @route   GET /api/roles/name/:name
 * @desc    Get role by name
 * @access  Admin, Manager
 */
router.get('/name/:name',
  hasPermission('users.read'),
  roleController.getByName
);

/**
 * @route   GET /api/roles/:id/permissions
 * @desc    Get permissions for a specific role
 * @access  Admin, Manager
 */
router.get('/:id/permissions',
  hasPermission('users.read'),
  roleController.getPermissions
);

export default router;
