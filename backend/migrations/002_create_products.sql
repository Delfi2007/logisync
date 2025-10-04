-- Migration 002: Create products table
-- Description: Product catalog with inventory tracking
-- Created: October 3, 2025

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  cost DECIMAL(10,2) CHECK (cost >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  reorder_level INTEGER DEFAULT 10 CHECK (reorder_level >= 0),
  supplier VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'discontinued', 'out_of_stock')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Full-text search index on name and description
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update status based on stock
CREATE OR REPLACE FUNCTION update_product_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock = 0 THEN
        NEW.status = 'out_of_stock';
    ELSIF NEW.stock > 0 AND OLD.status = 'out_of_stock' THEN
        NEW.status = 'active';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_product_status_on_stock_change ON products;
CREATE TRIGGER update_product_status_on_stock_change BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_stock_status();

COMMENT ON TABLE products IS 'Product catalog with inventory levels';
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique product identifier';
COMMENT ON COLUMN products.reorder_level IS 'Minimum stock level before reorder alert';
COMMENT ON COLUMN products.stock IS 'Current available stock quantity';
