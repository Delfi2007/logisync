import helmet from 'helmet';
import cors from 'cors';

/**
 * Security Configuration
 * Comprehensive security headers and CORS setup
 */

/**
 * Helmet security middleware configuration
 * Adds various HTTP headers to secure the app
 */
export const helmetConfig = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://api.logisync.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },

  // DNS Prefetch Control
  dnsPrefetchControl: {
    allow: false,
  },

  // Frameguard (prevent clickjacking)
  frameguard: {
    action: 'deny',
  },

  // Hide Powered By header
  hidePoweredBy: true,

  // HTTP Strict Transport Security (HSTS)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // IE No Open (prevent IE from opening untrusted HTML)
  ieNoOpen: true,

  // Don't Sniff Mimetype
  noSniff: true,

  // Permitted Cross-Domain Policies
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none',
  },

  // Referrer Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },

  // X-XSS-Protection
  xssFilter: true,
});

/**
 * CORS configuration
 * Controls which origins can access the API
 */
export const corsConfig = cors({
  // Allowed origins
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Alternative dev port
      'http://localhost:4173', // Vite preview
      'https://logisync.com', // Production domain
      'https://www.logisync.com', // Production www
      'https://app.logisync.com', // Production app subdomain
    ];

    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Development mode - allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Production mode - check whitelist
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Device-Id',
    'X-Request-Id',
  ],

  // Exposed headers (accessible to client)
  exposedHeaders: [
    'X-Request-Id',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Preflight cache duration (24 hours)
  maxAge: 86400,

  // Pass the CORS preflight response to the next handler
  preflightContinue: false,

  // Provide a status code for successful OPTIONS requests
  optionsSuccessStatus: 204,
});

/**
 * Additional security middleware
 */

/**
 * Force HTTPS in production
 */
export const forceHttps = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    // Redirect to HTTPS
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
};

/**
 * Add custom security headers
 */
export const customSecurityHeaders = (req: any, res: any, next: any) => {
  // Remove Server header to hide server information
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

/**
 * Request ID middleware (for tracking requests)
 */
export const requestId = (req: any, res: any, next: any) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Security middleware stack
 * Apply all security middleware in order
 */
export const securityMiddleware = [
  requestId,
  forceHttps,
  helmetConfig,
  corsConfig,
  customSecurityHeaders,
];

/**
 * Security configuration for different environments
 */
export const securityConfig = {
  production: {
    forceHttps: true,
    strictCors: true,
    hsts: true,
    csp: true,
  },
  development: {
    forceHttps: false,
    strictCors: false,
    hsts: false,
    csp: false,
  },
  test: {
    forceHttps: false,
    strictCors: false,
    hsts: false,
    csp: false,
  },
};
