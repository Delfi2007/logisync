import pool from '../config/database.js';

/**
 * Get dashboard statistics
 * @route GET /api/dashboard/stats
 * @access Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // Get overview statistics
    const statsQuery = `
      SELECT 
        -- Order stats
        (SELECT COUNT(*) FROM orders WHERE user_id = $1) as total_orders,
        (SELECT COUNT(*) FROM orders WHERE user_id = $1 AND status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM orders WHERE user_id = $1 AND status = 'delivered') as delivered_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = $1) as total_revenue,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = $1 AND status = 'delivered') as delivered_revenue,
        (SELECT COALESCE(AVG(total_amount), 0) FROM orders WHERE user_id = $1) as average_order_value,
        
        -- Customer stats
        (SELECT COUNT(*) FROM customers WHERE user_id = $1) as total_customers,
        (SELECT COUNT(*) FROM customers WHERE user_id = $1 AND segment = 'premium') as premium_customers,
        (SELECT COUNT(*) FROM customers WHERE user_id = $1 AND segment = 'new') as new_customers,
        
        -- Product stats
        (SELECT COUNT(*) FROM products WHERE user_id = $1) as total_products,
        (SELECT COUNT(*) FROM products WHERE user_id = $1 AND status = 'active') as active_products,
        (SELECT COUNT(*) FROM products WHERE user_id = $1 AND stock <= reorder_level) as low_stock_products,
        (SELECT COALESCE(SUM(stock * price), 0) FROM products WHERE user_id = $1) as inventory_value,
        
        -- Warehouse stats
        (SELECT COUNT(*) FROM warehouses WHERE user_id = $1) as total_warehouses,
        (SELECT COUNT(*) FROM warehouses WHERE user_id = $1 AND status = 'active') as active_warehouses,
        (SELECT COALESCE(SUM(capacity), 0) FROM warehouses WHERE user_id = $1) as total_capacity,
        (SELECT COALESCE(SUM(occupied), 0) FROM warehouses WHERE user_id = $1) as total_occupied
    `;

    const result = await pool.query(statsQuery, [user_id]);
    const stats = result.rows[0];

    // Calculate additional metrics
    const utilizationRate = stats.total_capacity > 0 
      ? ((stats.total_occupied / stats.total_capacity) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        orders: {
          total: parseInt(stats.total_orders),
          pending: parseInt(stats.pending_orders),
          delivered: parseInt(stats.delivered_orders),
          total_revenue: parseFloat(stats.total_revenue),
          delivered_revenue: parseFloat(stats.delivered_revenue),
          average_order_value: parseFloat(stats.average_order_value)
        },
        customers: {
          total: parseInt(stats.total_customers),
          premium: parseInt(stats.premium_customers),
          new: parseInt(stats.new_customers)
        },
        products: {
          total: parseInt(stats.total_products),
          active: parseInt(stats.active_products),
          low_stock: parseInt(stats.low_stock_products),
          inventory_value: parseFloat(stats.inventory_value)
        },
        warehouses: {
          total: parseInt(stats.total_warehouses),
          active: parseInt(stats.active_warehouses),
          total_capacity: parseInt(stats.total_capacity),
          total_occupied: parseInt(stats.total_occupied),
          utilization_rate: parseFloat(utilizationRate)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent orders
 * @route GET /api/dashboard/recent-orders
 * @access Private
 */
