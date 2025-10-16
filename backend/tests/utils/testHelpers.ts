/**
 * Test Utilities
 * 
 * Common utilities and helpers for testing
 * - Mock data generators
 * - Test helpers
 * - Assertion utilities
 * 
 * Phase 4 Task 6: Testing Suite
 * Date: October 16, 2025
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Generate random string
 */
export const randomString = (length: number = 10): string => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Generate random email
 */
export const randomEmail = (): string => {
  return `test-${Math.random().toString(36).substring(7)}@test.com`;
};

/**
 * Generate random Indian phone number
 */
export const randomPhone = (): string => {
  return `98${Math.floor(10000000 + Math.random() * 90000000)}`;
};

/**
 * Generate random Indian pincode
 */
export const randomPincode = (): string => {
  return `${Math.floor(110001 + Math.random() * (855118 - 110001))}`;
};

/**
 * Generate random Indian GST number
 */
export const randomGST = (): string => {
  const stateCode = `${Math.floor(10 + Math.random() * 90)}`;
  const pan = randomString(5).toUpperCase();
  const entityNum = `${Math.floor(1000 + Math.random() * 9000)}`;
  const checksum = randomString(1).toUpperCase();
  return `${stateCode}${pan}${entityNum}A${checksum}Z${checksum}`;
};

/**
 * Wait for specified milliseconds
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate mock user data
 */
export const mockUser = (overrides: Partial<any> = {}) => ({
  id: Math.floor(Math.random() * 1000),
  email: randomEmail(),
  password_hash: '$2b$10$dummyHashForTesting',
  full_name: 'Test User',
  role: 'user',
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides
});

/**
 * Generate mock product data
 */
export const mockProduct = (overrides: Partial<any> = {}) => ({
  id: Math.floor(Math.random() * 1000),
  user_id: 1,
  name: `Test Product ${randomString(5)}`,
  sku: `SKU-${randomString(6).toUpperCase()}`,
  category: 'Electronics',
  description: 'Test product description',
  price: parseFloat((Math.random() * 10000).toFixed(2)),
  cost: parseFloat((Math.random() * 5000).toFixed(2)),
  stock: Math.floor(Math.random() * 100),
  reorder_level: 10,
  supplier: 'Test Supplier',
  status: 'active',
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides
});

/**
 * Generate mock customer data
 */
export const mockCustomer = (overrides: Partial<any> = {}) => ({
  id: Math.floor(Math.random() * 1000),
  user_id: 1,
  name: `Test Customer ${randomString(5)}`,
  email: randomEmail(),
  phone: randomPhone(),
  business_name: `Test Business ${randomString(5)}`,
  gst_number: randomGST(),
  segment: 'regular',
  total_orders: 0,
  total_revenue: 0,
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides
});

/**
 * Generate mock address data
 */
export const mockAddress = (overrides: Partial<any> = {}) => ({
  id: Math.floor(Math.random() * 1000),
  customer_id: 1,
  type: 'billing',
  street: '123 Test Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: randomPincode(),
  is_default: false,
  created_at: new Date(),
  ...overrides
});

/**
 * Generate mock warehouse data
 */
export const mockWarehouse = (overrides: Partial<any> = {}) => ({
  id: Math.floor(Math.random() * 1000),
  user_id: 1,
  name: `Test Warehouse ${randomString(5)}`,
  code: `WH-${randomString(6).toUpperCase()}`,
  street: '456 Warehouse Road',
  city: 'Delhi',
  state: 'Delhi',
  pincode: randomPincode(),
  latitude: 28.7041 + (Math.random() - 0.5) * 0.1,
  longitude: 77.1025 + (Math.random() - 0.5) * 0.1,
  capacity: 10000,
  occupied: 5000,
  status: 'active',
  is_verified: true,
  operating_hours: '9 AM - 6 PM',
  contact_person: 'Test Manager',
  contact_phone: randomPhone(),
  cost_per_sqft: 50,
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides
});

/**
 * Generate mock order data
 */
export const mockOrder = (overrides: Partial<any> = {}) => {
  const subtotal = parseFloat((Math.random() * 10000).toFixed(2));
  const taxAmount = parseFloat((subtotal * 0.18).toFixed(2));
  const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2));
  
  return {
    id: Math.floor(Math.random() * 1000),
    user_id: 1,
    customer_id: 1,
    order_number: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    payment_status: 'pending',
    subtotal,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    shipping_street: '789 Shipping Street',
    shipping_city: 'Bangalore',
    shipping_state: 'Karnataka',
    shipping_pincode: randomPincode(),
    notes: 'Test order notes',
    created_at: new Date(),
    updated_at: new Date(),
    delivered_at: null,
    ...overrides
  };
};

