import { verifyToken } from '../utils/jwt.js';
import { query } from '../config/database.js';

const MOCK_DB = process.env.MOCK_DB === 'true';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Authorization header must be in format: Bearer <token>'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }
    
    // MOCK_DB mode: Use mock user data
    if (MOCK_DB) {
      req.user = {
        id: decoded.userId,
        email: 'demo@logisync.com',
        full_name: 'Demo User',
        role: 'admin',
        created_at: new Date().toISOString()
      };
      return next();
    }
    
    // Check if user still exists in database
    const result = await query(
      'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Attach user to request
    req.user = result.rows[0];
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during authentication'
    });
  }
};

/**
 * Authorization middleware - check if user has required role
 * @param {string[]} roles - Array of allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't reject if not
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = verifyToken(token);
        
        // MOCK_DB mode: Use mock user data
        if (MOCK_DB) {
          req.user = {
            id: decoded.userId,
            email: 'demo@logisync.com',
            full_name: 'Demo User',
            role: 'admin'
          };
        } else {
          const result = await query(
            'SELECT id, email, full_name, role FROM users WHERE id = $1',
            [decoded.userId]
          );
          
          if (result.rows.length > 0) {
            req.user = result.rows[0];
          }
        }
      } catch (error) {
        // Silently ignore invalid tokens for optional auth
        console.log('Optional auth: Invalid token');
      }
    }
    
    next();
  } catch (error) {
    next(); // Continue even if there's an error
  }
};

export default {
  authenticate,
  authorize,
  optionalAuthenticate
};
