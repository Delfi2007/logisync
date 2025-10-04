-- Migration 005: Create orders and order_items tables
-- Description: Order management with line items and tracking
-- Created: October 3, 2025

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  shipping_street TEXT,
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_pincode VARCHAR(10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_pincode ON orders(shipping_pincode);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Triggers
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        new_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT COUNT(*) INTO exists_check FROM orders WHERE order_number = new_number;
        EXIT WHEN exists_check = 0;
    END LOOP;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set delivered_at when status changes to delivered
CREATE OR REPLACE FUNCTION set_delivered_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        NEW.delivered_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_delivered_at ON orders;
CREATE TRIGGER update_delivered_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_delivered_timestamp();

-- Function to update customer stats when order is created/updated
CREATE OR REPLACE FUNCTION update_customer_stats_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- On INSERT
    IF TG_OP = 'INSERT' THEN
        UPDATE customers 
        SET 
            total_orders = total_orders + 1,
            total_revenue = total_revenue + NEW.total_amount
        WHERE id = NEW.customer_id;
    END IF;
    
    -- On UPDATE (if total_amount changed)
    IF TG_OP = 'UPDATE' AND NEW.total_amount != OLD.total_amount THEN
        UPDATE customers 
        SET 
            total_revenue = total_revenue - OLD.total_amount + NEW.total_amount
        WHERE id = NEW.customer_id;
    END IF;
    
    -- On DELETE
    IF TG_OP = 'DELETE' THEN
        UPDATE customers 
        SET 
            total_orders = GREATEST(total_orders - 1, 0),
            total_revenue = GREATEST(total_revenue - OLD.total_amount, 0)
        WHERE id = OLD.customer_id;
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_customer_stats ON orders;
CREATE TRIGGER update_customer_stats AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION update_customer_stats_on_order();

-- Function to reduce product stock when order is created
CREATE OR REPLACE FUNCTION reduce_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products 
        SET stock = stock - NEW.quantity
        WHERE id = NEW.product_id AND stock >= NEW.quantity;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Insufficient stock for product ID %', NEW.product_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reduce_product_stock ON order_items;
CREATE TRIGGER reduce_product_stock AFTER INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION reduce_stock_on_order();

COMMENT ON TABLE orders IS 'Customer orders with status tracking';
COMMENT ON TABLE order_items IS 'Line items for each order';
COMMENT ON COLUMN orders.order_number IS 'Unique order identifier (auto-generated: ORD-YYYYMMDD-####)';
COMMENT ON COLUMN order_items.product_name IS 'Denormalized product name for historical record';
COMMENT ON COLUMN order_items.product_sku IS 'Denormalized SKU for historical record';
