import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Password Service
 * Handles password hashing, validation, and security policies
 */

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number; // Number of previous passwords to check
  maxAge: number; // Days before password expires
}

interface PasswordHistory {
  userId: number;
  passwordHash: string;
  createdAt: Date;
}

interface LoginAttempt {
  userId: number;
  attempts: number;
  lockedUntil: Date | null;
  lastAttempt: Date;
}

// In-memory stores (in production, use database)
const passwordHistory = new Map<number, PasswordHistory[]>();
const loginAttempts = new Map<number, LoginAttempt>();
const passwordResetTokens = new Map<string, {
  userId: number;
  expiresAt: Date;
  used: boolean;
}>();

class PasswordService {
  private readonly policy: PasswordPolicy = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5, // Don't allow reusing last 5 passwords
    maxAge: 90, // Password expires after 90 days
  };

  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Validate password against policy
   */
  validatePassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check minimum length
    if (password.length < this.policy.minLength) {
      errors.push(`Password must be at least ${this.policy.minLength} characters long`);
    }

    // Check uppercase requirement
    if (this.policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check lowercase requirement
    if (this.policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check numbers requirement
    if (this.policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check special characters requirement
    if (this.policy.requireSpecialChars && !/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    // Check for common weak passwords
    const weakPasswords = [
      'password', 'password123', '12345678', 'qwerty',
      'abc123', 'letmein', 'welcome', 'monkey',
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('This password is too common. Please choose a stronger password');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if password was used recently
   */
  async checkPasswordHistory(userId: number, newPassword: string): Promise<boolean> {
    const history = passwordHistory.get(userId) || [];

    // Check against recent passwords
    for (const entry of history.slice(-this.policy.preventReuse)) {
      const isMatch = await this.comparePassword(newPassword, entry.passwordHash);
      if (isMatch) {
        return false; // Password was used recently
      }
    }

    return true; // Password is new
  }

  /**
   * Add password to history
   */
  addToPasswordHistory(userId: number, passwordHash: string): void {
    const history = passwordHistory.get(userId) || [];
    history.push({
      userId,
      passwordHash,
      createdAt: new Date(),
    });

    // Keep only recent passwords
    if (history.length > this.policy.preventReuse) {
      history.shift();
    }

    passwordHistory.set(userId, history);
  }

  /**
   * Record failed login attempt
   */
  recordFailedLogin(userId: number): {
    locked: boolean;
    attemptsRemaining: number;
    lockedUntil: Date | null;
  } {
    const now = new Date();
    const attempt = loginAttempts.get(userId) || {
      userId,
      attempts: 0,
      lockedUntil: null,
      lastAttempt: now,
    };

    // Check if account is currently locked
    if (attempt.lockedUntil && attempt.lockedUntil > now) {
      return {
        locked: true,
        attemptsRemaining: 0,
        lockedUntil: attempt.lockedUntil,
      };
    }

    // Reset attempts if last attempt was over lockout duration ago
    if (attempt.lockedUntil && attempt.lockedUntil <= now) {
      attempt.attempts = 0;
      attempt.lockedUntil = null;
    }

    // Increment attempts
    attempt.attempts++;
    attempt.lastAttempt = now;

    // Lock account if max attempts reached
    if (attempt.attempts >= this.MAX_LOGIN_ATTEMPTS) {
      attempt.lockedUntil = new Date(now.getTime() + this.LOCKOUT_DURATION_MS);
      loginAttempts.set(userId, attempt);

      return {
        locked: true,
        attemptsRemaining: 0,
        lockedUntil: attempt.lockedUntil,
      };
    }

    loginAttempts.set(userId, attempt);

    return {
      locked: false,
      attemptsRemaining: this.MAX_LOGIN_ATTEMPTS - attempt.attempts,
      lockedUntil: null,
    };
  }

  /**
   * Reset failed login attempts (on successful login)
   */
  resetFailedLogins(userId: number): void {
    loginAttempts.delete(userId);
  }

  /**
   * Check if account is locked
   */
  isAccountLocked(userId: number): {
    locked: boolean;
    lockedUntil: Date | null;
  } {
    const attempt = loginAttempts.get(userId);
    const now = new Date();

    if (!attempt || !attempt.lockedUntil) {
      return { locked: false, lockedUntil: null };
    }

    if (attempt.lockedUntil > now) {
      return {
        locked: true,
        lockedUntil: attempt.lockedUntil,
      };
    }

    // Lock expired, reset
    this.resetFailedLogins(userId);
    return { locked: false, lockedUntil: null };
  }

  /**
   * Generate password reset token
   */
  generatePasswordResetToken(userId: number): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    passwordResetTokens.set(token, {
      userId,
      expiresAt,
      used: false,
    });

    return token;
  }

  /**
   * Verify password reset token
   */
  verifyPasswordResetToken(token: string): {
    valid: boolean;
    userId?: number;
    error?: string;
  } {
    const resetData = passwordResetTokens.get(token);
    const now = new Date();

    if (!resetData) {
      return { valid: false, error: 'Invalid reset token' };
    }

    if (resetData.used) {
      return { valid: false, error: 'Reset token has already been used' };
    }

    if (resetData.expiresAt < now) {
      passwordResetTokens.delete(token);
      return { valid: false, error: 'Reset token has expired' };
    }

    return {
      valid: true,
      userId: resetData.userId,
    };
  }

  /**
   * Mark reset token as used
   */
  markResetTokenUsed(token: string): void {
    const resetData = passwordResetTokens.get(token);
    if (resetData) {
      resetData.used = true;
      passwordResetTokens.set(token, resetData);
    }
  }

  /**
   * Check if password has expired
   */
  isPasswordExpired(passwordCreatedAt: Date): boolean {
    const now = new Date();
    const daysSinceCreation = Math.floor(
      (now.getTime() - passwordCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceCreation > this.policy.maxAge;
  }

  /**
   * Calculate password strength
   */
  calculatePasswordStrength(password: string): {
    score: number; // 0-100
    level: 'weak' | 'fair' | 'good' | 'strong' | 'very strong';
    feedback: string[];
  } {
    let score = 0;
    const feedback: string[] = [];

    // Length score (40 points max)
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;
    else feedback.push('Use at least 12 characters for better security');

    // Character variety (60 points max)
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[@$!%*?&]/.test(password)) score += 15;
    if (/[^A-Za-z0-9@$!%*?&]/.test(password)) score += 15;

    // Determine level
    let level: 'weak' | 'fair' | 'good' | 'strong' | 'very strong';
    if (score < 30) {
      level = 'weak';
      feedback.push('Password is too weak');
    } else if (score < 50) {
      level = 'fair';
      feedback.push('Password could be stronger');
    } else if (score < 70) {
      level = 'good';
    } else if (score < 90) {
      level = 'strong';
    } else {
      level = 'very strong';
    }

    return { score, level, feedback };
  }

  /**
   * Get password policy
   */
  getPolicy(): PasswordPolicy {
    return { ...this.policy };
  }

  /**
   * Clean up expired tokens (should be run periodically)
   */
  cleanupExpiredTokens(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [token, data] of passwordResetTokens.entries()) {
      if (data.expiresAt < now || data.used) {
        passwordResetTokens.delete(token);
        cleanedCount++;
      }
    }

    console.log(`[PasswordService] Cleaned up ${cleanedCount} expired reset tokens`);
  }
}

// Singleton instance
export const passwordService = new PasswordService();

// Schedule cleanup every hour
setInterval(() => {
  passwordService.cleanupExpiredTokens();
}, 60 * 60 * 1000); // 1 hour

export default passwordService;
