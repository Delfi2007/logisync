import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateDistance, pincodeToCoordinates } from '../utils/distance.js';

/**
 * Get all warehouses with filtering and pagination
 * @route GET /api/warehouses
 * @access Private
 */
export const getAllWarehouses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      is_verified,
      search,
      sortBy = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const user_id = req.user.id;

    // Build WHERE clause
    let whereConditions = ['user_id = $1'];
    let queryParams = [user_id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    if (is_verified !== undefined) {
      paramCount++;
      whereConditions.push(`is_verified = $${paramCount}`);
      queryParams.push(is_verified === 'true');
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(
        name ILIKE $${paramCount} OR 
        code ILIKE $${paramCount} OR 
        city ILIKE $${paramCount} OR
        state ILIKE $${paramCount}
      )`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Validate sortBy
    const validSortFields = ['name', 'code', 'city', 'capacity', 'occupied', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM warehouses WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count);

    // Get warehouses with utilization
    const warehousesQuery = `
      SELECT 
        w.*,
        CASE 
          WHEN w.capacity > 0 THEN ROUND((w.occupied::DECIMAL / w.capacity::DECIMAL) * 100, 2)
          ELSE 0
        END as utilization_percentage,
        (w.capacity - w.occupied) as available_space,
        (
          SELECT COUNT(*) 
          FROM warehouse_amenities wa 
          WHERE wa.warehouse_id = w.id
        ) as amenities_count
      FROM warehouses w
      WHERE ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await pool.query(warehousesQuery, queryParams);

    res.json({
      success: true,
      data: {
        warehouses: result.rows,
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
 * Get single warehouse by ID with amenities
 * @route GET /api/warehouses/:id
 * @access Private
 */
export const getWarehouseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get warehouse details
    const warehouseQuery = `
      SELECT 
        w.*,
        CASE 
          WHEN w.capacity > 0 THEN ROUND((w.occupied::DECIMAL / w.capacity::DECIMAL) * 100, 2)
          ELSE 0
        END as utilization_percentage,
        (w.capacity - w.occupied) as available_space
      FROM warehouses w
      WHERE w.id = $1 AND w.user_id = $2
    `;

    const warehouseResult = await pool.query(warehouseQuery, [id, user_id]);

    if (warehouseResult.rows.length === 0) {
      throw new AppError('Warehouse not found', 404);
    }

    const warehouse = warehouseResult.rows[0];

    // Get amenities
    const amenitiesQuery = `
      SELECT amenity 
      FROM warehouse_amenities
      WHERE warehouse_id = $1
      ORDER BY amenity
    `;

    const amenitiesResult = await pool.query(amenitiesQuery, [id]);

    res.json({
      success: true,
      data: {
        ...warehouse,
        amenities: amenitiesResult.rows.map(row => row.amenity)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new warehouse
 * @route POST /api/warehouses
 * @access Private
 */
export const createWarehouse = async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      name,
      code,
      street,
      city,
      state,
      pincode,
      latitude,
      longitude,
      capacity,
      occupied = 0,
      contact_person,
      contact_phone,
      cost_per_sqft,
      amenities = []
    } = req.body;

    const user_id = req.user.id;

    // Check if code already exists
    const codeCheck = await client.query(
      'SELECT id FROM warehouses WHERE code = $1 AND user_id = $2',
      [code, user_id]
    );

    if (codeCheck.rows.length > 0) {
      throw new AppError('Warehouse with this code already exists', 400);
    }

    // Create warehouse
    const warehouseQuery = `
      INSERT INTO warehouses (
        user_id, name, code, street, city, state, pincode,
        latitude, longitude, capacity, occupied,
        contact_person, contact_phone, cost_per_sqft
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const warehouseValues = [
      user_id, name, code, street, city, state, pincode,
      latitude, longitude, capacity, occupied,
      contact_person, contact_phone, cost_per_sqft
    ];

    const warehouseResult = await client.query(warehouseQuery, warehouseValues);
    const warehouse = warehouseResult.rows[0];

    // Add amenities if provided
    if (amenities && amenities.length > 0) {
      for (const amenity of amenities) {
        await client.query(
          'INSERT INTO warehouse_amenities (warehouse_id, amenity) VALUES ($1, $2)',
          [warehouse.id, amenity]
        );
      }
    }

    await client.query('COMMIT');

    // Fetch complete warehouse with amenities
    const completeWarehouse = await pool.query(
      `SELECT 
        w.*,
        CASE 
          WHEN w.capacity > 0 THEN ROUND((w.occupied::DECIMAL / w.capacity::DECIMAL) * 100, 2)
          ELSE 0
        END as utilization_percentage,
        json_agg(wa.amenity) FILTER (WHERE wa.amenity IS NOT NULL) as amenities
       FROM warehouses w
       LEFT JOIN warehouse_amenities wa ON w.id = wa.warehouse_id
       WHERE w.id = $1
       GROUP BY w.id`,
      [warehouse.id]
    );

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: completeWarehouse.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Update warehouse
 * @route PUT /api/warehouses/:id
 * @access Private
 */
export const updateWarehouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if warehouse exists
    const existingWarehouse = await pool.query(
      'SELECT * FROM warehouses WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existingWarehouse.rows.length === 0) {
      throw new AppError('Warehouse not found', 404);
    }

    const {
      name, code, street, city, state, pincode,
      latitude, longitude, capacity, occupied,
      status, is_verified,
      contact_person, contact_phone, cost_per_sqft
    } = req.body;

    // If code is being changed, check uniqueness
    if (code && code !== existingWarehouse.rows[0].code) {
      const codeCheck = await pool.query(
        'SELECT id FROM warehouses WHERE code = $1 AND user_id = $2 AND id != $3',
        [code, user_id, id]
      );

      if (codeCheck.rows.length > 0) {
        throw new AppError('Warehouse with this code already exists', 400);
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) { updates.push(`name = $${paramCount++}`); values.push(name); }
    if (code !== undefined) { updates.push(`code = $${paramCount++}`); values.push(code); }
    if (street !== undefined) { updates.push(`street = $${paramCount++}`); values.push(street); }
    if (city !== undefined) { updates.push(`city = $${paramCount++}`); values.push(city); }
    if (state !== undefined) { updates.push(`state = $${paramCount++}`); values.push(state); }
    if (pincode !== undefined) { updates.push(`pincode = $${paramCount++}`); values.push(pincode); }
    if (latitude !== undefined) { updates.push(`latitude = $${paramCount++}`); values.push(latitude); }
    if (longitude !== undefined) { updates.push(`longitude = $${paramCount++}`); values.push(longitude); }
    if (capacity !== undefined) { updates.push(`capacity = $${paramCount++}`); values.push(capacity); }
    if (occupied !== undefined) { updates.push(`occupied = $${paramCount++}`); values.push(occupied); }
    if (status !== undefined) { updates.push(`status = $${paramCount++}`); values.push(status); }
    if (is_verified !== undefined) { updates.push(`is_verified = $${paramCount++}`); values.push(is_verified); }
    if (contact_person !== undefined) { updates.push(`contact_person = $${paramCount++}`); values.push(contact_person); }
    if (contact_phone !== undefined) { updates.push(`contact_phone = $${paramCount++}`); values.push(contact_phone); }
    if (cost_per_sqft !== undefined) { updates.push(`cost_per_sqft = $${paramCount++}`); values.push(cost_per_sqft); }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(id, user_id);

    const query = `
      UPDATE warehouses
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Warehouse updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete warehouse
 * @route DELETE /api/warehouses/:id
 * @access Private
 */
export const deleteWarehouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Delete warehouse (amenities will be cascade deleted)
    const result = await pool.query(
      'DELETE FROM warehouses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Warehouse not found', 404);
    }

    res.json({
      success: true,
      message: 'Warehouse deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Find nearby warehouses by pincode
 * @route GET /api/warehouses/nearby
 * @access Private
 */
export const getNearbyWarehouses = async (req, res, next) => {
  try {
    const { pincode, radius = 100 } = req.query;
    const user_id = req.user.id;

    if (!pincode) {
      throw new AppError('Pincode is required', 400);
    }

    // Get coordinates for the pincode
    const targetCoords = pincodeToCoordinates(pincode);

    // Get all active warehouses
    const warehousesQuery = `
      SELECT 
        id, name, code, city, state, pincode,
        latitude, longitude, capacity, occupied,
        contact_person, contact_phone, status, is_verified,
        CASE 
          WHEN capacity > 0 THEN ROUND((occupied::DECIMAL / capacity::DECIMAL) * 100, 2)
          ELSE 0
        END as utilization_percentage
      FROM warehouses
      WHERE user_id = $1 AND status = 'active'
      ORDER BY city
    `;

    const result = await pool.query(warehousesQuery, [user_id]);

    // Calculate distances and filter by radius
    const warehousesWithDistance = result.rows
      .map(warehouse => {
        const distance = calculateDistance(
          targetCoords.latitude,
          targetCoords.longitude,
          warehouse.latitude,
          warehouse.longitude
        );

        return {
          ...warehouse,
          distance_km: Math.round(distance),
          estimated_delivery_days: Math.ceil(distance / 300) // ~300km per day
        };
      })
      .filter(w => w.distance_km <= radius)
      .sort((a, b) => a.distance_km - b.distance_km);

    res.json({
      success: true,
      data: {
        pincode,
        radius_km: parseInt(radius),
        warehouses: warehousesWithDistance,
        count: warehousesWithDistance.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update warehouse amenities
 * @route PUT /api/warehouses/:id/amenities
 * @access Private
 */
export const updateAmenities = async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { amenities } = req.body;
    const user_id = req.user.id;

    // Verify warehouse exists
    const warehouseCheck = await client.query(
      'SELECT id FROM warehouses WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (warehouseCheck.rows.length === 0) {
      throw new AppError('Warehouse not found', 404);
    }

    // Delete existing amenities
    await client.query('DELETE FROM warehouse_amenities WHERE warehouse_id = $1', [id]);

    // Add new amenities
    if (amenities && amenities.length > 0) {
      for (const amenity of amenities) {
        await client.query(
          'INSERT INTO warehouse_amenities (warehouse_id, amenity) VALUES ($1, $2)',
          [id, amenity]
        );
      }
    }

    await client.query('COMMIT');

    // Fetch updated amenities
    const result = await pool.query(
      'SELECT amenity FROM warehouse_amenities WHERE warehouse_id = $1 ORDER BY amenity',
      [id]
    );

    res.json({
      success: true,
      message: 'Amenities updated successfully',
      data: {
        warehouse_id: parseInt(id),
        amenities: result.rows.map(row => row.amenity)
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};
