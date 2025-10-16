import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/token.service';
import { getDeviceInfo, detectSuspiciousDevice } from '../utils/device-fingerprint';

/**
 * Enhanced Authentication Middleware
 * Provides improved JWT validation with device fingerprinting
 */

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
    deviceId: string;
  };
  deviceInfo?: {
    userAgent: string;
    ip: string;
    deviceId: string;
  };
}

/**
 * Verify JWT access token from Authorization header
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid access token',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = tokenService.verifyAccessToken(token);

    // Get device information
    const deviceInfo = getDeviceInfo(req);

    // Verify device ID matches (prevents token theft)
    if (payload.deviceId !== deviceInfo.deviceId) {
      return res.status(401).json({
        error: 'Device mismatch',
        message: 'Token was issued for a different device',
      });
    }

    // Check for suspicious device characteristics
    const suspiciousCheck = detectSuspiciousDevice(req);
    if (suspiciousCheck.suspicious) {
      console.warn('[Auth] Suspicious device detected:', {
        userId: payload.userId,
        reasons: suspiciousCheck.reasons,
        ip: deviceInfo.ip,
      });
      // Still allow but log for monitoring
    }

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      role: payload.role,
      deviceId: payload.deviceId,
    };

    req.deviceInfo = deviceInfo;

    next();
  } catch (error: any) {
    console.error('[Auth] Authentication error:', error.message);

    if (error.message === 'Access token expired') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Your session has expired. Please refresh your token.',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error.message === 'Token has been revoked') {
      return res.status(401).json({
        error: 'Token revoked',
        message: 'This token has been revoked. Please login again.',
        code: 'TOKEN_REVOKED',
      });
    }

    return res.status(401).json({
      error: 'Invalid token',
      message: 'Authentication failed. Please login again.',
    });
  }
};

/**
 * Authorize specific roles
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if token is missing
 * but attaches user info if valid token is provided
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without user info
    return next();
  }

  try {
    const token = authHeader.substring(7);
    const payload = tokenService.verifyAccessToken(token);
    const deviceInfo = getDeviceInfo(req);

    req.user = {
      userId: payload.userId,
      role: payload.role,
      deviceId: payload.deviceId,
    };

    req.deviceInfo = deviceInfo;

    next();
  } catch (error) {
    // Invalid token, but don't fail - just continue without user info
    next();
  }
};

/**
 * Verify refresh token from cookie
 */
export const verifyRefreshToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Extract refresh token from cookie
    const refreshToken = (req as any).cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required',
        message: 'Please provide a valid refresh token',
      });
    }

    // Verify token
    const payload = tokenService.verifyRefreshToken(refreshToken);

    // Attach payload to request
    req.user = {
      userId: payload.userId,
      role: '', // Will be fetched from database
      deviceId: payload.deviceId,
    };

    next();
  } catch (error: any) {
    console.error('[Auth] Refresh token verification error:', error.message);

    if (error.message === 'Refresh token expired') {
      return res.status(401).json({
        error: 'Refresh token expired',
        message: 'Your session has expired. Please login again.',
        code: 'REFRESH_TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      error: 'Invalid refresh token',
      message: 'Please login again.',
    });
  }
};

/**
 * Check if user owns the resource
 */
export const checkOwnership = (resourceUserIdGetter: (req: AuthRequest) => number) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    const resourceUserId = resourceUserIdGetter(req);

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check ownership
    if (req.user.userId !== resourceUserId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};

/**
 * Rate limit based on user ID (for authenticated routes)
 */
export const userRateLimit = new Map<number, { count: number; resetAt: number }>();

export const checkUserRateLimit = (maxRequests: number, windowMs: number) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(); // Skip rate limiting for unauthenticated requests
    }

    const userId = req.user.userId;
    const now = Date.now();
    const userLimit = userRateLimit.get(userId);

    if (!userLimit || now > userLimit.resetAt) {
      // First request or window expired
      userRateLimit.set(userId, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      const retryAfter = Math.ceil((userLimit.resetAt - now) / 1000);
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      });
    }

    userLimit.count++;
    next();
  };
};