export const getRecentOrders = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const user_id = req.user.id;

    const query = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.payment_status,
        o.total_amount,
        o.created_at,
        c.name as customer_name,
        c.email as customer_email,
        (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [user_id, limit]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get low stock products
 * @route GET /api/dashboard/low-stock
 * @access Private
 */
export const getLowStockProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const user_id = req.user.id;

    const query = `
      SELECT 
        id,
        name,
        sku,
        category,
        stock,
        reorder_level,
        (reorder_level - stock) as shortage_quantity,
        price,
        supplier
      FROM products
      WHERE user_id = $1 
        AND stock <= reorder_level
        AND status = 'active'
      ORDER BY (reorder_level - stock) DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [user_id, limit]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get top customers by revenue
 * @route GET /api/dashboard/top-customers
 * @access Private
 */
export const getTopCustomers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const user_id = req.user.id;

    const query = `
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.business_name,
        c.segment,
        c.total_orders,
        c.total_revenue,
        c.created_at
      FROM customers c
      WHERE c.user_id = $1
      ORDER BY c.total_revenue DESC, c.total_orders DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [user_id, limit]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get revenue chart data
 * @route GET /api/dashboard/revenue-chart
 * @access Private
 */
export const getRevenueChart = async (req, res, next) => {
  try {
    const { period = '7days' } = req.query;
    const user_id = req.user.id;

    let dateFilter;
    let groupBy;

    switch (period) {
      case '7days':
        dateFilter = "created_at >= CURRENT_DATE - INTERVAL '7 days'";
        groupBy = "DATE(created_at)";
        break;
      case '30days':
        dateFilter = "created_at >= CURRENT_DATE - INTERVAL '30 days'";
        groupBy = "DATE(created_at)";
        break;
      case '12months':
        dateFilter = "created_at >= CURRENT_DATE - INTERVAL '12 months'";
        groupBy = "DATE_TRUNC('month', created_at)";
        break;
      default:
        dateFilter = "created_at >= CURRENT_DATE - INTERVAL '7 days'";
        groupBy = "DATE(created_at)";
    }

    const query = `
      SELECT 
        ${groupBy} as date,
        COUNT(*) as order_count,
        COALESCE(SUM(total_amount), 0) as revenue,
        COALESCE(AVG(total_amount), 0) as avg_order_value
      FROM orders
      WHERE user_id = $1 
        AND ${dateFilter}
      GROUP BY ${groupBy}
      ORDER BY date
    `;

    const result = await pool.query(query, [user_id]);

    res.json({
      success: true,
      data: {
        period,
        chart_data: result.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order status distribution
 * @route GET /api/dashboard/order-status
 * @access Private
 */
export const getOrderStatusDistribution = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as total_amount
      FROM orders
      WHERE user_id = $1
      GROUP BY status
      ORDER BY count DESC
    `;

    const result = await pool.query(query, [user_id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product category distribution
 * @route GET /api/dashboard/product-categories
 * @access Private
 */
export const getProductCategoryDistribution = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        category,
        COUNT(*) as product_count,
        SUM(stock) as total_stock,
        COALESCE(SUM(stock * price), 0) as inventory_value
      FROM products
      WHERE user_id = $1 AND category IS NOT NULL
      GROUP BY category
      ORDER BY product_count DESC
    `;

    const result = await pool.query(query, [user_id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get customer segment distribution
 * @route GET /api/dashboard/customer-segments
 * @access Private
 */
export const getCustomerSegmentDistribution = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        segment,
        COUNT(*) as customer_count,
        COALESCE(SUM(total_revenue), 0) as total_revenue,
        COALESCE(AVG(total_revenue), 0) as avg_revenue_per_customer
      FROM customers
      WHERE user_id = $1
      GROUP BY segment
      ORDER BY customer_count DESC
    `;

    const result = await pool.query(query, [user_id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get warehouse utilization
 * @route GET /api/dashboard/warehouse-utilization
 * @access Private
 */
export const getWarehouseUtilization = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        id,
        name,
        code,
        city,
        capacity,
        occupied,
        CASE 
          WHEN capacity > 0 THEN ROUND((occupied::DECIMAL / capacity::DECIMAL) * 100, 2)
          ELSE 0
        END as utilization_percentage,
        (capacity - occupied) as available_space
      FROM warehouses
      WHERE user_id = $1
      ORDER BY utilization_percentage DESC
    `;

    const result = await pool.query(query, [user_id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all dashboard data (combined endpoint)
 * @route GET /api/dashboard
 * @access Private
 */
export const getAllDashboardData = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // MOCK_DB mode - return mock data
    if (process.env.MOCK_DB === 'true') {
      const mockDashboardData = {
        stats: {
          orders: {
            total: 156,
            pending: 12,
            delivered: 128,
            total_revenue: 2845600,
            delivered_revenue: 2534200,
            average_order_value: 18240
          },
          customers: {
            total: 42,
            premium: 8,
            new: 5
          },
          products: {
            total: 89,
            active: 76,
            low_stock: 7,
            inventory_value: 4567800
          },
          warehouses: {
            total: 3,
            active: 3,
            total_capacity: 150000,
            total_occupied: 98500,
            utilization_rate: 65.67
          }
        },
        recent_orders: [
          { id: 1, order_number: 'ORD-2025-001', customer_name: 'Acme Corp', email: 'contact@acme.com', total_amount: 45600, status: 'processing', created_at: new Date('2025-10-20').toISOString(), item_count: 5 },
          { id: 2, order_number: 'ORD-2025-002', customer_name: 'TechHub Solutions', email: 'info@techhub.com', total_amount: 78900, status: 'pending', created_at: new Date('2025-10-19').toISOString(), item_count: 3 },
          { id: 3, order_number: 'ORD-2025-003', customer_name: 'Global Industries', email: 'orders@global.com', total_amount: 123400, status: 'delivered', created_at: new Date('2025-10-18').toISOString(), item_count: 8 },
          { id: 4, order_number: 'ORD-2025-004', customer_name: 'Metro Supplies', email: 'sales@metro.com', total_amount: 34200, status: 'completed', created_at: new Date('2025-10-17').toISOString(), item_count: 4 },
          { id: 5, order_number: 'ORD-2025-005', customer_name: 'Prime Logistics', email: 'contact@prime.com', total_amount: 56700, status: 'processing', created_at: new Date('2025-10-16').toISOString(), item_count: 6 }
        ],
        revenue_chart: {
          period: '7days',
          data: [
            { date: '2025-10-16', order_count: 8, revenue: 156800, avg_order_value: 19600 },
            { date: '2025-10-17', order_count: 12, revenue: 234500, avg_order_value: 19540 },
            { date: '2025-10-18', order_count: 15, revenue: 287300, avg_order_value: 19150 },
            { date: '2025-10-19', order_count: 10, revenue: 198700, avg_order_value: 19870 },
            { date: '2025-10-20', order_count: 18, revenue: 342600, avg_order_value: 19030 },
            { date: '2025-10-21', order_count: 14, revenue: 276400, avg_order_value: 19740 },
            { date: '2025-10-22', order_count: 9, revenue: 178900, avg_order_value: 19880 }
          ]
        },
        top_products: [
          { id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '+91 98765 43210', business_name: 'Acme Corporation', segment: 'premium', total_orders: 45, total_revenue: 892000, created_at: new Date('2024-01-15').toISOString() },
          { id: 2, name: 'TechHub Solutions', email: 'info@techhub.com', phone: '+91 98765 43211', business_name: 'TechHub Pvt Ltd', segment: 'premium', total_orders: 38, total_revenue: 756000, created_at: new Date('2024-02-20').toISOString() },
          { id: 3, name: 'Global Industries', email: 'orders@global.com', phone: '+91 98765 43212', business_name: 'Global Industries Inc', segment: 'enterprise', total_orders: 52, total_revenue: 1045000, created_at: new Date('2024-03-10').toISOString() },
          { id: 4, name: 'Metro Supplies', email: 'sales@metro.com', phone: '+91 98765 43213', business_name: 'Metro Supplies Ltd', segment: 'standard', total_orders: 28, total_revenue: 445000, created_at: new Date('2024-04-05').toISOString() },
          { id: 5, name: 'Prime Logistics', email: 'contact@prime.com', phone: '+91 98765 43214', business_name: 'Prime Logistics Co', segment: 'premium', total_orders: 35, total_revenue: 678000, created_at: new Date('2024-05-12').toISOString() }
        ]
      };

      // Set cache control headers
      res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      });

      return res.json({
        success: true,
        data: mockDashboardData
      });
    }

    // Execute all queries in parallel for better performance
    const [statsResult, recentOrdersResult, revenueChartResult, topCustomersResult] = await Promise.all([
      // Stats
      pool.query(`
        SELECT 
          -- Order stats
          (SELECT COUNT(*) FROM orders WHERE user_id = $1) as total_orders,
          (SELECT COUNT(*) FROM orders WHERE user_id = $1 AND status = 'pending') as pending_orders,
          (SELECT COUNT(*) FROM orders WHERE user_id = $1 AND status = 'delivered') as delivered_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = $1) as total_revenue,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = $1 AND status = 'delivered') as delivered_revenue,
          (SELECT COALESCE(AVG(total_amount), 0) FROM orders WHERE user_id = $1) as average_order_value,
          
          -- Customer stats
          (SELECT COUNT(*) FROM customers WHERE user_id = $1) as total_customers,
          (SELECT COUNT(*) FROM customers WHERE user_id = $1 AND segment = 'premium') as premium_customers,
          (SELECT COUNT(*) FROM customers WHERE user_id = $1 AND segment = 'new') as new_customers,
          
          -- Product stats
          (SELECT COUNT(*) FROM products WHERE user_id = $1) as total_products,
          (SELECT COUNT(*) FROM products WHERE user_id = $1 AND status = 'active') as active_products,
          (SELECT COUNT(*) FROM products WHERE user_id = $1 AND stock <= reorder_level) as low_stock_products,
          (SELECT COALESCE(SUM(stock * price), 0) FROM products WHERE user_id = $1) as inventory_value,
          
          -- Warehouse stats
          (SELECT COUNT(*) FROM warehouses WHERE user_id = $1) as total_warehouses,
          (SELECT COUNT(*) FROM warehouses WHERE user_id = $1 AND status = 'active') as active_warehouses,
          (SELECT COALESCE(SUM(capacity), 0) FROM warehouses WHERE user_id = $1) as total_capacity,
          (SELECT COALESCE(SUM(occupied), 0) FROM warehouses WHERE user_id = $1) as total_occupied
      `, [user_id]),

      // Recent orders
      pool.query(`
        SELECT 
          o.id,
          o.order_number,
          o.status,
          o.payment_status,
          o.total_amount,
          o.created_at,
          c.name as customer_name,
          c.email as customer_email,
          (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC
        LIMIT 10
      `, [user_id]),

      // Revenue chart (7 days)
      pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as order_count,
          COALESCE(SUM(total_amount), 0) as revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value
        FROM orders
        WHERE user_id = $1 
          AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `, [user_id]),

      // Top customers
      pool.query(`
        SELECT 
          c.id,
          c.name,
          c.email,
          c.phone,
          c.business_name,
          c.segment,
          c.total_orders,
          c.total_revenue,
          c.created_at
        FROM customers c
        WHERE c.user_id = $1
        ORDER BY c.total_revenue DESC, c.total_orders DESC
        LIMIT 5
      `, [user_id])
    ]);

    const stats = statsResult.rows[0];
    
    // Calculate utilization rate
    const utilizationRate = stats.total_capacity > 0 
      ? ((stats.total_occupied / stats.total_capacity) * 100).toFixed(2)
      : 0;

    // Format response to match frontend expectations
    const dashboardData = {
      stats: {
        orders: {
          total: parseInt(stats.total_orders),
          pending: parseInt(stats.pending_orders),
          delivered: parseInt(stats.delivered_orders),
          total_revenue: parseFloat(stats.total_revenue),
          delivered_revenue: parseFloat(stats.delivered_revenue),
          average_order_value: parseFloat(stats.average_order_value)
        },
        customers: {
          total: parseInt(stats.total_customers),
          premium: parseInt(stats.premium_customers),
          new: parseInt(stats.new_customers)
        },
        products: {
          total: parseInt(stats.total_products),
          active: parseInt(stats.active_products),
          low_stock: parseInt(stats.low_stock_products),
          inventory_value: parseFloat(stats.inventory_value)
        },
        warehouses: {
          total: parseInt(stats.total_warehouses),
          active: parseInt(stats.active_warehouses),
          total_capacity: parseInt(stats.total_capacity),
          total_occupied: parseInt(stats.total_occupied),
          utilization_rate: parseFloat(utilizationRate)
        }
      },
      recent_orders: recentOrdersResult.rows,
      revenue_chart: {
        period: '7days',
        data: revenueChartResult.rows
      },
      top_products: topCustomersResult.rows // Note: Currently using customers, can be changed to products if needed
    };

    // Set cache control headers
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};
