import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get all customers with filtering and pagination
 * @route GET /api/customers
 * @access Private
 */
export const getAllCustomers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      segment,
      search,
      sortBy = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const user_id = req.user.id;

    // Build WHERE clause
    let whereConditions = ['c.user_id = $1'];
    let queryParams = [user_id];
    let paramCount = 1;

    if (segment) {
      paramCount++;
      whereConditions.push(`c.segment = $${paramCount}`);
      queryParams.push(segment);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(
        c.name ILIKE $${paramCount} OR 
        c.email ILIKE $${paramCount} OR 
        c.phone ILIKE $${paramCount} OR
        c.business_name ILIKE $${paramCount}
      )`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Validate sortBy
    const validSortFields = ['name', 'email', 'segment', 'total_orders', 'total_revenue', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM customers c WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count);

    // Get customers
    const customersQuery = `
      SELECT 
        c.*,
        COUNT(DISTINCT ca.id) as address_count,
        COUNT(DISTINCT o.id) as order_count
      FROM customers c
      LEFT JOIN customer_addresses ca ON c.id = ca.customer_id
      LEFT JOIN orders o ON c.id = o.customer_id
      WHERE ${whereClause}
      GROUP BY c.id
      ORDER BY c.${sortField} ${sortOrder}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await pool.query(customersQuery, queryParams);

    res.json({
      success: true,
      data: {
        customers: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
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
 * Get single customer by ID with addresses
 * @route GET /api/customers/:id
 * @access Private
 */
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get customer details
    const customerQuery = `
      SELECT * FROM customers
      WHERE id = $1 AND user_id = $2
    `;

    const customerResult = await pool.query(customerQuery, [id, user_id]);

    if (customerResult.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    const customer = customerResult.rows[0];

    // Get customer addresses
    const addressesQuery = `
      SELECT * FROM customer_addresses
      WHERE customer_id = $1
      ORDER BY is_default DESC, type, created_at DESC
    `;

    const addressesResult = await pool.query(addressesQuery, [id]);

    // Get recent orders
    const ordersQuery = `
      SELECT 
        id, order_number, status, payment_status,
        total_amount, created_at
      FROM orders
      WHERE customer_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const ordersResult = await pool.query(ordersQuery, [id]);

    res.json({
      success: true,
      data: {
        ...customer,
        addresses: addressesResult.rows,
        recent_orders: ordersResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new customer
 * @route POST /api/customers
 * @access Private
 */
export const createCustomer = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      name,
      email,
      phone,
      business_name,
      gst_number,
      address
    } = req.body;

    const user_id = req.user.id;

    // Check if email already exists for this user
    const emailCheck = await client.query(
      'SELECT id FROM customers WHERE email = $1 AND user_id = $2',
      [email, user_id]
    );

    if (emailCheck.rows.length > 0) {
      throw new AppError('Customer with this email already exists', 400);
    }

    // Create customer
    const customerQuery = `
      INSERT INTO customers (
        user_id, name, email, phone, business_name, gst_number
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const customerValues = [user_id, name, email, phone, business_name, gst_number];
    const customerResult = await client.query(customerQuery, customerValues);
    const customer = customerResult.rows[0];

    // Add address if provided
    if (address) {
      const addressQuery = `
        INSERT INTO customer_addresses (
          customer_id, type, street, city, state, pincode, is_default
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const addressValues = [
        customer.id,
        address.type || 'billing',
        address.street,
        address.city,
        address.state,
        address.pincode,
        true
      ];

      await client.query(addressQuery, addressValues);
    }

    await client.query('COMMIT');

    // Fetch complete customer with addresses
    const completeCustomer = await pool.query(
      `SELECT c.*, 
        json_agg(ca.*) FILTER (WHERE ca.id IS NOT NULL) as addresses
       FROM customers c
       LEFT JOIN customer_addresses ca ON c.id = ca.customer_id
       WHERE c.id = $1
       GROUP BY c.id`,
      [customer.id]
    );

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: completeCustomer.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Update customer
 * @route PUT /api/customers/:id
 * @access Private
 */
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if customer exists
    const existingCustomer = await pool.query(
      'SELECT * FROM customers WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existingCustomer.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    const { name, email, phone, business_name, gst_number, segment } = req.body;

    // If email is being changed, check uniqueness
    if (email && email !== existingCustomer.rows[0].email) {
      const emailCheck = await pool.query(
        'SELECT id FROM customers WHERE email = $1 AND user_id = $2 AND id != $3',
        [email, user_id, id]
      );

      if (emailCheck.rows.length > 0) {
        throw new AppError('Customer with this email already exists', 400);
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (business_name !== undefined) {
      updates.push(`business_name = $${paramCount++}`);
      values.push(business_name);
    }
    if (gst_number !== undefined) {
      updates.push(`gst_number = $${paramCount++}`);
      values.push(gst_number);
    }
    if (segment !== undefined) {
      updates.push(`segment = $${paramCount++}`);
      values.push(segment);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(id, user_id);

    const query = `
      UPDATE customers
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete customer
 * @route DELETE /api/customers/:id
 * @access Private
 */
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if customer has orders
    const ordersCheck = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE customer_id = $1',
      [id]
    );

    if (parseInt(ordersCheck.rows[0].count) > 0) {
      throw new AppError('Cannot delete customer with existing orders', 400);
    }

    // Delete customer (addresses will be cascade deleted)
    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add customer address
 * @route POST /api/customers/:id/addresses
 * @access Private
 */
export const addCustomerAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, street, city, state, pincode, is_default } = req.body;
    const user_id = req.user.id;

    // Verify customer exists and belongs to user
    const customerCheck = await pool.query(
      'SELECT id FROM customers WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (customerCheck.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    const query = `
      INSERT INTO customer_addresses (
        customer_id, type, street, city, state, pincode, is_default
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [id, type, street, city, state, pincode, is_default || false];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update customer address
 * @route PUT /api/customers/:id/addresses/:addressId
 * @access Private
 */
export const updateCustomerAddress = async (req, res, next) => {
  try {
    const { id, addressId } = req.params;
    const user_id = req.user.id;

    // Verify customer exists and belongs to user
    const customerCheck = await pool.query(
      'SELECT id FROM customers WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (customerCheck.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    const { type, street, city, state, pincode, is_default } = req.body;

    // Build update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (type !== undefined) {
      updates.push(`type = $${paramCount++}`);
      values.push(type);
    }
    if (street !== undefined) {
      updates.push(`street = $${paramCount++}`);
      values.push(street);
    }
    if (city !== undefined) {
      updates.push(`city = $${paramCount++}`);
      values.push(city);
    }
    if (state !== undefined) {
      updates.push(`state = $${paramCount++}`);
      values.push(state);
    }
    if (pincode !== undefined) {
      updates.push(`pincode = $${paramCount++}`);
      values.push(pincode);
    }
    if (is_default !== undefined) {
      updates.push(`is_default = $${paramCount++}`);
      values.push(is_default);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(addressId, id);

    const query = `
      UPDATE customer_addresses
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND customer_id = $${paramCount++}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new AppError('Address not found', 404);
    }

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete customer address
 * @route DELETE /api/customers/:id/addresses/:addressId
 * @access Private
 */
export const deleteCustomerAddress = async (req, res, next) => {
  try {
    const { id, addressId } = req.params;
    const user_id = req.user.id;

    // Verify customer exists and belongs to user
    const customerCheck = await pool.query(
      'SELECT id FROM customers WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (customerCheck.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    const result = await pool.query(
      'DELETE FROM customer_addresses WHERE id = $1 AND customer_id = $2 RETURNING id',
      [addressId, id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Address not found', 404);
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

