import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get all orders with filtering and pagination
 * @route GET /api/orders
 * @access Private
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      payment_status,
      customer_id,
      search,
      sortBy = 'created_at',
      order = 'DESC'
    } = req.query;

    // MOCK_DB mode - return mock orders
    if (process.env.MOCK_DB === 'true') {
      const mockOrders = [
        {
          id: 1,
          order_number: 'ORD-2025-001',
          customer_id: 1,
          customer_name: 'Acme Corp',
          customer_email: 'contact@acme.com',
          customer_phone: '+91 98765 43210',
          status: 'processing',
          payment_status: 'paid',
          total_amount: 45600,
          shipping_address: '123 Business Park, Mumbai, Maharashtra 400001',
          notes: 'Urgent delivery required',
          created_at: '2025-10-20T10:30:00Z',
          updated_at: '2025-10-20T14:20:00Z',
          delivered_at: null,
          item_count: 5
        },
        {
          id: 2,
          order_number: 'ORD-2025-002',
          customer_id: 2,
          customer_name: 'TechHub Solutions',
          customer_email: 'info@techhub.com',
          customer_phone: '+91 98765 43211',
          status: 'pending',
          payment_status: 'pending',
          total_amount: 78900,
          shipping_address: '456 Tech Street, Bangalore, Karnataka 560001',
          notes: 'Standard delivery',
          created_at: '2025-10-19T09:15:00Z',
          updated_at: '2025-10-19T09:15:00Z',
          delivered_at: null,
          item_count: 3
        },
        {
          id: 3,
          order_number: 'ORD-2025-003',
          customer_id: 3,
          customer_name: 'Global Industries',
          customer_email: 'orders@global.com',
          customer_phone: '+91 98765 43212',
          status: 'delivered',
          payment_status: 'paid',
          total_amount: 123400,
          shipping_address: '789 Industrial Area, Delhi, Delhi 110001',
          notes: 'Delivered successfully',
          created_at: '2025-10-18T08:00:00Z',
          updated_at: '2025-10-21T16:30:00Z',
          delivered_at: '2025-10-21T16:30:00Z',
          item_count: 8
        },
        {
          id: 4,
          order_number: 'ORD-2025-004',
          customer_id: 4,
          customer_name: 'Metro Supplies',
          customer_email: 'sales@metro.com',
          customer_phone: '+91 98765 43213',
          status: 'completed',
          payment_status: 'paid',
          total_amount: 34200,
          shipping_address: '321 Metro Plaza, Pune, Maharashtra 411001',
          notes: 'Order completed',
          created_at: '2025-10-17T11:45:00Z',
          updated_at: '2025-10-20T10:00:00Z',
          delivered_at: '2025-10-19T14:20:00Z',
          item_count: 4
        },
        {
          id: 5,
          order_number: 'ORD-2025-005',
          customer_id: 5,
          customer_name: 'Prime Logistics',
          customer_email: 'contact@prime.com',
          customer_phone: '+91 98765 43214',
          status: 'processing',
          payment_status: 'paid',
          total_amount: 56700,
          shipping_address: '654 Logistics Hub, Hyderabad, Telangana 500001',
          notes: 'In transit',
          created_at: '2025-10-16T14:30:00Z',
          updated_at: '2025-10-18T09:15:00Z',
          delivered_at: null,
          item_count: 6
        },
        {
          id: 6,
          order_number: 'ORD-2025-006',
          customer_id: 1,
          customer_name: 'Acme Corp',
          customer_email: 'contact@acme.com',
          customer_phone: '+91 98765 43210',
          status: 'pending',
          payment_status: 'pending',
          total_amount: 28900,
          shipping_address: '123 Business Park, Mumbai, Maharashtra 400001',
          notes: 'Awaiting payment confirmation',
          created_at: '2025-10-15T16:00:00Z',
          updated_at: '2025-10-15T16:00:00Z',
          delivered_at: null,
          item_count: 2
        },
        {
          id: 7,
          order_number: 'ORD-2025-007',
          customer_id: 3,
          customer_name: 'Global Industries',
          customer_email: 'orders@global.com',
          customer_phone: '+91 98765 43212',
          status: 'shipped',
          payment_status: 'paid',
          total_amount: 95600,
          shipping_address: '789 Industrial Area, Delhi, Delhi 110001',
          notes: 'Out for delivery',
          created_at: '2025-10-14T10:20:00Z',
          updated_at: '2025-10-21T08:45:00Z',
          delivered_at: null,
          item_count: 7
        }
      ];

      // Apply filters
      let filteredOrders = [...mockOrders];

      if (status) {
        filteredOrders = filteredOrders.filter(o => o.status === status);
      }

      if (payment_status) {
        filteredOrders = filteredOrders.filter(o => o.payment_status === payment_status);
      }

      if (customer_id) {
        filteredOrders = filteredOrders.filter(o => o.customer_id === parseInt(customer_id));
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredOrders = filteredOrders.filter(o => 
          o.order_number.toLowerCase().includes(searchLower) ||
          o.customer_name.toLowerCase().includes(searchLower) ||
          o.customer_email.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      filteredOrders.sort((a, b) => {
        const sortField = sortBy === 'created_at' ? 'created_at' : sortBy;
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (order === 'ASC') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Apply pagination
      const offset = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(offset, offset + parseInt(limit));

      // Set cache control headers to prevent stale data
      res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      });

      return res.json({
        success: true,
        data: {
          orders: paginatedOrders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredOrders.length,
            totalItems: filteredOrders.length,
            totalPages: Math.ceil(filteredOrders.length / limit)
          }
        }
      });
    }

    const offset = (page - 1) * limit;
    const user_id = req.user.id;

    // Build WHERE clause
    let whereConditions = ['o.user_id = $1'];
    let queryParams = [user_id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      whereConditions.push(`o.status = $${paramCount}`);
      queryParams.push(status);
    }

    if (payment_status) {
      paramCount++;
      whereConditions.push(`o.payment_status = $${paramCount}`);
      queryParams.push(payment_status);
    }

    if (customer_id) {
      paramCount++;
      whereConditions.push(`o.customer_id = $${paramCount}`);
      queryParams.push(customer_id);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(
        o.order_number ILIKE $${paramCount} OR 
        c.name ILIKE $${paramCount} OR
        c.email ILIKE $${paramCount}
      )`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Validate sortBy
    const validSortFields = ['order_number', 'status', 'total_amount', 'created_at', 'delivered_at'];
    const sortField = validSortFields.includes(sortBy) ? `o.${sortBy}` : 'o.created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count);

    // Get orders
    const ordersQuery = `
      SELECT 
        o.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        (
          SELECT COUNT(*) 
          FROM order_items oi 
          WHERE oi.order_id = o.id
        ) as item_count
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await pool.query(ordersQuery, queryParams);

    // Set cache control headers to prevent stale data
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    res.json({
      success: true,
      data: {
        orders: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalItems,
          totalItems,
          totalPages: Math.ceil(totalItems / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single order by ID with items
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get order details
    const orderQuery = `
      SELECT 
        o.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.business_name as customer_business_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = $1 AND o.user_id = $2
    `;

    const orderResult = await pool.query(orderQuery, [id, user_id]);

    if (orderResult.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsQuery = `
      SELECT 
        oi.*,
        p.name as current_product_name,
        p.stock as current_stock
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `;

    const itemsResult = await pool.query(itemsQuery, [id]);

    res.json({
      success: true,
      data: {
        ...order,
        items: itemsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new order with items
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      customer_id,
      items, // Array of { product_id, quantity, unit_price }
      shipping_street,
      shipping_city,
      shipping_state,
      shipping_pincode,
      notes
    } = req.body;

    const user_id = req.user.id;

    // Verify customer exists
    const customerCheck = await client.query(
      'SELECT id FROM customers WHERE id = $1 AND user_id = $2',
      [customer_id, user_id]
    );

    if (customerCheck.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    // Validate items array
    if (!items || items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    // Calculate totals and verify stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const { product_id, quantity, unit_price } = item;

      // Get product details and verify stock
      const productResult = await client.query(
        'SELECT id, name, sku, price, stock FROM products WHERE id = $1 AND user_id = $2',
        [product_id, user_id]
      );

      if (productResult.rows.length === 0) {
        throw new AppError(`Product with ID ${product_id} not found`, 404);
      }

      const product = productResult.rows[0];

      if (product.stock < quantity) {
        throw new AppError(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`,
          400
        );
      }

      const price = unit_price || product.price;
      const total = price * quantity;
      subtotal += total;

      validatedItems.push({
        product_id,
        product_name: product.name,
        product_sku: product.sku,
        quantity,
        unit_price: price,
        total_price: total
      });
    }

    // Calculate tax and total (18% GST)
    const tax_amount = subtotal * 0.18;
    const total_amount = subtotal + tax_amount;

    // Generate order number
    const orderNumberResult = await client.query('SELECT generate_order_number()');
    const order_number = orderNumberResult.rows[0].generate_order_number;

    // Create order
    const orderQuery = `
      INSERT INTO orders (
        user_id, customer_id, order_number,
        subtotal, tax_amount, total_amount,
        shipping_street, shipping_city, shipping_state, shipping_pincode,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const orderValues = [
      user_id, customer_id, order_number,
      subtotal, tax_amount, total_amount,
      shipping_street, shipping_city, shipping_state, shipping_pincode,
      notes
    ];

    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];

    // Create order items
    for (const item of validatedItems) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, product_name, product_sku,
          quantity, unit_price, total_price
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          item.product_id,
          item.product_name,
          item.product_sku,
          item.quantity,
          item.unit_price,
          item.total_price
        ]
      );

      // Reduce product stock (trigger will handle this, but we can do it explicitly too)
      // The database trigger reduce_product_stock will handle stock reduction
    }

    await client.query('COMMIT');

    // Fetch complete order with items
    const completeOrder = await pool.query(
      `SELECT 
        o.*,
        c.name as customer_name,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'product_sku', oi.product_sku,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price
          )
        ) as items
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1
       GROUP BY o.id, c.name`,
      [order.id]
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: completeOrder.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Update order status
 * @route PUT /api/orders/:id/status
 * @access Private
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;
    const user_id = req.user.id;

    // Check if order exists
    const existingOrder = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existingOrder.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (payment_status !== undefined) {
      updates.push(`payment_status = $${paramCount++}`);
      values.push(payment_status);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(id, user_id);

    const query = `
      UPDATE orders
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order details
 * @route PUT /api/orders/:id
 * @access Private
 */
export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if order exists
    const existingOrder = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existingOrder.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    // Only allow updates for pending/confirmed orders
    if (!['pending', 'confirmed'].includes(existingOrder.rows[0].status)) {
      throw new AppError('Cannot update order in current status', 400);
    }

    const {
      shipping_street,
      shipping_city,
      shipping_state,
      shipping_pincode,
      notes
    } = req.body;

    // Build update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (shipping_street !== undefined) {
      updates.push(`shipping_street = $${paramCount++}`);
      values.push(shipping_street);
    }
    if (shipping_city !== undefined) {
      updates.push(`shipping_city = $${paramCount++}`);
      values.push(shipping_city);
    }
    if (shipping_state !== undefined) {
      updates.push(`shipping_state = $${paramCount++}`);
      values.push(shipping_state);
    }
    if (shipping_pincode !== undefined) {
      updates.push(`shipping_pincode = $${paramCount++}`);
      values.push(shipping_pincode);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(id, user_id);

    const query = `
      UPDATE orders
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete order
 * @route DELETE /api/orders/:id
 * @access Private
 */
export const deleteOrder = async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const user_id = req.user.id;

    // Get order details
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (orderResult.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    const order = orderResult.rows[0];

    // Only allow deletion of pending/cancelled orders
    if (!['pending', 'cancelled'].includes(order.status)) {
      throw new AppError('Cannot delete order in current status', 400);
    }

    // Get order items to restore stock
    const itemsResult = await client.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
      [id]
    );

    // Restore stock for each item
    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE products SET stock = stock + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Delete order (items will be cascade deleted)
    await client.query('DELETE FROM orders WHERE id = $1', [id]);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Get order statistics
 * @route GET /api/orders/stats
 * @access Private
 */
export const getOrderStats = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // MOCK_DB mode - return mock stats
    if (process.env.MOCK_DB === 'true') {
      // Set cache control headers
      res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      return res.json({
        success: true,
        data: {
          total_orders: '7',
          pending_orders: '2',
          confirmed_orders: '0',
          processing_orders: '2',
          shipped_orders: '1',
          delivered_orders: '1',
          cancelled_orders: '0',
          total_revenue: '463300',
          average_order_value: '66185.71'
        }
      });
    }

    const query = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM orders
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [user_id]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