/**
 * Generate mock order item data
 */
export const mockOrderItem = (overrides: Partial<any> = {}) => {
  const quantity = Math.floor(1 + Math.random() * 10);
  const unitPrice = parseFloat((Math.random() * 1000).toFixed(2));
  const totalPrice = parseFloat((quantity * unitPrice).toFixed(2));
  
  return {
    id: Math.floor(Math.random() * 1000),
    order_id: 1,
    product_id: 1,
    product_name: `Test Product ${randomString(5)}`,
    product_sku: `SKU-${randomString(6).toUpperCase()}`,
    quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
    ...overrides
  };
};

/**
 * Generate mock JWT token
 */
export const mockJWT = (payload: any = {}) => {
  // Simple mock token for testing (not a real JWT)
  const defaultPayload = {
    userId: 1,
    email: 'test@test.com',
    role: 'user',
    ...payload
  };
  
  return `mock.jwt.${Buffer.from(JSON.stringify(defaultPayload)).toString('base64')}`;
};

/**
 * Mock database query result
 */
export const mockQueryResult = (rows: any[] = [], fields: any[] = []) => ({
  rows,
  fields,
  rowCount: rows.length,
  command: 'SELECT',
  oid: 0
});

/**
 * Mock Express request
 */
export const mockRequest = (overrides: Partial<any> = {}) => ({
  method: 'GET',
  url: '/test',
  headers: {},
  query: {},
  params: {},
  body: {},
  user: null,
  ip: '127.0.0.1',
  get: (header: string) => overrides.headers?.[header] || null,
  ...overrides
});

/**
 * Mock Express response
 */
export const mockResponse = (): Partial<Response> => {
  const res: any = {
    statusCode: 200,
    headers: {},
    body: null,
    status: function(code: number) {
      this.statusCode = code;
      return this;
    },
    json: function(data: any) {
      this.body = data;
      return this;
    },
    send: function(data: any) {
      this.body = data;
      return this;
    },
    set: function(field: string, value: string) {
      this.headers[field] = value;
      return this;
    },
    setHeader: function(name: string, value: string) {
      this.headers[name] = value;
      return this;
    },
    cookie: function(name: string, value: string) {
      return this;
    },
    clearCookie: function(name: string) {
      return this;
    },
    redirect: function(url: string) {
      return this;
    },
    render: function(view: string, options?: any) {
      return this;
    }
  };
  
  return res;
};

/**
 * Mock Express next function
 */
export const mockNext = (): NextFunction => {
  return (() => {}) as NextFunction;
};

/**
 * Assert error response format
 * Note: These assertions throw errors instead of using expect() to avoid jest dependency
 * Use them in actual test files where jest expect() is available for better assertions
 */
export const assertErrorResponse = (response: any, expectedCode: string, expectedStatus: number) => {
  if (response.success !== false) {
    throw new Error(`Expected success to be false, got ${response.success}`);
  }
  if (!response.error) {
    throw new Error('Expected error to be defined');
  }
  if (response.error.code !== expectedCode) {
    throw new Error(`Expected error code to be ${expectedCode}, got ${response.error.code}`);
  }
  if (response.error.statusCode !== expectedStatus) {
    throw new Error(`Expected status code to be ${expectedStatus}, got ${response.error.statusCode}`);
  }
  if (!response.error.message) {
    throw new Error('Expected error message to be defined');
  }
};

/**
 * Assert success response format
 */
export const assertSuccessResponse = (response: any) => {
  if (response.success !== true) {
    throw new Error(`Expected success to be true, got ${response.success}`);
  }
  if (!response.data) {
    throw new Error('Expected data to be defined');
  }
};

/**
 * Assert pagination response format
 */
export const assertPaginationResponse = (response: any) => {
  assertSuccessResponse(response);
  if (!response.pagination) {
    throw new Error('Expected pagination to be defined');
  }
  if (response.pagination.page === undefined) {
    throw new Error('Expected pagination.page to be defined');
  }
  if (response.pagination.limit === undefined) {
    throw new Error('Expected pagination.limit to be defined');
  }
  if (response.pagination.total === undefined) {
    throw new Error('Expected pagination.total to be defined');
  }
  if (response.pagination.totalPages === undefined) {
    throw new Error('Expected pagination.totalPages to be defined');
  }
};

export default {
  randomString,
  randomEmail,
  randomPhone,
  randomPincode,
  randomGST,
  wait,
  mockUser,
  mockProduct,
  mockCustomer,
  mockAddress,
  mockWarehouse,
  mockOrder,
  mockOrderItem,
  mockJWT,
  mockQueryResult,
  mockRequest,
  mockResponse,
  mockNext,
  assertErrorResponse,
  assertSuccessResponse,
  assertPaginationResponse
};
