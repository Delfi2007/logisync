/**
 * Error Handling Integration Example
 * 
 * Shows how to integrate error handling in the app:
 * 1. Wrap app with ErrorBoundary
 * 2. Wrap app with ToastProvider
 * 3. Use error handling in API calls
 * 4. Use error handling in components
 * 
 * @module examples/ErrorHandlingExample
 */

// ============================================
// APP.TSX EXAMPLE
// ============================================

/*
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import AppRoutes from './routes';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider maxToasts={3} defaultDuration={5000}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
*/

// ============================================
// API SERVICE EXAMPLE
// ============================================

/*
import { apiGet, apiPost, ApiErrorHandler } from '../utils/apiErrorHandler';
import { useToast } from '../contexts/ToastContext';

// Example: Login service
export class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await apiPost('/api/auth/login', 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response;
    } catch (error) {
      // Error will be thrown, handle in component
      throw error;
    }
  }

  static async getProfile(token: string) {
    try {
      const response = await apiGet('/api/auth/profile',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        },
        true // Enable retry
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Example: Orders service with retry
export class OrderService {
  static async getOrders() {
    try {
      const response = await apiGet('/api/orders',
        {},
        true // Enable automatic retry for network errors
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async createOrder(orderData: any) {
    try {
      const response = await apiPost('/api/orders',
        orderData,
        {},
        false // Don't retry POST requests by default
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  }
}
*/

// ============================================
// COMPONENT EXAMPLE
// ============================================

/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { ApiErrorHandler } from '../utils/apiErrorHandler';
import { AuthService } from '../services/authService';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const response = await AuthService.login(email, password);
      
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Show success message
      showSuccess('Login successful!');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      // Parse and display error
      const apiError = ApiErrorHandler.parseError(error);
      const message = ApiErrorHandler.getUserMessage(apiError);
      
      showError(message);
      
      // Handle specific errors
      if (ApiErrorHandler.isAuthError(apiError)) {
        // Clear invalid token
        localStorage.removeItem('token');
      }
      
      if (ApiErrorHandler.isNetworkError(apiError)) {
        // Maybe show offline indicator
        console.log('Network error detected');
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
*/

// ============================================
// CUSTOM HOOK EXAMPLE
// ============================================

/*
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { ApiErrorHandler } from '../utils/apiErrorHandler';

// Custom hook for API calls with error handling
export function useApiCall<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: {
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
      showSuccessToast?: boolean;
      successMessage?: string;
      showErrorToast?: boolean;
    } = {}
  ) => {
    const {
      onSuccess,
      onError,
      showSuccessToast = false,
      successMessage = 'Operation successful',
      showErrorToast = true
    } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);

      // Show success toast
      if (showSuccessToast) {
        showToast(successMessage, 'success');
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }

      return result;

    } catch (err) {
      const apiError = ApiErrorHandler.handleError(err, {
        showToast: showErrorToast ? showToast : undefined,
        onAuthError: () => {
          // Redirect to login on auth error
          localStorage.removeItem('token');
          navigate('/login');
        },
        onNetworkError: () => {
          console.log('Network error - you may be offline');
        }
      });

      setError(apiError);

      // Call error callback
      if (onError) {
        onError(apiError);
      }

      throw apiError;

    } finally {
      setLoading(false);
    }
  }, [showToast, navigate]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { loading, error, data, execute, reset };
}

// Usage in component:
function OrderList() {
  const { loading, error, data, execute } = useApiCall<any[]>();

  useEffect(() => {
    execute(
      () => OrderService.getOrders(),
      {
        showSuccessToast: false, // Don't show toast for GET
        showErrorToast: true
      }
    );
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div>
      {data?.map(order => (
        <div key={order.id}>{order.order_number}</div>
      ))}
    </div>
  );
}
*/

// ============================================
// BACKEND INTEGRATION EXAMPLE
// ============================================

/*
// In backend server.ts or app.ts

import express from 'express';
import { 
  errorHandler, 
  notFoundHandler, 
  asyncHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  handleShutdown
} from './middleware/errorHandler';

const app = express();

// ... other middleware ...

// Routes
app.get('/api/orders', asyncHandler(async (req, res) => {
  const orders = await OrderService.getOrders();
  res.json({ success: true, data: orders });
}));

app.post('/api/orders', asyncHandler(async (req, res) => {
  const order = await OrderService.createOrder(req.body);
  res.status(201).json({ success: true, data: order });
}));

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handlers
handleUnhandledRejection();
handleUncaughtException();
handleShutdown(server);
*/

// ============================================
// CONTROLLER EXAMPLE WITH ERROR HANDLING
// ============================================

/*
import { Request, Response, NextFunction } from 'express';
import { 
  ValidationError, 
  NotFoundError,
  InsufficientStockError 
} from '../utils/errors';
import { asyncHandler } from '../middleware/errorHandler';

class OrderController {
  // Using asyncHandler wrapper
  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { customer_id, items } = req.body;

    // Validation
    if (!customer_id) {
      throw new ValidationError('Customer ID is required');
    }

    if (!items || items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }

    // Check stock
    for (const item of items) {
      const product = await ProductService.getById(item.product_id);
      
      if (!product) {
        throw new NotFoundError(`Product ${item.product_id}`);
      }

      if (product.stock < item.quantity) {
        throw new InsufficientStockError(
          product.id,
          product.stock,
          item.quantity
        );
      }
    }

    // Create order
    const order = await OrderService.create({
      customer_id,
      items,
      user_id: req.user.id
    });

    res.status(201).json({
      success: true,
      data: order
    });
  });

  // Manual try-catch (alternative)
  getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const order = await OrderService.getById(parseInt(id));

      if (!order) {
        throw new NotFoundError(`Order ${id}`);
      }

      res.json({
        success: true,
        data: order
      });

    } catch (error) {
      next(error); // Pass to error handler
    }
  };
}

export default new OrderController();
*/

export {};
