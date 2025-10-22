/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user info to request
 */

import authService from '../services/auth.service.js';
import pool from '../config/database.js';

/**
 * Verify JWT token and authenticate user
 */
export const authenticate = async (req, res, next) => {
  try {
    // MOCK_DB mode - bypass authentication
    if (process.env.MOCK_DB === 'true') {
      req.user = {
        id: 1,
        email: 'demo@logisync.com',
        name: 'Demo User',
        is_active: true,
        is_verified: true,
        roles: [{ id: 1, name: 'admin', display_name: 'Administrator' }],
        permissions: ['*']
      };
      req.userId = 1;
      return next();
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = authService.verifyToken(token);

    // Get fresh user data (in case permissions changed)
    const user = await authService.getUserWithRoles(decoded.userId);

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();

  } catch (error) {
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    // MOCK_DB mode - add mock user
    if (process.env.MOCK_DB === 'true') {
      req.user = {
        id: 1,
        email: 'demo@logisync.com',
        name: 'Demo User',
        is_active: true,
        is_verified: true,
        roles: [{ id: 1, name: 'admin', display_name: 'Administrator' }],
        permissions: ['*']
      };
      req.userId = 1;
      return next();
    }

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);
      const user = await authService.getUserWithRoles(decoded.userId);

      if (user.is_active) {
        req.user = user;
        req.userId = user.id;
      }
    }

    next();

  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

/**
 * Check if user has specific role
 */
export const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRoles = req.user.roles.map(r => r.name);
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        required: allowedRoles,
        current: userRoles
      });
    }

    next();
  };
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userPermissions = req.user.permissions || [];

    // Check for wildcard permission
    if (userPermissions.includes('*')) {
      return next();
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(reqPerm => {
      return userPermissions.some(userPerm => {
        // Exact match
        if (userPerm === reqPerm) return true;

        // Wildcard match (e.g., 'orders.*' matches 'orders.create')
        if (userPerm.endsWith('.*')) {
          const prefix = userPerm.slice(0, -2);
          return reqPerm.startsWith(prefix + '.');
        }

        return false;
      });
    });

    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        required: requiredPermissions
      });
    }

    next();
  };
};

/**
 * Check if user owns the resource or has admin role
 */
export const isOwnerOrAdmin = (resourceUserIdGetter) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is admin
    const isAdmin = req.user.roles.some(r => r.name === 'admin');
    if (isAdmin) {
      return next();
    }

    // Get resource owner ID
    let resourceUserId;
    if (typeof resourceUserIdGetter === 'function') {
      resourceUserId = await resourceUserIdGetter(req);
    } else if (typeof resourceUserIdGetter === 'string') {
      resourceUserId = req.params[resourceUserIdGetter] || req.body[resourceUserIdGetter];
    }

    // Check if user is owner
    if (resourceUserId && resourceUserId === req.user.id) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

/**
 * Rate limiting per user
 */
const userRequestCounts = new Map();

export const rateLimitPerUser = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.id;
    const now = Date.now();
    const userKey = `user-${userId}`;

    // Get or create user request data
    let userData = userRequestCounts.get(userKey);

    if (!userData || now - userData.windowStart > windowMs) {
      // New window
      userData = {
        count: 1,
        windowStart: now
      };
    } else {
      // Within window
      userData.count++;
    }

    userRequestCounts.set(userKey, userData);

    // Check limit
    if (userData.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((userData.windowStart + windowMs - now) / 1000)
      });
    }

    next();
  };
};

/**
 * Activity logger middleware
 */
export const logActivity = (action, resourceType = null) => {
  return async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json
    res.json = function(data) {
      // Log activity after successful response
      if (req.user && res.statusCode < 400) {
        const resourceId = req.params.id || data?.id || null;

        authService.logActivity({
          userId: req.user.id,
          action,
          resourceType,
          resourceId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          metadata: {
            method: req.method,
            path: req.path,
            query: req.query,
            statusCode: res.statusCode
          }
        }).catch(err => {
          console.error('Activity logging error:', err);
        });
      }

      // Call original json
      return originalJson(data);
    };

    next();
  };
};

/**
 * Check if user is verified
 */
export const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

/**
 * Prevent action on demo account
 */
export const preventDemoModification = (req, res, next) => {
  if (req.user && req.user.email.includes('demo@')) {
    return res.status(403).json({
      success: false,
      message: 'Cannot modify demo account'
    });
  }

  next();
};

export default {
  authenticate,
  optionalAuth,
  hasRole,
  hasPermission,
  isOwnerOrAdmin,
  rateLimitPerUser,
  logActivity,
  requireVerified,
  preventDemoModification
};
