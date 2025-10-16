# Security Implementation Guide

## Overview

This document provides comprehensive information about the security features implemented in LogiSync's Phase 4. All security measures follow industry best practices and are designed to protect user data, prevent unauthorized access, and ensure system integrity.

**Last Updated:** October 16, 2025  
**Phase:** 4 - Task 1 Complete  
**Status:** ✅ Security Hardening Complete

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Rate Limiting](#rate-limiting)
3. [Input Validation](#input-validation)
4. [Security Headers](#security-headers)
5. [Password Security](#password-security)
6. [CORS Configuration](#cors-configuration)
7. [Best Practices](#best-practices)
8. [Testing Security](#testing-security)

---

## Authentication & Authorization

### JWT Token System

LogiSync uses a dual-token authentication system with access tokens and refresh tokens.

#### Token Types

**Access Token:**
- **Duration:** 15 minutes
- **Purpose:** API authentication
- **Storage:** Client memory (not localStorage)
- **Transmission:** Authorization header (`Bearer <token>`)

**Refresh Token:**
- **Duration:** 7 days
- **Purpose:** Generate new access tokens
- **Storage:** HTTP-only cookie
- **Transmission:** Automatic via cookie

#### Token Service

**Location:** `backend/src/services/token.service.ts`

**Key Features:**
- Token generation and validation
- Automatic token rotation
- Token revocation (blacklist)
- Device-specific tokens
- Session management
- Cleanup automation

**Usage:**

```typescript
import { tokenService } from '../services/token.service';

// Generate token pair
const tokens = tokenService.generateTokenPair({
  userId: 123,
  role: 'admin',
  deviceId: 'device-abc-123',
});

// Verify access token
const payload = tokenService.verifyAccessToken(accessToken);

// Refresh access token
const newTokens = await tokenService.refreshAccessToken(refreshToken, role);

// Revoke token
tokenService.revokeToken(token);

// Revoke all user tokens (logout from all devices)
tokenService.revokeAllUserTokens(userId);
```

### Device Fingerprinting

**Location:** `backend/src/utils/device-fingerprint.ts`

Generates unique device IDs based on browser characteristics:
- User agent
- IP address
- Accept headers
- Language preferences

**Purpose:**
- Prevent token theft
- Track sessions per device
- Detect suspicious activity
- Enable device-based logout

**Usage:**

```typescript
import { getDeviceInfo, detectSuspiciousDevice } from '../utils/device-fingerprint';

// Get device information
const deviceInfo = getDeviceInfo(req);

// Check for suspicious characteristics
const suspicious = detectSuspiciousDevice(req);
if (suspicious.suspicious) {
  console.warn('Suspicious device:', suspicious.reasons);
}
```

### Enhanced Authentication Middleware

**Location:** `backend/src/middleware/auth.enhanced.ts`

**Middleware Functions:**

**1. authenticate**
```typescript
// Verify JWT and attach user to request
router.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

**2. authorizeRoles**
```typescript
// Restrict access to specific roles
router.delete('/users/:id', 
  authenticate, 
  authorizeRoles('admin'),
  deleteUser
);
```

**3. optionalAuth**
```typescript
// Optional authentication (doesn't fail if no token)
router.get('/public-data', optionalAuth, getData);
```

**4. verifyRefreshToken**
```typescript
// Verify refresh token from cookie
router.post('/refresh', verifyRefreshToken, refreshTokens);
```

---

## Rate Limiting

**Location:** `backend/src/middleware/rateLimiter.ts`

### Rate Limit Configuration

| Endpoint Type | Window | Max Requests | Key |
|--------------|--------|--------------|-----|
| **Auth Endpoints** | 15 minutes | 5 | IP |
| **Login Attempts** | 15 minutes | 3 | IP (failed only) |
| **API Endpoints** | 15 minutes | 100 | User ID |
| **Public Endpoints** | 1 minute | 20 | IP |
| **File Uploads** | 1 hour | 10 | User ID |
| **Password Reset** | 1 hour | 3 | IP |
| **Registration** | 1 hour | 3 | IP |
| **Sensitive Operations** | 1 hour | 5 | User ID |

### Usage

```typescript
import { 
  authRateLimiter, 
  apiRateLimiter,
  uploadRateLimiter 
} from '../middleware/rateLimiter';

// Apply to routes
router.post('/login', authRateLimiter, loginController);
router.get('/products', authenticate, apiRateLimiter, getProducts);
router.post('/upload', authenticate, uploadRateLimiter, uploadFile);
```

### Custom Rate Limiter

```typescript
import { createRateLimiter } from '../middleware/rateLimiter';

const customLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests
  message: 'Too many requests',
});

router.post('/custom-endpoint', customLimiter, handler);
```

### Rate Limit Headers

Responses include these headers:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds to wait before retrying (on 429)

### Rate Limit Response

```json
{
  "error": "Too many requests",
  "message": "You have exceeded the rate limit. Please try again later.",
  "retryAfter": 300,
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## Input Validation

### Validation Chain Pattern

All endpoints use express-validator validation chains to ensure data integrity.

**Location:** `backend/src/validators/`

### Available Validators

#### Auth Validators (`auth.validator.ts`)

**Registration:**
```typescript
import { registerValidation } from '../validators/auth.validator';
import { handleValidationErrors } from '../middleware/validation';

router.post('/register', 
  registerValidation,
  handleValidationErrors,
  registerController
);
```

**Validates:**
- Name (2-100 chars, letters only)
- Email (valid format, normalized)
- Password (8+ chars, complexity requirements)
- Phone (10 digits, Indian format)
- GST number (valid format)

**Login:**
```typescript
import { loginValidation } from '../validators/auth.validator';

router.post('/login',
  loginValidation,
  handleValidationErrors,
  loginController
);
```

**Password Change:**
```typescript
import { changePasswordValidation } from '../validators/auth.validator';

router.post('/change-password',
  authenticate,
  changePasswordValidation,
  handleValidationErrors,
  changePasswordController
);
```

#### Product Validators (`products.validator.ts`)

**Create Product:**
```typescript
import { createProductValidation } from '../validators/products.validator';

router.post('/products',
  authenticate,
  createProductValidation,
  handleValidationErrors,
  createProduct
);
```

**Validates:**
- Name (3-200 chars, escaped)
- SKU (3-50 chars, alphanumeric)
- Price (positive float, >= cost)
- Stock (non-negative integer)
- Category, description, etc.

**Update Product:**
```typescript
import { updateProductValidation } from '../validators/products.validator';

router.put('/products/:id',
  authenticate,
  updateProductValidation,
  handleValidationErrors,
  updateProduct
);
```

**Search/Filter:**
```typescript
import { productSearchValidation } from '../validators/products.validator';

router.get('/products',
  productSearchValidation,
  handleValidationErrors,
  getProducts
);
```

#### Customer Validators (`customers.validator.ts`)

**Create Customer:**
```typescript
import { createCustomerValidation } from '../validators/customers.validator';

router.post('/customers',
  authenticate,
  createCustomerValidation,
  handleValidationErrors,
  createCustomer
);
```

**Validates:**
- Name, email, phone
- GST number (Indian format)
- Address fields (escaped)
- Pin code (6 digits, valid format)

### Validation Error Response

```json
{
  "error": "Validation failed",
  "message": "Please check your input and try again",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long",
      "value": "short"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

### Security Features

**XSS Prevention:**
- `.escape()` on all text inputs
- HTML entity encoding
- Script tag blocking

**SQL Injection Prevention:**
- Parameterized queries
- Input sanitization
- Type validation

**NoSQL Injection Prevention:**
- Strict type checking
- Object validation
- Key sanitization

---

## Security Headers

**Location:** `backend/src/config/security.ts`

### Helmet Configuration

LogiSync uses Helmet to set security headers:

```typescript
import { helmetConfig } from '../config/security';

app.use(helmetConfig);
```

### Headers Set

**Content-Security-Policy:**
- Restricts resource loading
- Prevents XSS attacks
- Controls script/style sources

**HTTP Strict Transport Security (HSTS):**
- Forces HTTPS
- Max age: 1 year
- Includes subdomains
- Preload enabled

**X-Frame-Options:**
- Value: DENY
- Prevents clickjacking

**X-Content-Type-Options:**
- Value: nosniff
- Prevents MIME sniffing

**Referrer-Policy:**
- Value: strict-origin-when-cross-origin
- Controls referrer information

**Permissions-Policy:**
- Disables geolocation, camera, microphone

### Custom Security Middleware

```typescript
// Force HTTPS in production
app.use(forceHttps);

// Add custom headers
app.use(customSecurityHeaders);

// Add request ID
app.use(requestId);
```

---

## Password Security

**Location:** `backend/src/services/password.service.ts`

### Password Policy

```typescript
{
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventReuse: 5, // Don't reuse last 5 passwords
  maxAge: 90 // Password expires after 90 days
}
```

### Features

**1. Password Hashing**
```typescript
import { passwordService } from '../services/password.service';

// Hash password
const hash = await passwordService.hashPassword('myPassword123!');

// Compare password
const isMatch = await passwordService.comparePassword('myPassword123!', hash);
```

**2. Password Validation**
```typescript
const validation = passwordService.validatePassword('weakpass');

if (!validation.valid) {
  console.log(validation.errors);
  // ["Password must be at least 8 characters long"]
}
```

**3. Password History**
```typescript
// Check if password was used recently
const isNew = await passwordService.checkPasswordHistory(userId, newPassword);

if (!isNew) {
  return res.status(400).json({
    error: 'Password reuse not allowed',
    message: 'Please choose a different password'
  });
}

// Add to history after successful change
passwordService.addToPasswordHistory(userId, hashedPassword);
```

**4. Account Lockout**
```typescript
// Record failed login
const result = passwordService.recordFailedLogin(userId);

if (result.locked) {
  return res.status(429).json({
    error: 'Account locked',
    message: 'Too many failed login attempts',
    lockedUntil: result.lockedUntil,
    retryAfter: Math.ceil((result.lockedUntil.getTime() - Date.now()) / 1000)
  });
}

// Reset on successful login
passwordService.resetFailedLogins(userId);
```

**5. Password Reset Tokens**
```typescript
// Generate reset token
const token = passwordService.generatePasswordResetToken(userId);
// Send token via email...

// Verify token
const verification = passwordService.verifyPasswordResetToken(token);

if (!verification.valid) {
  return res.status(400).json({
    error: verification.error
  });
}

// Mark as used after successful reset
passwordService.markResetTokenUsed(token);
```

**6. Password Strength Calculator**
```typescript
const strength = passwordService.calculatePasswordStrength('MyP@ssw0rd123');

console.log(strength);
// {
//   score: 85,
//   level: 'strong',
//   feedback: []
// }
```

### Lockout Configuration

- **Max attempts:** 5
- **Lockout duration:** 15 minutes
- **Reset on:** Successful login
- **Scope:** Per user account

---

## CORS Configuration

**Location:** `backend/src/config/security.ts`

### Allowed Origins

**Development:**
- `http://localhost:5173` (Vite dev)
- `http://localhost:3000` (Alternative)
- `http://localhost:4173` (Vite preview)

**Production:**
- `https://logisync.com`
- `https://www.logisync.com`
- `https://app.logisync.com`

### Configuration

```typescript
import { corsConfig } from '../config/security';

app.use(corsConfig);
```

**Settings:**
- **Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Credentials:** Enabled (cookies, auth headers)
- **Max Age:** 24 hours
- **Exposed Headers:** Request ID, rate limit headers

### Custom Origin Validation

```typescript
origin: (origin, callback) => {
  // Allow requests with no origin (mobile apps, curl)
  if (!origin) return callback(null, true);

  // Development: allow all
  if (process.env.NODE_ENV === 'development') {
    return callback(null, true);
  }

  // Production: whitelist only
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}
```

---

## Best Practices

### 1. Token Management

✅ **DO:**
- Store access tokens in memory
- Store refresh tokens in HTTP-only cookies
- Rotate tokens on refresh
- Revoke tokens on logout
- Implement device tracking

❌ **DON'T:**
- Store tokens in localStorage
- Share tokens between devices
- Use long-lived access tokens
- Ignore token expiration

### 2. Password Security

✅ **DO:**
- Enforce strong password policy
- Hash with bcrypt (12+ rounds)
- Implement account lockout
- Prevent password reuse
- Use password reset tokens

❌ **DON'T:**
- Store plain text passwords
- Use weak hashing (MD5, SHA1)
- Allow unlimited login attempts
- Send passwords via email
- Use predictable tokens

### 3. API Security

✅ **DO:**
- Validate all input
- Sanitize user data
- Use rate limiting
- Implement CORS properly
- Log security events

❌ **DON'T:**
- Trust client input
- Expose sensitive errors
- Allow unlimited requests
- Enable CORS for all origins
- Ignore security logs

### 4. Headers & HTTPS

✅ **DO:**
- Use HTTPS in production
- Set security headers (Helmet)
- Force HTTPS redirects
- Enable HSTS
- Implement CSP

❌ **DON'T:**
- Use HTTP in production
- Expose server information
- Allow framing
- Skip CSP configuration
- Ignore HTTPS warnings

---

## Testing Security

### Manual Testing

**1. Authentication Tests**

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# Test with invalid token
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer invalid-token"

# Test token refresh
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Cookie: refreshToken=..."
```

**2. Rate Limiting Tests**

```bash
# Test rate limit (send 6 requests quickly)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done

# Should get 429 on 6th request
```

**3. Validation Tests**

```bash
# Test with invalid data
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"AB","price":-10,"stock":"invalid"}'

# Should get validation errors
```

**4. Password Security Tests**

```bash
# Test weak password
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"weak"}'

# Should fail validation

# Test account lockout (5 failed attempts)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done

# Should lock account on 6th attempt
```

### Automated Security Tests

**Location:** `backend/src/tests/security/`

Run security tests:
```bash
cd backend
npm run test:security
```

### Security Checklist

- [ ] All endpoints have authentication
- [ ] All inputs are validated
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced (production)
- [ ] Security headers are set
- [ ] CORS is configured properly
- [ ] Passwords are hashed with bcrypt
- [ ] Account lockout works
- [ ] Token rotation works
- [ ] Sensitive data is not logged
- [ ] Error messages don't expose internals
- [ ] Dependencies are up to date
- [ ] No known vulnerabilities (`npm audit`)

---

## Security Incident Response

### If a security breach is suspected:

1. **Immediate Actions:**
   - Revoke all tokens for affected users
   - Force password reset
   - Enable additional logging
   - Block suspicious IPs

2. **Investigation:**
   - Review audit logs
   - Check rate limit violations
   - Analyze failed login attempts
   - Examine device fingerprints

3. **Remediation:**
   - Patch vulnerabilities
   - Update dependencies
   - Strengthen policies
   - Notify affected users

4. **Prevention:**
   - Conduct security audit
   - Update documentation
   - Train team members
   - Implement additional monitoring

---

## Environment Variables

Required security-related environment variables:

```env
# JWT Secrets
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars

# Environment
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://logisync.com,https://app.logisync.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Password Policy
PASSWORD_MIN_LENGTH=8
PASSWORD_MAX_AGE_DAYS=90
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
```

---

## Monitoring & Logging

### Security Events to Monitor

- Failed login attempts
- Account lockouts
- Password resets
- Token revocations
- Rate limit violations
- Validation failures
- CORS violations
- Suspicious device access

### Log Format

```json
{
  "timestamp": "2025-10-16T10:30:00.000Z",
  "level": "warn",
  "event": "failed_login",
  "userId": 123,
  "ip": "192.168.1.1",
  "deviceId": "device-abc-123",
  "attempts": 3,
  "attemptsRemaining": 2
}
```

---

## Support & Questions

For security-related questions or to report vulnerabilities:

- **Email:** security@logisync.com
- **Documentation:** https://docs.logisync.com/security
- **GitHub Issues:** (for non-sensitive issues only)

---

**Document Version:** 1.0  
**Last Updated:** October 16, 2025  
**Security Level:** Production Ready ✅
