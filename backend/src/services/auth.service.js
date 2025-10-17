/**
 * Authentication Service
 * Handles user authentication, JWT token generation, and refresh tokens
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database.js';
import emailService from './email.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

class AuthService {
  /**
   * Register a new user
   */
  async register({ email, password, firstName, lastName, phone, roleNames = ['customer'] }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email.toLowerCase()]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user (include full_name for backward compatibility)
      const fullName = `${firstName} ${lastName}`.trim();
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, full_name, phone)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, first_name, last_name, phone, is_active, is_verified, created_at`,
        [email.toLowerCase(), passwordHash, firstName, lastName, fullName, phone]
      );

      const user = userResult.rows[0];

      // Assign roles
      for (const roleName of roleNames) {
        await client.query(
          `INSERT INTO user_roles (user_id, role_id)
           SELECT $1, id FROM roles WHERE name = $2`,
          [user.id, roleName]
        );
      }

      // Get user with roles
      const userWithRoles = await this.getUserWithRoles(user.id, client);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store verification token
      await client.query(
        `INSERT INTO email_verification_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, verificationToken, expiresAt]
      );

      await client.query('COMMIT');

      // Send verification email (don't fail registration if email fails)
      try {
        await emailService.sendVerificationEmail(user, verificationToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue with registration - user can request resend later
      }

      // Generate tokens
      const tokens = await this.generateTokens(userWithRoles);

      return {
        user: userWithRoles,
        tokens
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Login user
   */
  async login({ email, password, ipAddress, userAgent }) {
    const client = await pool.connect();

    try {
      // Get user with password
      const result = await client.query(
        `SELECT id, email, password_hash, first_name, last_name, phone, 
                is_active, is_verified
         FROM users 
         WHERE email = $1`,
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = result.rows[0];

      // Check if user is active
      if (!user.is_active) {
        throw new Error('Account is inactive. Please contact support.');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        // Log failed login attempt
        await this.logActivity({
          userId: user.id,
          action: 'login_failed',
          ipAddress,
          userAgent,
          metadata: { reason: 'invalid_password' }
        }, client);

        throw new Error('Invalid email or password');
      }

      // Update last login
      await client.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Get user with roles
      const userWithRoles = await this.getUserWithRoles(user.id, client);

      // Generate tokens
      const tokens = await this.generateTokens(userWithRoles);

      // Log successful login
      await this.logActivity({
        userId: user.id,
        action: 'login_success',
        ipAddress,
        userAgent
      }, client);

      return {
        user: userWithRoles,
        tokens
      };

    } finally {
      client.release();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      // Check if refresh token exists and is valid
      const result = await pool.query(
        `SELECT id, user_id, expires_at, revoked_at
         FROM refresh_tokens
         WHERE token = $1`,
        [refreshToken]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid refresh token');
      }

      const tokenRecord = result.rows[0];

      // Check if token is revoked
      if (tokenRecord.revoked_at) {
        throw new Error('Refresh token has been revoked');
      }

      // Check if token is expired
      if (new Date(tokenRecord.expires_at) < new Date()) {
        throw new Error('Refresh token has expired');
      }

      // Revoke old refresh token BEFORE generating new ones
      await pool.query(
        `UPDATE refresh_tokens 
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [tokenRecord.id]
      );

      // Get user with roles
      const user = await this.getUserWithRoles(tokenRecord.user_id);

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update the revoked token with the new token reference
      await pool.query(
        `UPDATE refresh_tokens 
         SET replaced_by_token = $1
         WHERE id = $2`,
        [tokens.refreshToken, tokenRecord.id]
      );

      return {
        user,
        tokens
      };

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token has expired');
      }
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    try {
      // Revoke refresh token
      await pool.query(
        `UPDATE refresh_tokens 
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE token = $1 AND revoked_at IS NULL`,
        [refreshToken]
      );
    } catch (error) {
      // Silently fail - token might already be revoked or doesn't exist
      console.error('Logout error:', error.message);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    const result = await pool.query(
      'SELECT id, email, first_name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      // Don't reveal if email exists
      return { message: 'If an account exists, a reset link will be sent.' };
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Save token
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    );

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
      console.log(`Password reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Continue even if email fails - token is still saved
    }

    return {
      message: 'If an account exists, a reset link will be sent.'
    };
  }

  /**
   * Reset password
   */
  async resetPassword(token, newPassword) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Find valid token
      const tokenResult = await client.query(
        `SELECT id, user_id, expires_at, used_at
         FROM password_reset_tokens
         WHERE token = $1`,
        [token]
      );

      if (tokenResult.rows.length === 0) {
        throw new Error('Invalid or expired reset token');
      }

      const tokenRecord = tokenResult.rows[0];

      // Check if token was already used
      if (tokenRecord.used_at) {
        throw new Error('Reset token has already been used');
      }

      // Check if token is expired
      if (new Date(tokenRecord.expires_at) < new Date()) {
        throw new Error('Reset token has expired');
      }

      // Hash new password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update user password
      await client.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [passwordHash, tokenRecord.user_id]
      );

      // Mark token as used
      await client.query(
        'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1',
        [tokenRecord.id]
      );

      // Revoke all refresh tokens for this user (force re-login)
      await client.query(
        `UPDATE refresh_tokens 
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND revoked_at IS NULL`,
        [tokenRecord.user_id]
      );

      await client.query('COMMIT');

      // Get user info for email
      const userResult = await client.query(
        'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
        [tokenRecord.user_id]
      );
      const user = userResult.rows[0];

      // Send password changed notification email
      try {
        await emailService.sendPasswordChangedEmail(user);
        console.log(`Password changed email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send password changed email:', emailError);
        // Don't fail the password reset if email fails
      }

      return { message: 'Password has been reset successfully' };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Change password (for logged-in user)
   */
  async changePassword(userId, currentPassword, newPassword) {
    const client = await pool.connect();

    try {
      // Get current password hash
      const result = await client.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await client.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [passwordHash, userId]
      );

      // Log activity
      await this.logActivity({
        userId,
        action: 'password_changed'
      }, client);

      return { message: 'Password changed successfully' };

    } finally {
      client.release();
    }
  }

  /**
   * Generate JWT tokens
   */
  async generateTokens(user) {
    // Access token payload
    const accessTokenPayload = {
      userId: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      permissions: user.permissions,
      jti: `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Unique ID
    };

    // Generate access token
    const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    // Generate refresh token
    const refreshTokenPayload = {
      userId: user.id,
      tokenType: 'refresh',
      jti: `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Unique ID
    };

    const refreshToken = jwt.sign(refreshTokenPayload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN
    });

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRES_IN
    };
  }

  /**
   * Get user with roles and permissions
   */
  async getUserWithRoles(userId, client = null) {
    const db = client || pool;

    const result = await db.query(
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
        json_agg(
          json_build_object(
            'id', r.id,
            'name', r.name,
            'description', r.description,
            'permissions', r.permissions
          )
        ) as roles
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

    // Flatten permissions from all roles
    const allPermissions = new Set();
    user.roles.forEach(role => {
      if (role.permissions) {
        role.permissions.forEach(perm => allPermissions.add(perm));
      }
    });

    user.permissions = Array.from(allPermissions);

    return user;
  }

  /**
   * Log user activity
   */
  async logActivity({ userId, action, resourceType, resourceId, ipAddress, userAgent, metadata }, client = null) {
    const db = client || pool;

    await db.query(
      `INSERT INTO user_activity_log 
       (user_id, action, resource_type, resource_id, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, action, resourceType, resourceId, ipAddress, userAgent, JSON.stringify(metadata || {})]
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      throw new Error('Invalid token');
    }
  }

  /**
   * Cleanup expired tokens (run periodically)
   */
  /**
   * Verify email with token
   */
  async verifyEmail(token) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Find verification token
      const tokenResult = await client.query(
        `SELECT evt.*, u.email, u.first_name, u.is_verified
         FROM email_verification_tokens evt
         JOIN users u ON evt.user_id = u.id
         WHERE evt.token = $1 AND evt.verified_at IS NULL`,
        [token]
      );

      if (tokenResult.rows.length === 0) {
        throw new Error('Invalid or expired verification token');
      }

      const tokenData = tokenResult.rows[0];

      // Check if already verified
      if (tokenData.is_verified) {
        throw new Error('Email already verified');
      }

      // Check if token expired
      if (new Date(tokenData.expires_at) < new Date()) {
        throw new Error('Invalid or expired verification token');
      }

      // Mark token as used
      await client.query(
        `UPDATE email_verification_tokens 
         SET verified_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [tokenData.id]
      );

      // Update user verification status
      await client.query(
        `UPDATE users 
         SET is_verified = true 
         WHERE id = $1`,
        [tokenData.user_id]
      );

      await client.query('COMMIT');

      // Send welcome email
      try {
        const user = {
          email: tokenData.email,
          first_name: tokenData.first_name
        };
        await emailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail verification if welcome email fails
      }

      return {
        message: 'Email verified successfully',
        verified: true
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email) {
    const client = await pool.connect();

    try {
      // Get user
      const userResult = await client.query(
        `SELECT id, email, first_name, is_verified 
         FROM users 
         WHERE email = $1`,
        [email.toLowerCase()]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];

      // Check if already verified
      if (user.is_verified) {
        throw new Error('Email already verified');
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Delete old tokens
      await client.query(
        `DELETE FROM email_verification_tokens 
         WHERE user_id = $1`,
        [user.id]
      );

      // Create new token
      await client.query(
        `INSERT INTO email_verification_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, verificationToken, expiresAt]
      );

      // Send verification email
      await emailService.sendVerificationEmail(user, verificationToken);

      return {
        message: 'Verification email sent successfully'
      };

    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Clean up expired tokens (refresh, reset, verification)
   */
  async cleanupExpiredTokens() {
    const client = await pool.connect();

    try {
      // Delete expired refresh tokens
      const refreshResult = await client.query(
        `DELETE FROM refresh_tokens 
         WHERE expires_at < CURRENT_TIMESTAMP 
         OR revoked_at < CURRENT_TIMESTAMP - INTERVAL '30 days'`
      );

      // Delete expired password reset tokens
      const resetResult = await client.query(
        `DELETE FROM password_reset_tokens 
         WHERE expires_at < CURRENT_TIMESTAMP 
         OR used_at < CURRENT_TIMESTAMP - INTERVAL '30 days'`
      );

      // Delete expired verification tokens
      const verifyResult = await client.query(
        `DELETE FROM email_verification_tokens 
         WHERE expires_at < CURRENT_TIMESTAMP 
         OR verified_at < CURRENT_TIMESTAMP - INTERVAL '30 days'`
      );

      return {
        refreshTokensDeleted: refreshResult.rowCount,
        resetTokensDeleted: resetResult.rowCount,
        verificationTokensDeleted: verifyResult.rowCount
      };

    } finally {
      client.release();
    }
  }
}

export default new AuthService();
