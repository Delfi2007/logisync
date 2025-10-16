import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Token Service - Enhanced JWT management with refresh tokens
 * Implements secure token generation, validation, and revocation
 */

interface TokenPayload {
  userId: number;
  role: string;
  deviceId: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

// In-memory token blacklist (in production, use Redis)
const tokenBlacklist = new Set<string>();
const refreshTokenStore = new Map<string, {
  userId: number;
  deviceId: string;
  createdAt: Date;
  expiresAt: Date;
}>();

class TokenService {
  private readonly ACCESS_TOKEN_SECRET: string;
  private readonly REFRESH_TOKEN_SECRET: string;
  private readonly ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

  constructor() {
    this.ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  }

  /**
   * Generate both access and refresh tokens
   */
  generateTokenPair(payload: TokenPayload): TokenPair {
    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      {
        userId: payload.userId,
        role: payload.role,
        deviceId: payload.deviceId,
      },
      this.ACCESS_TOKEN_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      {
        userId: payload.userId,
        deviceId: payload.deviceId,
        tokenId: crypto.randomBytes(16).toString('hex'), // Unique ID for revocation
      },
      this.REFRESH_TOKEN_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    // Store refresh token metadata
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    refreshTokenStore.set(refreshToken, {
      userId: payload.userId,
      deviceId: payload.deviceId,
      createdAt: new Date(),
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /**
   * Verify and decode access token
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      // Check if token is blacklisted
      if (tokenBlacklist.has(token)) {
        throw new Error('Token has been revoked');
      }

      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as DecodedToken;

      return {
        userId: decoded.userId,
        role: decoded.role,
        deviceId: decoded.deviceId,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify and decode refresh token
   */
  verifyRefreshToken(token: string): { userId: number; deviceId: string } {
    try {
      // Check if token is blacklisted
      if (tokenBlacklist.has(token)) {
        throw new Error('Refresh token has been revoked');
      }

      // Check if token exists in store
      if (!refreshTokenStore.has(token)) {
        throw new Error('Refresh token not found or expired');
      }

      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET) as any;

      return {
        userId: decoded.userId,
        deviceId: decoded.deviceId,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Clean up expired token from store
        refreshTokenStore.delete(token);
        throw new Error('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string, role: string): Promise<TokenPair> {
    // Verify refresh token
    const { userId, deviceId } = this.verifyRefreshToken(refreshToken);

    // Generate new token pair
    const newTokenPair = this.generateTokenPair({
      userId,
      role,
      deviceId,
    });

    // Revoke old refresh token (token rotation)
    this.revokeToken(refreshToken);

    return newTokenPair;
  }

  /**
   * Revoke a token (add to blacklist)
   */
  revokeToken(token: string): void {
    tokenBlacklist.add(token);
    refreshTokenStore.delete(token);
  }

  /**
   * Revoke all tokens for a user (logout from all devices)
   */
  revokeAllUserTokens(userId: number): void {
    // Find and revoke all refresh tokens for user
    for (const [token, metadata] of refreshTokenStore.entries()) {
      if (metadata.userId === userId) {
        tokenBlacklist.add(token);
        refreshTokenStore.delete(token);
      }
    }
  }

  /**
   * Revoke all tokens for a specific device
   */
  revokeDeviceTokens(userId: number, deviceId: string): void {
    for (const [token, metadata] of refreshTokenStore.entries()) {
      if (metadata.userId === userId && metadata.deviceId === deviceId) {
        tokenBlacklist.add(token);
        refreshTokenStore.delete(token);
      }
    }
  }

  /**
   * Check if token is revoked
   */
  isTokenRevoked(token: string): boolean {
    return tokenBlacklist.has(token);
  }

  /**
   * Get all active sessions for a user
   */
  getActiveSessions(userId: number): Array<{
    deviceId: string;
    createdAt: Date;
    expiresAt: Date;
  }> {
    const sessions: Array<{
      deviceId: string;
      createdAt: Date;
      expiresAt: Date;
    }> = [];

    for (const metadata of refreshTokenStore.values()) {
      if (metadata.userId === userId) {
        sessions.push({
          deviceId: metadata.deviceId,
          createdAt: metadata.createdAt,
          expiresAt: metadata.expiresAt,
        });
      }
    }

    return sessions;
  }

  /**
   * Clean up expired tokens (should be run periodically)
   */
  cleanupExpiredTokens(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [token, metadata] of refreshTokenStore.entries()) {
      if (metadata.expiresAt < now) {
        refreshTokenStore.delete(token);
        tokenBlacklist.add(token);
        cleanedCount++;
      }
    }

    console.log(`[TokenService] Cleaned up ${cleanedCount} expired tokens`);
  }

  /**
   * Get token statistics
   */
  getStats(): {
    activeRefreshTokens: number;
    blacklistedTokens: number;
  } {
    return {
      activeRefreshTokens: refreshTokenStore.size,
      blacklistedTokens: tokenBlacklist.size,
    };
  }
}

// Singleton instance
export const tokenService = new TokenService();

// Schedule cleanup every hour
setInterval(() => {
  tokenService.cleanupExpiredTokens();
}, 60 * 60 * 1000); // 1 hour

export default tokenService;
