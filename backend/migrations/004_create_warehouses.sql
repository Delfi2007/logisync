-- Migration 004: Create warehouses and amenities tables
-- Description: Warehouse locations with amenities and capacity tracking
-- Created: October 3, 2025

CREATE TABLE IF NOT EXISTS warehouses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  street TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  capacity INTEGER DEFAULT 0 CHECK (capacity >= 0),
  occupied INTEGER DEFAULT 0 CHECK (occupied >= 0),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  is_verified BOOLEAN DEFAULT false,
  operating_hours VARCHAR(255),
  contact_person VARCHAR(255),
  contact_phone VARCHAR(20),
  cost_per_sqft DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_occupied_capacity CHECK (occupied <= capacity)
);

CREATE TABLE IF NOT EXISTS warehouse_amenities (
  id SERIAL PRIMARY KEY,
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  amenity VARCHAR(100) NOT NULL,
  UNIQUE(warehouse_id, amenity)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_warehouses_user_id ON warehouses(user_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(code);
CREATE INDEX IF NOT EXISTS idx_warehouses_city ON warehouses(city);
CREATE INDEX IF NOT EXISTS idx_warehouses_pincode ON warehouses(pincode);
CREATE INDEX IF NOT EXISTS idx_warehouses_status ON warehouses(status);
CREATE INDEX IF NOT EXISTS idx_warehouses_location ON warehouses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_warehouse_amenities_warehouse_id ON warehouse_amenities(warehouse_id);

-- Full-text search on warehouse name and location
CREATE INDEX IF NOT EXISTS idx_warehouses_search ON warehouses USING gin(to_tsvector('english', name || ' ' || COALESCE(city, '') || ' ' || COALESCE(state, '')));

-- Triggers
DROP TRIGGER IF EXISTS update_warehouses_updated_at ON warehouses;
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate utilization percentage
CREATE OR REPLACE FUNCTION calculate_warehouse_utilization(warehouse_id_param INTEGER)
RETURNS DECIMAL AS $$
DECLARE
    utilization DECIMAL;
BEGIN
    SELECT 
        CASE 
            WHEN capacity > 0 THEN (occupied::DECIMAL / capacity::DECIMAL) * 100
            ELSE 0
        END INTO utilization
    FROM warehouses
    WHERE id = warehouse_id_param;
    
    RETURN COALESCE(utilization, 0);
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE warehouses IS 'Warehouse locations with capacity and contact information';
COMMENT ON TABLE warehouse_amenities IS 'Amenities available at each warehouse (climate control, security, etc.)';
COMMENT ON COLUMN warehouses.capacity IS 'Total capacity in square feet';
COMMENT ON COLUMN warehouses.occupied IS 'Currently occupied space in square feet';
COMMENT ON COLUMN warehouses.is_verified IS 'Whether warehouse has been verified by admin';
COMMENT ON COLUMN warehouses.latitude IS 'Latitude for distance calculations';
COMMENT ON COLUMN warehouses.longitude IS 'Longitude for distance calculations';
