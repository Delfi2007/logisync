/**
 * LogiSync Backend API Testing Script
 * Tests all 45 endpoints across 6 modules
 * 
 * Run with: node test-api.js
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;
let testUserId = null;
let testProductId = null;
let testCustomerId = null;
let testAddressId = null;
let testWarehouseId = null;
let testOrderId = null;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = authToken) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const contentType = response.headers.get('content-type');
    
    let responseData;
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return {
      status: response.status,
      ok: response.ok,
      data: responseData,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

// Test result tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name, passed, details = '') {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`  ${status} ${name}`);
  if (details) {
    console.log(`    ${colors.yellow}${details}${colors.reset}`);
  }
  
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

function logSection(title) {
  console.log(`\n${colors.cyan}${colors.bright}━━━ ${title} ━━━${colors.reset}`);
}

function logSubSection(title) {
  console.log(`\n${colors.blue}${title}${colors.reset}`);
}

// ============================================================================
// 1. AUTHENTICATION API TESTS
// ============================================================================
async function testAuthenticationAPI() {
  logSection('1. AUTHENTICATION API');

  // Test 1.1: Health Check
  logSubSection('Test 1.1: Health Check');
  const health = await apiRequest('GET', '/../health', null, null);
  logTest('GET /health', health.ok && health.data.success === true, 
    health.ok ? 'Server is healthy' : `Status: ${health.status}, Error: ${health.error || JSON.stringify(health.data)}`);

  // Test 1.2: Register new user
  logSubSection('Test 1.2: Register New User');
  const registerData = {
    full_name: `Test User ${Date.now()}`,
    email: `testuser${Date.now()}@example.com`,
    password: 'Test@12345',
    role: 'manager',
  };
  const register = await apiRequest('POST', '/auth/register', registerData, null);
  logTest('POST /auth/register', register.ok && register.data.data && register.data.data.user, 
    register.ok ? `User created: ${register.data.data.user.email}` : `Error: ${JSON.stringify(register.data)}`);
  
  if (register.ok && register.data.data && register.data.data.user) {
    testUserId = register.data.data.user.id;
    // Use the token from registration for subsequent requests
    if (register.data.data.token) {
      authToken = register.data.data.token;
    }
  }

  // Test 1.3: Register with duplicate email (should fail)
  logSubSection('Test 1.3: Duplicate Email Validation');
  const duplicateRegister = await apiRequest('POST', '/auth/register', registerData, null);
  logTest('POST /auth/register (duplicate)', !duplicateRegister.ok && duplicateRegister.status === 400,
    duplicateRegister.ok ? 'Should have failed' : 'Correctly rejected duplicate email');

  // Test 1.4: Login with correct credentials
  logSubSection('Test 1.4: Login');
  const loginData = {
    email: registerData.email,
    password: registerData.password,
  };
  const login = await apiRequest('POST', '/auth/login', loginData, null);
  logTest('POST /auth/login', login.ok && login.data.data && login.data.data.token,
    login.ok ? 'Login successful, token received' : `Error: ${JSON.stringify(login.data)}`);
  
  if (login.ok && login.data.data && login.data.data.token) {
    authToken = login.data.data.token;
  }

  // Test 1.5: Login with wrong password (should fail)
  logSubSection('Test 1.5: Invalid Login');
  const wrongLogin = await apiRequest('POST', '/auth/login', { email: registerData.email, password: 'wrong' }, null);
  logTest('POST /auth/login (wrong password)', !wrongLogin.ok && wrongLogin.status === 401,
    wrongLogin.ok ? 'Should have failed' : 'Correctly rejected wrong password');

  // Test 1.6: Make sure we have a valid token for subsequent tests
  logSubSection('Test 1.6: Verify Token Available');
  logTest('Token available for authenticated requests', authToken !== null,
    authToken ? 'Token obtained from registration' : 'No token available');
}

// ============================================================================
// 2. PRODUCTS API TESTS
// ============================================================================
async function testProductsAPI() {
  logSection('2. PRODUCTS API');

  // Test 2.1: Get all products
  logSubSection('Test 2.1: Get All Products');
  const allProducts = await apiRequest('GET', '/products');
  const productsData = allProducts.ok && allProducts.data.data && allProducts.data.data.products;
  logTest('GET /api/products', allProducts.ok && Array.isArray(productsData),
    allProducts.ok ? `Found ${productsData ? productsData.length : 0} products` : `Error: ${JSON.stringify(allProducts.data)}`);

  // Test 2.2: Get products with pagination
  logSubSection('Test 2.2: Pagination');
  const paginatedProducts = await apiRequest('GET', '/products?page=1&limit=5');
  const pagedData = paginatedProducts.ok && paginatedProducts.data.data && paginatedProducts.data.data.products;
  logTest('GET /api/products?page=1&limit=5', 
    paginatedProducts.ok && Array.isArray(pagedData) && pagedData.length <= 5,
    paginatedProducts.ok ? `Returned ${pagedData ? pagedData.length : 0} products` : 'Failed');

  // Test 2.3: Get products with filter
  logSubSection('Test 2.3: Filter by Category');
  const filteredProducts = await apiRequest('GET', '/products?category=Electronics');
  const filteredData = filteredProducts.ok && filteredProducts.data.data && filteredProducts.data.data.products;
  logTest('GET /api/products?category=Electronics',
    filteredProducts.ok,
    filteredProducts.ok ? `Found ${filteredData ? filteredData.length : 0} electronics` : 'Failed');

  // Test 2.4: Search products
  logSubSection('Test 2.4: Search Products');
  const searchProducts = await apiRequest('GET', '/products?search=laptop');
  const searchData = searchProducts.ok && searchProducts.data.data && searchProducts.data.data.products;
  logTest('GET /api/products?search=laptop',
    searchProducts.ok,
    searchProducts.ok ? `Found ${searchData ? searchData.length : 0} matching products` : 'Failed');

  // Test 2.5: Get product categories
  logSubSection('Test 2.5: Get Categories');
  const categories = await apiRequest('GET', '/products/categories');
  const categoriesData = categories.ok && categories.data.data;
  logTest('GET /api/products/categories',
    categories.ok && Array.isArray(categoriesData),
    categories.ok ? `Found ${categoriesData ? categoriesData.length : 0} categories` : 'Failed');

  // Test 2.6: Get low stock products
  logSubSection('Test 2.6: Get Low Stock Products');
  const lowStock = await apiRequest('GET', '/products/alerts/low-stock');
  const lowStockData = lowStock.ok && lowStock.data.data && lowStock.data.data.products;
  logTest('GET /api/products/alerts/low-stock',
    lowStock.ok && Array.isArray(lowStockData),
    lowStock.ok ? `Found ${lowStockData ? lowStockData.length : 0} low stock products` : 'Failed');

  // Test 2.7: Create new product
  logSubSection('Test 2.7: Create Product');
  const newProduct = {
    sku: `TEST-${Date.now()}`,
    name: 'Test Product',
    description: 'This is a test product',
    category: 'Electronics',
    price: 99.99,
    cost: 50.00,
    stock_quantity: 100,
    reorder_level: 20,
    unit: 'piece',
  };
  const createProduct = await apiRequest('POST', '/products', newProduct);
  logTest('POST /api/products',
    createProduct.ok && createProduct.data.data,
    createProduct.ok ? `Product created with ID: ${createProduct.data.data.id}` : `Error: ${JSON.stringify(createProduct.data)}`);
  
  if (createProduct.ok && createProduct.data.data) {
    testProductId = createProduct.data.data.id;
  }

  // Test 2.8: Get product by ID
  if (testProductId) {
    logSubSection('Test 2.8: Get Product by ID');
    const productById = await apiRequest('GET', `/products/${testProductId}`);
    logTest(`GET /api/products/${testProductId}`,
      productById.ok && productById.data.data.id === testProductId,
      productById.ok ? `Found: ${productById.data.data.name}` : 'Failed');

    // Test 2.9: Update product
    logSubSection('Test 2.9: Update Product');
    const updateProduct = await apiRequest('PUT', `/products/${testProductId}`, {
      name: 'Updated Test Product',
      price: 109.99,
    });
    logTest(`PUT /api/products/${testProductId}`,
      updateProduct.ok,
      updateProduct.ok ? 'Product updated successfully' : `Error: ${JSON.stringify(updateProduct.data)}`);

    // Test 2.10: Update stock
    logSubSection('Test 2.10: Update Stock');
    const updateStock = await apiRequest('PATCH', `/products/${testProductId}/stock`, {
      adjustment: 50,
      reason: 'Test adjustment - adding more stock',
    });
    logTest(`PATCH /api/products/${testProductId}/stock`,
      updateStock.ok,
      updateStock.ok ? 'Stock updated successfully' : `Error: ${JSON.stringify(updateStock.data)}`);
  }
}

// ============================================================================
// 3. CUSTOMERS API TESTS
// ============================================================================
async function testCustomersAPI() {
  logSection('3. CUSTOMERS API');

  // Test 3.1: Get all customers
  logSubSection('Test 3.1: Get All Customers');
  const allCustomers = await apiRequest('GET', '/customers');
  const customersData = allCustomers.ok && allCustomers.data.data && allCustomers.data.data.customers;
  logTest('GET /api/customers',
    allCustomers.ok && Array.isArray(customersData),
    allCustomers.ok ? `Found ${customersData ? customersData.length : 0} customers` : 'Failed');

  // Test 3.2: Get customers with pagination
  logSubSection('Test 3.2: Pagination');
  const paginatedCustomers = await apiRequest('GET', '/customers?page=1&limit=5');
  const pagedCustomersData = paginatedCustomers.ok && paginatedCustomers.data.data && paginatedCustomers.data.data.customers;
  logTest('GET /api/customers?page=1&limit=5',
    paginatedCustomers.ok && Array.isArray(pagedCustomersData) && pagedCustomersData.length <= 5,
    paginatedCustomers.ok ? `Returned ${pagedCustomersData ? pagedCustomersData.length : 0} customers` : 'Failed');

  // Test 3.3: Create new customer
  logSubSection('Test 3.3: Create Customer');
  const newCustomer = {
    name: `Test Customer ${Date.now()}`,
    email: `customer${Date.now()}@example.com`,
    phone: '+911234567890',
    segment: 'regular',
    address: {
      street: '123 Test Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      is_default: true,
    },
  };
  const createCustomer = await apiRequest('POST', '/customers', newCustomer);
  logTest('POST /api/customers',
    createCustomer.ok && createCustomer.data.data,
    createCustomer.ok ? `Customer created with ID: ${createCustomer.data.data.id}` : `Error: ${JSON.stringify(createCustomer.data)}`);
  
  if (createCustomer.ok && createCustomer.data.data) {
    testCustomerId = createCustomer.data.data.id;
  }

  // Test 3.4: Get customer by ID
  if (testCustomerId) {
    logSubSection('Test 3.4: Get Customer by ID');
    const customerById = await apiRequest('GET', `/customers/${testCustomerId}`);
    logTest(`GET /api/customers/${testCustomerId}`,
      customerById.ok && customerById.data.data.id === testCustomerId,
      customerById.ok ? `Found: ${customerById.data.data.name}` : 'Failed');

    // Test 3.5: Update customer
    logSubSection('Test 3.5: Update Customer');
    const updateCustomer = await apiRequest('PUT', `/customers/${testCustomerId}`, {
      name: 'Updated Test Customer',
      segment: 'premium',
    });
    logTest(`PUT /api/customers/${testCustomerId}`,
      updateCustomer.ok,
      updateCustomer.ok ? 'Customer updated successfully' : `Error: ${JSON.stringify(updateCustomer.data)}`);

    // Test 3.6: Add customer address
    logSubSection('Test 3.6: Add Customer Address');
    const newAddress = {
      type: 'shipping',
      street: '456 Another Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India',
      is_default: false,
    };
    const addAddress = await apiRequest('POST', `/customers/${testCustomerId}/addresses`, newAddress);
    logTest(`POST /api/customers/${testCustomerId}/addresses`,
      addAddress.ok && addAddress.data.data,
      addAddress.ok ? `Address created with ID: ${addAddress.data.data.id}` : `Error: ${JSON.stringify(addAddress.data)}`);
    
    if (addAddress.ok && addAddress.data.data) {
      testAddressId = addAddress.data.data.id;
    }

    // Test 3.7: Update customer address
    if (testAddressId) {
      logSubSection('Test 3.7: Update Customer Address');
      const updateAddress = await apiRequest('PUT', `/customers/${testCustomerId}/addresses/${testAddressId}`, {
        street: '456 Another Street, Apartment 5B',
      });
      logTest(`PUT /api/customers/${testCustomerId}/addresses/${testAddressId}`,
        updateAddress.ok,
        updateAddress.ok ? 'Address updated successfully' : `Error: ${JSON.stringify(updateAddress.data)}`);
    }
  }
}

// ============================================================================
// 4. WAREHOUSES API TESTS
// ============================================================================
async function testWarehousesAPI() {
  logSection('4. WAREHOUSES API');

  // Test 4.1: Get all warehouses
  logSubSection('Test 4.1: Get All Warehouses');
  const allWarehouses = await apiRequest('GET', '/warehouses');
  const warehousesData = allWarehouses.ok && allWarehouses.data.data && allWarehouses.data.data.warehouses;
  logTest('GET /api/warehouses',
    allWarehouses.ok && Array.isArray(warehousesData),
    allWarehouses.ok ? `Found ${warehousesData ? warehousesData.length : 0} warehouses` : 'Failed');

  // Test 4.2: Create new warehouse
  logSubSection('Test 4.2: Create Warehouse');
  const newWarehouse = {
    code: `WH-TEST-${Date.now()}`,
    name: 'Test Warehouse',
    street: '123 Warehouse Lane',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    capacity: 1000,
    current_stock: 0,
    contact_person: 'Test Manager',
    contact_phone: '+911234567890',
    amenities: ['Loading Dock', 'Climate Control'],
  };
  const createWarehouse = await apiRequest('POST', '/warehouses', newWarehouse);
  logTest('POST /api/warehouses',
    createWarehouse.ok && createWarehouse.data.data,
    createWarehouse.ok ? `Warehouse created with ID: ${createWarehouse.data.data.id}` : `Error: ${JSON.stringify(createWarehouse.data)}`);
  
  if (createWarehouse.ok && createWarehouse.data.data) {
    testWarehouseId = createWarehouse.data.data.id;
  }

  // Test 4.3: Get warehouse by ID
  if (testWarehouseId) {
    logSubSection('Test 4.3: Get Warehouse by ID');
    const warehouseById = await apiRequest('GET', `/warehouses/${testWarehouseId}`);
    logTest(`GET /api/warehouses/${testWarehouseId}`,
      warehouseById.ok && warehouseById.data.data.id === testWarehouseId,
      warehouseById.ok ? `Found: ${warehouseById.data.data.name}` : 'Failed');

    // Test 4.4: Update warehouse
    logSubSection('Test 4.4: Update Warehouse');
    const updateWarehouse = await apiRequest('PUT', `/warehouses/${testWarehouseId}`, {
      name: 'Updated Test Warehouse',
      capacity: 1500,
    });
    logTest(`PUT /api/warehouses/${testWarehouseId}`,
      updateWarehouse.ok,
      updateWarehouse.ok ? 'Warehouse updated successfully' : `Error: ${JSON.stringify(updateWarehouse.data)}`);

    // Test 4.5: Update warehouse amenities
    logSubSection('Test 4.5: Update Warehouse Amenities');
    const updateAmenities = await apiRequest('PUT', `/warehouses/${testWarehouseId}/amenities`, {
      amenities: ['Loading Dock', 'Climate Control', 'Security Camera', '24/7 Access'],
    });
    logTest(`PUT /api/warehouses/${testWarehouseId}/amenities`,
      updateAmenities.ok,
      updateAmenities.ok ? 'Amenities updated successfully' : `Error: ${JSON.stringify(updateAmenities.data)}`);
  }

  // Test 4.6: Get nearby warehouses
  logSubSection('Test 4.6: Get Nearby Warehouses');
  const nearbyWarehouses = await apiRequest('GET', '/warehouses/nearby?pincode=400001&radius=50');
  const nearbyData = nearbyWarehouses.ok && nearbyWarehouses.data.data;
  logTest('GET /api/warehouses/nearby',
    nearbyWarehouses.ok && Array.isArray(nearbyData),
    nearbyWarehouses.ok ? `Found ${nearbyData ? nearbyData.length : 0} nearby warehouses` : 'Failed');
}

// ============================================================================
// 5. ORDERS API TESTS
// ============================================================================
async function testOrdersAPI() {
  logSection('5. ORDERS API');

  // Test 5.1: Get all orders
  logSubSection('Test 5.1: Get All Orders');
  const allOrders = await apiRequest('GET', '/orders');
  const ordersData = allOrders.ok && allOrders.data.data && allOrders.data.data.orders;
  logTest('GET /api/orders',
    allOrders.ok && Array.isArray(ordersData),
    allOrders.ok ? `Found ${ordersData ? ordersData.length : 0} orders` : 'Failed');

  // Test 5.2: Get order stats
  logSubSection('Test 5.2: Get Order Stats');
  const orderStats = await apiRequest('GET', '/orders/stats');
  logTest('GET /api/orders/stats',
    orderStats.ok && orderStats.data.data,
    orderStats.ok ? 'Stats retrieved successfully' : 'Failed');

  // Test 5.3: Create new order (only if we have test customer and product)
  if (testCustomerId && testProductId) {
    logSubSection('Test 5.3: Create Order');
    const newOrder = {
      customer_id: testCustomerId,
      items: [
        {
          product_id: testProductId,
          quantity: 2,
        },
      ],
      shipping_street: '123 Test Street',
      shipping_city: 'Mumbai',
      shipping_state: 'Maharashtra',
      shipping_pincode: '400001',
      shipping_country: 'India',
    };
    const createOrder = await apiRequest('POST', '/orders', newOrder);
    logTest('POST /api/orders',
      createOrder.ok && createOrder.data.data,
      createOrder.ok ? `Order created with ID: ${createOrder.data.data.id}` : `Error: ${JSON.stringify(createOrder.data)}`);
    
    if (createOrder.ok && createOrder.data.data) {
      testOrderId = createOrder.data.data.id;
    }

    // Test 5.4: Get order by ID
    if (testOrderId) {
      logSubSection('Test 5.4: Get Order by ID');
      const orderById = await apiRequest('GET', `/orders/${testOrderId}`);
      logTest(`GET /api/orders/${testOrderId}`,
        orderById.ok && orderById.data.data.id === testOrderId,
        orderById.ok ? `Found order: ${orderById.data.data.order_number}` : 'Failed');

      // Test 5.5: Update order status
      logSubSection('Test 5.5: Update Order Status');
      const updateOrderStatus = await apiRequest('PUT', `/orders/${testOrderId}/status`, {
        status: 'confirmed',
      });
      logTest(`PUT /api/orders/${testOrderId}/status`,
        updateOrderStatus.ok,
        updateOrderStatus.ok ? 'Order status updated successfully' : `Error: ${JSON.stringify(updateOrderStatus.data)}`);

      // Test 5.6: Update order
      logSubSection('Test 5.6: Update Order');
      const updateOrder = await apiRequest('PUT', `/orders/${testOrderId}`, {
        payment_status: 'paid',
      });
      logTest(`PUT /api/orders/${testOrderId}`,
        updateOrder.ok,
        updateOrder.ok ? 'Order updated successfully' : `Error: ${JSON.stringify(updateOrder.data)}`);
    }
  } else {
    console.log(`  ${colors.yellow}⚠ Skipping order creation tests (missing test customer or product)${colors.reset}`);
  }

  // Test 5.7: Filter orders by status
  logSubSection('Test 5.7: Filter Orders by Status');
  const filteredOrders = await apiRequest('GET', '/orders?status=pending');
  const filteredOrdersData = filteredOrders.ok && filteredOrders.data.data && filteredOrders.data.data.orders;
  logTest('GET /api/orders?status=pending',
    filteredOrders.ok,
    filteredOrders.ok ? `Found ${filteredOrdersData ? filteredOrdersData.length : 0} pending orders` : 'Failed');
}

// ============================================================================
// 6. DASHBOARD API TESTS
// ============================================================================
async function testDashboardAPI() {
  logSection('6. DASHBOARD API');

  // Test 6.1: Get dashboard stats
  logSubSection('Test 6.1: Get Dashboard Stats');
  const dashboardStats = await apiRequest('GET', '/dashboard/stats');
  logTest('GET /api/dashboard/stats',
    dashboardStats.ok && dashboardStats.data.data,
    dashboardStats.ok ? 'Dashboard stats retrieved' : 'Failed');

  // Test 6.2: Get recent orders
  logSubSection('Test 6.2: Get Recent Orders');
  const recentOrders = await apiRequest('GET', '/dashboard/recent-orders?limit=5');
  logTest('GET /api/dashboard/recent-orders',
    recentOrders.ok && Array.isArray(recentOrders.data.data),
    recentOrders.ok ? `Found ${recentOrders.data.data.length} recent orders` : 'Failed');

  // Test 6.3: Get low stock products
  logSubSection('Test 6.3: Get Low Stock Products');
  const lowStockProducts = await apiRequest('GET', '/dashboard/low-stock?limit=10');
  logTest('GET /api/dashboard/low-stock',
    lowStockProducts.ok && Array.isArray(lowStockProducts.data.data),
    lowStockProducts.ok ? `Found ${lowStockProducts.data.data.length} low stock products` : 'Failed');

  // Test 6.4: Get top customers
  logSubSection('Test 6.4: Get Top Customers');
  const topCustomers = await apiRequest('GET', '/dashboard/top-customers?limit=10');
  logTest('GET /api/dashboard/top-customers',
    topCustomers.ok && Array.isArray(topCustomers.data.data),
    topCustomers.ok ? `Found ${topCustomers.data.data.length} top customers` : 'Failed');

  // Test 6.5: Get revenue chart (7 days)
  logSubSection('Test 6.5: Get Revenue Chart (7 days)');
  const revenueChart7d = await apiRequest('GET', '/dashboard/revenue-chart?period=7days');
  const chartData7d = revenueChart7d.ok && revenueChart7d.data.data && revenueChart7d.data.data.chart_data;
  logTest('GET /api/dashboard/revenue-chart?period=7days',
    revenueChart7d.ok && Array.isArray(chartData7d),
    revenueChart7d.ok ? `Retrieved ${chartData7d ? chartData7d.length : 0} data points` : 'Failed');

  // Test 6.6: Get revenue chart (30 days)
  logSubSection('Test 6.6: Get Revenue Chart (30 days)');
  const revenueChart30d = await apiRequest('GET', '/dashboard/revenue-chart?period=30days');
  const chartData30d = revenueChart30d.ok && revenueChart30d.data.data && revenueChart30d.data.data.chart_data;
  logTest('GET /api/dashboard/revenue-chart?period=30days',
    revenueChart30d.ok && Array.isArray(chartData30d),
    revenueChart30d.ok ? `Retrieved ${chartData30d ? chartData30d.length : 0} data points` : 'Failed');

  // Test 6.7: Get order status distribution
  logSubSection('Test 6.7: Get Order Status Distribution');
  const orderStatusDist = await apiRequest('GET', '/dashboard/order-status-distribution');
  const orderStatusData = orderStatusDist.ok && orderStatusDist.data.data;
  logTest('GET /api/dashboard/order-status-distribution',
    orderStatusDist.ok && Array.isArray(orderStatusData),
    orderStatusDist.ok ? `Found ${orderStatusData ? orderStatusData.length : 0} status types` : 'Failed');

  // Test 6.8: Get Product Category Distribution
  logSubSection('Test 6.8: Get Product Category Distribution');
  const productCategoryDist = await apiRequest('GET', '/dashboard/product-category-distribution');
  const productCategoryData = productCategoryDist.ok && productCategoryDist.data.data;
  logTest('GET /api/dashboard/product-category-distribution',
    productCategoryDist.ok && Array.isArray(productCategoryData),
    productCategoryDist.ok ? `Found ${productCategoryData ? productCategoryData.length : 0} categories` : 'Failed');

  // Test 6.9: Get Customer Segment Distribution
  logSubSection('Test 6.9: Get Customer Segment Distribution');
  const customerSegmentDist = await apiRequest('GET', '/dashboard/customer-segment-distribution');
  const customerSegmentData = customerSegmentDist.ok && customerSegmentDist.data.data;
  logTest('GET /api/dashboard/customer-segment-distribution',
    customerSegmentDist.ok && Array.isArray(customerSegmentData),
    customerSegmentDist.ok ? `Found ${customerSegmentData ? customerSegmentData.length : 0} segments` : 'Failed');

  // Test 6.10: Get warehouse utilization
  logSubSection('Test 6.10: Get Warehouse Utilization');
  const warehouseUtil = await apiRequest('GET', '/dashboard/warehouse-utilization');
  logTest('GET /api/dashboard/warehouse-utilization',
    warehouseUtil.ok && Array.isArray(warehouseUtil.data.data),
    warehouseUtil.ok ? 'Warehouse utilization retrieved' : 'Failed');
}

// ============================================================================
// CLEANUP TESTS (Delete test data)
// ============================================================================
async function cleanupTestData() {
  logSection('CLEANUP (Deleting Test Data)');

  // Delete test order
  if (testOrderId) {
    logSubSection('Cleanup: Delete Test Order');
    const deleteOrder = await apiRequest('DELETE', `/orders/${testOrderId}`);
    logTest(`DELETE /api/orders/${testOrderId}`,
      deleteOrder.ok,
      deleteOrder.ok ? 'Test order deleted' : 'Failed to delete order');
  }

  // Delete test customer address
  if (testCustomerId && testAddressId) {
    logSubSection('Cleanup: Delete Test Address');
    const deleteAddress = await apiRequest('DELETE', `/customers/${testCustomerId}/addresses/${testAddressId}`);
    logTest(`DELETE /api/customers/${testCustomerId}/addresses/${testAddressId}`,
      deleteAddress.ok,
      deleteAddress.ok ? 'Test address deleted' : 'Failed to delete address');
  }

  // Delete test customer
  if (testCustomerId) {
    logSubSection('Cleanup: Delete Test Customer');
    const deleteCustomer = await apiRequest('DELETE', `/customers/${testCustomerId}`);
    logTest(`DELETE /api/customers/${testCustomerId}`,
      deleteCustomer.ok,
      deleteCustomer.ok ? 'Test customer deleted' : 'Failed to delete customer');
  }

  // Delete test warehouse
  if (testWarehouseId) {
    logSubSection('Cleanup: Delete Test Warehouse');
    const deleteWarehouse = await apiRequest('DELETE', `/warehouses/${testWarehouseId}`);
    logTest(`DELETE /api/warehouses/${testWarehouseId}`,
      deleteWarehouse.ok,
      deleteWarehouse.ok ? 'Test warehouse deleted' : 'Failed to delete warehouse');
  }

  // Delete test product
  if (testProductId) {
    logSubSection('Cleanup: Delete Test Product');
    const deleteProduct = await apiRequest('DELETE', `/products/${testProductId}`);
    logTest(`DELETE /api/products/${testProductId}`,
      deleteProduct.ok,
      deleteProduct.ok ? 'Test product deleted' : 'Failed to delete product');
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================
async function runAllTests() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║         LogiSync Backend API Testing Script                   ║');
  console.log('║         Testing all 45 endpoints                               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  const startTime = Date.now();

  try {
    await testAuthenticationAPI();
    await testProductsAPI();
    await testCustomersAPI();
    await testWarehousesAPI();
    await testOrdersAPI();
    await testDashboardAPI();
    await cleanupTestData();
  } catch (error) {
    console.error(`\n${colors.red}Fatal error during testing:${colors.reset}`, error);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  console.log(`\n${colors.bright}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}TEST SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`  Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`  ${colors.green}✓ Passed: ${testResults.passed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${testResults.failed}${colors.reset}`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
