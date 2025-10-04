import { query } from '../config/database.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.js';
import { generateTokenFromUser } from '../utils/jwt.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, full_name } = req.body;
  
  // Validate required fields
  if (!email || !password || !full_name) {
    throw new AppError('Email, password, and full name are required', 400);
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }
  
  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    throw new AppError('Password validation failed', 400, passwordValidation.errors);
  }
  
  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  
  if (existingUser.rows.length > 0) {
    throw new AppError('User with this email already exists', 409);
  }
  
  // Hash password
  const password_hash = await hashPassword(password);
  
  // Create user
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, role, created_at`,
    [email.toLowerCase(), password_hash, full_name, 'user']
  );
  
  const user = result.rows[0];
  
  // Generate JWT token
  const token = generateTokenFromUser(user);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      }
    }
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  
  // Find user by email
  const result = await query(
    `SELECT id, email, password_hash, full_name, role, created_at
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()]
  );
  
  if (result.rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }
  
  const user = result.rows[0];
  
  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password_hash);
  
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Generate JWT token
  const token = generateTokenFromUser(user);
  
  // Remove password hash from response
  delete user.password_hash;
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      }
    }
  });
});

/**
 * Get current user info
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  // User is already attached by auth middleware
  const user = req.user;
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      }
    }
  });
});

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  // In JWT-based auth, logout is handled client-side by removing the token
  // This endpoint exists for consistency and can be extended for token blacklisting
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default {
  register,
  login,
  getMe,
  logout
};
