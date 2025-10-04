-- Migration 006: Create stock_movements table and seed data
-- Description: Track all inventory movements and populate initial test data
-- Created: October 3, 2025

CREATE TABLE IF NOT EXISTS stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('in', 'out', 'transfer', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50),
  reference_id INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_warehouse_id ON stock_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_movements_reference ON stock_movements(reference_type, reference_id);

COMMENT ON TABLE stock_movements IS 'Audit log of all inventory movements';
COMMENT ON COLUMN stock_movements.type IS 'Type of movement: in (receive), out (ship), transfer, adjustment, return';
COMMENT ON COLUMN stock_movements.reference_type IS 'Related entity type (order, purchase, adjustment)';
COMMENT ON COLUMN stock_movements.reference_id IS 'ID of the related entity';

-- Seed some test data
-- Note: This will only insert if tables are empty

DO $$
BEGIN
  -- Check if we already have data
  IF NOT EXISTS (SELECT 1 FROM users WHERE email != 'admin@logisync.com') THEN
    -- Insert a test user
    INSERT INTO users (email, password_hash, full_name, role) 
    VALUES (
      'test@logisync.com',
      '$2b$10$8qKZYXmZ8rYQxKZxZ8rYQOZXmZ8rYQxKZxZ8rYQOZXmZ8rYQxKZxZu', -- Test@123
      'Test User',
      'user'
    );
  END IF;
  
  -- Insert sample products
  IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
    INSERT INTO products (user_id, name, sku, category, description, price, cost, stock, reorder_level, supplier) 
    SELECT 
      1, -- admin user
      'Sample Product ' || i,
      'SKU-' || LPAD(i::TEXT, 5, '0'),
      CASE (i % 4)
        WHEN 0 THEN 'Electronics'
        WHEN 1 THEN 'Apparel'
        WHEN 2 THEN 'Food & Beverage'
        ELSE 'Home & Garden'
      END,
      'This is a sample product description for product ' || i,
      (RANDOM() * 1000 + 100)::DECIMAL(10,2),
      (RANDOM() * 500 + 50)::DECIMAL(10,2),
      (RANDOM() * 200 + 10)::INTEGER,
      20,
      'Supplier ' || ((i % 5) + 1)
    FROM generate_series(1, 20) AS i;
  END IF;
  
  -- Insert sample customers
  IF NOT EXISTS (SELECT 1 FROM customers LIMIT 1) THEN
    INSERT INTO customers (user_id, name, email, phone, business_name, gst_number, segment)
    SELECT
      1,
      'Customer ' || i,
      'customer' || i || '@example.com',
      '+91' || LPAD((9000000000 + i)::TEXT, 10, '0'),
      'Business ' || i,
      '29ABCDE' || LPAD(i::TEXT, 4, '0') || 'F1Z5',
      CASE (i % 3)
        WHEN 0 THEN 'premium'
        WHEN 1 THEN 'regular'
        ELSE 'new'
      END
    FROM generate_series(1, 15) AS i;
    
    -- Add addresses for customers
    INSERT INTO customer_addresses (customer_id, type, street, city, state, pincode, is_default)
    SELECT
      c.id,
      'billing',
      (i || ' MG Road, Sector ' || i),
      CASE (i % 5)
        WHEN 0 THEN 'Mumbai'
        WHEN 1 THEN 'Delhi'
        WHEN 2 THEN 'Bangalore'
        WHEN 3 THEN 'Pune'
        ELSE 'Chennai'
      END,
      CASE (i % 5)
        WHEN 0 THEN 'Maharashtra'
        WHEN 1 THEN 'Delhi'
        WHEN 2 THEN 'Karnataka'
        WHEN 3 THEN 'Maharashtra'
        ELSE 'Tamil Nadu'
      END,
      CASE (i % 5)
        WHEN 0 THEN '400001'
        WHEN 1 THEN '110001'
        WHEN 2 THEN '560001'
        WHEN 3 THEN '411001'
        ELSE '600001'
      END,
      true
    FROM customers c, generate_series(1, 15) AS i
    WHERE c.id = i;
  END IF;
  
  -- Insert sample warehouses
  IF NOT EXISTS (SELECT 1 FROM warehouses LIMIT 1) THEN
    INSERT INTO warehouses (user_id, name, code, street, city, state, pincode, latitude, longitude, capacity, occupied, status, is_verified, contact_person, contact_phone, cost_per_sqft)
    VALUES
      (1, 'Mumbai Central Warehouse', 'WH-MUM-001', 'Plot 123, MIDC Area', 'Mumbai', 'Maharashtra', '400001', 19.0760, 72.8777, 50000, 35000, 'active', true, 'Rajesh Kumar', '+919876543210', 45.00),
      (1, 'Delhi North Hub', 'WH-DEL-001', 'Sector 18, Industrial Area', 'Delhi', 'Delhi', '110001', 28.7041, 77.1025, 40000, 28000, 'active', true, 'Amit Singh', '+919876543211', 50.00),
      (1, 'Bangalore Tech Park', 'WH-BLR-001', 'Electronic City Phase 1', 'Bangalore', 'Karnataka', '560001', 12.9716, 77.5946, 35000, 20000, 'active', true, 'Priya Sharma', '+919876543212', 55.00),
      (1, 'Pune Distribution Center', 'WH-PUN-001', 'Hinjewadi Phase 2', 'Pune', 'Maharashtra', '411001', 18.5204, 73.8567, 30000, 15000, 'active', true, 'Suresh Patil', '+919876543213', 42.00),
      (1, 'Chennai South Facility', 'WH-CHN-001', 'OMR Road, Siruseri', 'Chennai', 'Tamil Nadu', '600001', 13.0827, 80.2707, 25000, 12000, 'active', false, 'Karthik Narayanan', '+919876543214', 48.00);
    
    -- Add amenities
    INSERT INTO warehouse_amenities (warehouse_id, amenity)
    SELECT w.id, amenity
    FROM warehouses w
    CROSS JOIN (VALUES 
      ('climate_control'),
      ('security_24x7'),
      ('loading_dock'),
      ('parking_space')
    ) AS amenities(amenity)
    WHERE w.id <= 3;
  END IF;
  
END $$;

-- Create views for common queries
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  p.*,
  (p.reorder_level - p.stock) AS shortage_quantity
FROM products p
WHERE p.stock <= p.reorder_level
  AND p.status = 'active'
ORDER BY (p.reorder_level - p.stock) DESC;

CREATE OR REPLACE VIEW customer_order_summary AS
SELECT 
  c.id,
  c.name,
  c.email,
  c.segment,
  COUNT(DISTINCT o.id) AS order_count,
  SUM(o.total_amount) AS lifetime_value,
  MAX(o.created_at) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.email, c.segment;

CREATE OR REPLACE VIEW warehouse_utilization AS
SELECT 
  w.*,
  CASE 
    WHEN w.capacity > 0 THEN ROUND((w.occupied::DECIMAL / w.capacity::DECIMAL) * 100, 2)
    ELSE 0
  END AS utilization_percentage,
  (w.capacity - w.occupied) AS available_space
FROM warehouses w;

COMMENT ON VIEW low_stock_products IS 'Products below reorder level';
COMMENT ON VIEW customer_order_summary IS 'Customer statistics with order count and lifetime value';
COMMENT ON VIEW warehouse_utilization IS 'Warehouse capacity utilization metrics';
