-- Migration 003: Create customers and addresses tables
-- Description: Customer management with multiple addresses
-- Created: October 3, 2025

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  business_name VARCHAR(255),
  gst_number VARCHAR(50),
  segment VARCHAR(50) DEFAULT 'regular' CHECK (segment IN ('premium', 'regular', 'new')),
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('billing', 'shipping')),
  street TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(segment);
CREATE INDEX IF NOT EXISTS idx_customers_gst ON customers(gst_number);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_pincode ON customer_addresses(pincode);

-- Full-text search on customer name and business name
CREATE INDEX IF NOT EXISTS idx_customers_search ON customers USING gin(to_tsvector('english', name || ' ' || COALESCE(business_name, '')));

-- Triggers
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default address per type per customer
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE customer_addresses 
        SET is_default = false 
        WHERE customer_id = NEW.customer_id 
          AND type = NEW.type 
          AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS ensure_one_default_address ON customer_addresses;
CREATE TRIGGER ensure_one_default_address BEFORE INSERT OR UPDATE ON customer_addresses
FOR EACH ROW EXECUTE FUNCTION ensure_single_default_address();

-- Function to auto-categorize customer segment based on revenue
CREATE OR REPLACE FUNCTION update_customer_segment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_revenue >= 100000 THEN
        NEW.segment = 'premium';
    ELSIF NEW.total_orders > 0 THEN
        NEW.segment = 'regular';
    ELSE
        NEW.segment = 'new';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS auto_update_segment ON customers;
CREATE TRIGGER auto_update_segment BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_customer_segment();

COMMENT ON TABLE customers IS 'Customer/Client information and CRM data';
COMMENT ON TABLE customer_addresses IS 'Multiple addresses per customer (billing/shipping)';
COMMENT ON COLUMN customers.segment IS 'Auto-categorized: premium (>100k revenue), regular (has orders), new';
COMMENT ON COLUMN customers.gst_number IS 'GST Number for Indian businesses';
