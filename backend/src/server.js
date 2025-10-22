import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import noCache from './middleware/cacheControl.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import roleRoutes from './routes/role.routes.js';
import productRoutes from './routes/products.js';
import customerRoutes from './routes/customers.js';
import orderRoutes from './routes/orders.js';
import warehouseRoutes from './routes/warehouses.js';
import dashboardRoutes from './routes/dashboard.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Disable client-side caching for API responses to avoid 304 stale responses
app.use(noCache);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LogiSync API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler - must be after all other routes
// Serve frontend static build (if present) so the app can be accessed via a single URL
// dist is expected at the project root (created by running `npm run build` in the frontend)
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const distPath = join(__dirname, '..', '..', 'dist');

  if (fs.existsSync(distPath)) {
    // Serve static assets
    app.use(express.static(distPath));

    // For all non-API routes, serve index.html (SPA fallback)
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(join(distPath, 'index.html'));
    });
  }
} catch (err) {
  // If any error occurs while setting up static serving, log and continue — API will still work.
  console.error('Error configuring static file serving for frontend:', err);
}

// 404 handler - must be after all other routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🚀 LogiSync Backend API');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Port:         ${PORT}`);
  console.log(`  URL:          http://localhost:${PORT}`);
  console.log(`  Health:       http://localhost:${PORT}/health`);
  console.log(`  Database:     ${process.env.DB_NAME || 'logisync_dev'}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('✅ Server is ready to accept requests');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

export default app;
