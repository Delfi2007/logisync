import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get all products with filtering, search, and pagination
 * @route GET /api/products
 * @access Private
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      search,
      sortBy = 'created_at',
      order = 'DESC'
    } = req.query;

    // MOCK_DB mode - return mock products
    if (process.env.MOCK_DB === 'true') {
      const mockProducts = [
        { id: 1, name: 'Laptop - Dell XPS 15', sku: 'DELL-XPS-15', category: 'Electronics', description: 'High-performance laptop', price: 125000, cost: 95000, stock: 15, reorder_level: 5, supplier: 'Dell India', status: 'active', needs_reorder: false, created_at: '2024-01-15T10:00:00Z' },
        { id: 2, name: 'Office Chair - Ergonomic', sku: 'CHAIR-ERG-01', category: 'Furniture', description: 'Comfortable office chair', price: 15000, cost: 9000, stock: 25, reorder_level: 10, supplier: 'Office Pro', status: 'active', needs_reorder: false, created_at: '2024-02-01T10:00:00Z' },
        { id: 3, name: 'Wireless Mouse', sku: 'MOUSE-WL-02', category: 'Electronics', description: 'Bluetooth mouse', price: 1200, cost: 600, stock: 3, reorder_level: 10, supplier: 'Tech Supplies', status: 'active', needs_reorder: true, created_at: '2024-02-10T10:00:00Z' },
        { id: 4, name: 'Standing Desk', sku: 'DESK-STD-01', category: 'Furniture', description: 'Adjustable height desk', price: 35000, cost: 22000, stock: 8, reorder_level: 3, supplier: 'Office Pro', status: 'active', needs_reorder: false, created_at: '2024-03-01T10:00:00Z' },
        { id: 5, name: 'Monitor - 27 inch 4K', sku: 'MON-4K-27', category: 'Electronics', description: '4K UHD monitor', price: 32000, cost: 24000, stock: 12, reorder_level: 5, supplier: 'Tech Supplies', status: 'active', needs_reorder: false, created_at: '2024-03-15T10:00:00Z' }
      ];

      let filtered = [...mockProducts];
      if (category) filtered = filtered.filter(p => p.category === category);
      if (status) filtered = filtered.filter(p => p.status === status);
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(s) || 
          p.sku.toLowerCase().includes(s) || 
          p.description.toLowerCase().includes(s)
        );
      }

      const offset = (page - 1) * limit;
      const paginated = filtered.slice(offset, offset + parseInt(limit));

      res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      return res.json({
        success: true,
        data: {
          products: paginated,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalItems: filtered.length,
            totalPages: Math.ceil(filtered.length / limit)
          }
        }
      });
    }

    const offset = (page - 1) * limit;
    const user_id = req.user.id;

    // Build WHERE clause
    let whereConditions = ['user_id = $1'];
    let queryParams = [user_id];
    let paramCount = 1;

    if (category) {
      paramCount++;
      whereConditions.push(`category = $${paramCount}`);
      queryParams.push(category);
    }

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(
        name ILIKE $${paramCount} OR 
        sku ILIKE $${paramCount} OR 
        description ILIKE $${paramCount}
      )`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Validate sortBy to prevent SQL injection
    const validSortFields = ['name', 'sku', 'price', 'stock', 'created_at', 'category'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM products WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count);

    // Get products
    const productsQuery = `
      SELECT 
        id, user_id, name, sku, category, description,
        price, cost, stock, reorder_level, supplier, status,
        created_at, updated_at,
        CASE 
          WHEN stock <= reorder_level THEN true 
          ELSE false 
        END as needs_reorder
      FROM products
      WHERE ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    queryParams.push(limit, offset);
    const result = await pool.query(productsQuery, queryParams);

    res.json({
      success: true,
      data: {
        products: result.rows,
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
 * Get single product by ID
 * @route GET /api/products/:id
 * @access Private
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const query = `
      SELECT 
        id, user_id, name, sku, category, description,
        price, cost, stock, reorder_level, supplier, status,
        created_at, updated_at,
        CASE 
          WHEN stock <= reorder_level THEN true 
          ELSE false 
        END as needs_reorder,
        ROUND((price - cost) / NULLIF(cost, 0) * 100, 2) as margin_percentage
      FROM products
      WHERE id = $1 AND user_id = $2
    `;

    const result = await pool.query(query, [id, user_id]);

    if (result.rows.length === 0) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product
 * @route POST /api/products
 * @access Private
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      category,
      description,
      price,
      cost,
      stock = 0,
      reorder_level = 10,
      supplier
    } = req.body;

    const user_id = req.user.id;

    // Check if SKU already exists for this user
    const skuCheck = await pool.query(
      'SELECT id FROM products WHERE sku = $1 AND user_id = $2',
      [sku, user_id]
    );

    if (skuCheck.rows.length > 0) {
      throw new AppError('Product with this SKU already exists', 400);
    }

    const query = `
      INSERT INTO products (
        user_id, name, sku, category, description,
        price, cost, stock, reorder_level, supplier
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      user_id, name, sku, category, description,
      price, cost, stock, reorder_level, supplier
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 * @route PUT /api/products/:id
 * @access Private
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if product exists and belongs to user
    const existingProduct = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existingProduct.rows.length === 0) {
      throw new AppError('Product not found', 404);
    }

    const {
      name,
      sku,
      category,
      description,
      price,
      cost,
      stock,
      reorder_level,
      supplier,
      status
    } = req.body;

    // If SKU is being changed, check uniqueness
    if (sku && sku !== existingProduct.rows[0].sku) {
      const skuCheck = await pool.query(
        'SELECT id FROM products WHERE sku = $1 AND user_id = $2 AND id != $3',
        [sku, user_id, id]
      );

      if (skuCheck.rows.length > 0) {
        throw new AppError('Product with this SKU already exists', 400);
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
    if (sku !== undefined) {
      updates.push(`sku = $${paramCount++}`);
      values.push(sku);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      values.push(category);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(price);
    }
    if (cost !== undefined) {
      updates.push(`cost = $${paramCount++}`);
      values.push(cost);
    }
    if (stock !== undefined) {
      updates.push(`stock = $${paramCount++}`);
      values.push(stock);
    }
    if (reorder_level !== undefined) {
      updates.push(`reorder_level = $${paramCount++}`);
      values.push(reorder_level);
    }
    if (supplier !== undefined) {
      updates.push(`supplier = $${paramCount++}`);
      values.push(supplier);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(id, user_id);

    const query = `
      UPDATE products
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * @route DELETE /api/products/:id
 * @access Private
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if product exists and belongs to user
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get products with low stock
 * @route GET /api/products/alerts/low-stock
 * @access Private
 */
export const getLowStockProducts = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        id, name, sku, category, stock, reorder_level,
        (reorder_level - stock) as shortage_quantity,
        supplier
      FROM products
      WHERE user_id = $1 
        AND stock <= reorder_level
        AND status = 'active'
      ORDER BY (reorder_level - stock) DESC
    `;

    const result = await pool.query(query, [user_id]);

    res.json({
      success: true,
      data: {
        products: result.rows,
        count: result.rows.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product categories
 * @route GET /api/products/categories
 * @access Private
 */
export const getCategories = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        category,
        COUNT(*) as product_count,
        SUM(stock * price) as inventory_value
      FROM products
      WHERE user_id = $1 AND category IS NOT NULL
      GROUP BY category
      ORDER BY category
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
 * Update product stock
 * @route PATCH /api/products/:id/stock
 * @access Private
 */
export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustment, type = 'adjustment', reference } = req.body;
    const user_id = req.user.id;

    if (!adjustment || adjustment === 0) {
      throw new AppError('Stock adjustment value is required', 400);
    }

    // Get current product
    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (productResult.rows.length === 0) {
      throw new AppError('Product not found', 404);
    }

    const product = productResult.rows[0];
    const newStock = product.stock + adjustment;

    if (newStock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }

    // Update stock
    const updateQuery = `
      UPDATE products
      SET stock = $1
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [newStock, id, user_id]);

    // Record stock movement if stock_movements table exists
    try {
      await pool.query(
        `INSERT INTO stock_movements (product_id, type, quantity, reference, created_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, type, Math.abs(adjustment), reference || 'Manual adjustment', user_id]
      );
    } catch (err) {
      // Ignore if stock_movements table doesn't exist yet
      console.log('Stock movement not recorded:', err.message);
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        product: result.rows[0],
        adjustment,
        previous_stock: product.stock,
        new_stock: newStock
      }
    });
  } catch (error) {
    next(error);
  }
};
