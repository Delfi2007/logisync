import crypto from 'crypto';
import { Request } from 'express';

/**
 * Device Fingerprinting Utility
 * Creates a unique identifier for each device/browser combination
 * Used for session management and security
 */

interface DeviceInfo {
  userAgent: string;
  ip: string;
  acceptLanguage: string;
  acceptEncoding: string;
  deviceId: string;
}

/**
 * Extract device information from request
 */
export function getDeviceInfo(req: Request): DeviceInfo {
  const userAgent = req.headers['user-agent'] || '';
  const ip = getClientIp(req);
  const acceptLanguage = req.headers['accept-language'] || '';
  const acceptEncoding = req.headers['accept-encoding'] || '';

  // Generate device ID from fingerprint
  const deviceId = generateDeviceId({
    userAgent,
    ip,
    acceptLanguage,
    acceptEncoding,
  });

  return {
    userAgent,
    ip,
    acceptLanguage,
    acceptEncoding,
    deviceId,
  };
}

/**
 * Generate unique device ID from device characteristics
 */
export function generateDeviceId(info: {
  userAgent: string;
  ip: string;
  acceptLanguage: string;
  acceptEncoding: string;
}): string {
  // Combine device characteristics
  const fingerprint = [
    info.userAgent,
    info.ip,
    info.acceptLanguage,
    info.acceptEncoding,
  ].join('|');

  // Create hash
  return crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex')
    .substring(0, 16); // Use first 16 chars
}

/**
 * Get client IP address (handles proxy/load balancer scenarios)
 */
export function getClientIp(req: Request): string {
  // Check for forwarded IP (behind proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = (forwarded as string).split(',');
    return ips[0].trim(); // First IP is the client
  }

  // Check for real IP
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp as string;
  }

  // Fall back to socket address
  return req.socket.remoteAddress || 'unknown';
}

/**
 * Parse user agent string for device details
 */
export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  device: string;
} {
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  // Detect browser
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';

  // Detect OS
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  // Detect device type
  if (userAgent.includes('Mobile')) device = 'Mobile';
  else if (userAgent.includes('Tablet')) device = 'Tablet';

  return { browser, os, device };
}

/**
 * Validate device ID format
 */
export function isValidDeviceId(deviceId: string): boolean {
  return /^[a-f0-9]{16}$/.test(deviceId);
}

/**
 * Get device fingerprint for display (human-readable)
 */
export function getDeviceFingerprint(req: Request): string {
  const info = getDeviceInfo(req);
  const parsed = parseUserAgent(info.userAgent);

  return `${parsed.browser} on ${parsed.os} (${parsed.device}) - IP: ${info.ip.substring(0, 10)}...`;
}

/**
 * Compare two device IDs to check if they match
 */
export function compareDevices(deviceId1: string, deviceId2: string): boolean {
  return deviceId1 === deviceId2;
}

/**
 * Check if device is trusted (example implementation)
 * In production, you might maintain a list of trusted device IDs per user
 */
export function isDeviceTrusted(userId: number, deviceId: string): boolean {
  // TODO: Implement trusted device checking
  // This could check against a database of trusted devices for the user
  return false;
}

/**
 * Detect suspicious device characteristics
 */
export function detectSuspiciousDevice(req: Request): {
  suspicious: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  const info = getDeviceInfo(req);

  // Check for missing user agent
  if (!info.userAgent || info.userAgent === 'Unknown') {
    reasons.push('Missing or invalid user agent');
  }

  // Check for suspicious IP patterns
  if (info.ip === 'unknown' || info.ip.startsWith('127.')) {
    reasons.push('Suspicious IP address');
  }

  // Check for automated tools/bots in user agent
  const botPatterns = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget'];
  if (botPatterns.some(pattern => info.userAgent.toLowerCase().includes(pattern))) {
    reasons.push('Automated tool detected');
  }

  return {
    suspicious: reasons.length > 0,
    reasons,
  };
}

/**
 * Generate device session key (for caching, rate limiting, etc.)
 */
export function getDeviceSessionKey(userId: number, deviceId: string): string {
  return `session:${userId}:${deviceId}`;
}

/**
 * Log device information (for security monitoring)
 */
export function logDeviceAccess(req: Request, userId: number, action: string): void {
  const info = getDeviceInfo(req);
  const parsed = parseUserAgent(info.userAgent);
  const timestamp = new Date().toISOString();

  console.log(`[Device Access] ${timestamp} - User: ${userId} - Action: ${action}`);
  console.log(`  Device ID: ${info.deviceId}`);
  console.log(`  IP: ${info.ip}`);
  console.log(`  Browser: ${parsed.browser}`);
  console.log(`  OS: ${parsed.os}`);
  console.log(`  Device: ${parsed.device}`);
}
