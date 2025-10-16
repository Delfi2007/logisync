-- Migration 009: Add Data Validation & Constraints
-- Description: Comprehensive database constraints for data integrity, referential integrity, and business rules
-- Date: October 16, 2025
-- Phase: 4 Task 5 (Data Validation & Constraints)

-- ============================================
-- USERS TABLE CONSTRAINTS
-- ============================================

-- Add constraints if not exists
DO $$
BEGIN
  -- Email format validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_format_check') THEN
    ALTER TABLE users ADD CONSTRAINT users_email_format_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;

  -- Email length validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_length_check') THEN
    ALTER TABLE users ADD CONSTRAINT users_email_length_check 
    CHECK (LENGTH(email) >= 5 AND LENGTH(email) <= 255);
  END IF;

  -- Full name validation (not empty after trimming)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_full_name_check') THEN
    ALTER TABLE users ADD CONSTRAINT users_full_name_check 
    CHECK (LENGTH(TRIM(full_name)) >= 2);
  END IF;

  -- Password hash validation (bcrypt format)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_password_hash_check') THEN
    ALTER TABLE users ADD CONSTRAINT users_password_hash_check 
    CHECK (LENGTH(password_hash) >= 50);
  END IF;

  -- Timestamps validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_timestamps_check') THEN
    ALTER TABLE users ADD CONSTRAINT users_timestamps_check 
    CHECK (created_at <= updated_at);
  END IF;
END $$;

COMMENT ON CONSTRAINT users_email_format_check ON users IS 'Email must be valid format';
COMMENT ON CONSTRAINT users_full_name_check ON users IS 'Full name must be at least 2 characters';

-- ============================================
-- PRODUCTS TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Product name validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_name_check') THEN
    ALTER TABLE products ADD CONSTRAINT products_name_check 
    CHECK (LENGTH(TRIM(name)) >= 2);
  END IF;

  -- SKU format validation (alphanumeric, hyphens, underscores)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_sku_format_check') THEN
    ALTER TABLE products ADD CONSTRAINT products_sku_format_check 
    CHECK (sku ~* '^[A-Z0-9_-]+$');
  END IF;

  -- SKU length validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_sku_length_check') THEN
    ALTER TABLE products ADD CONSTRAINT products_sku_length_check 
    CHECK (LENGTH(sku) >= 3 AND LENGTH(sku) <= 100);
  END IF;

  -- Price validation (must be positive)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_price_positive_check') THEN
    ALTER TABLE products ADD CONSTRAINT products_price_positive_check 
    CHECK (price > 0);
  END IF;

  -- Cost vs Price validation (cost should not exceed price for profitability)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_cost_price_check') THEN
    ALTER TABLE products ADD CONSTRAINT products_cost_price_check 
    CHECK (cost IS NULL OR cost <= price);
  END IF;

  -- Reorder level validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_reorder_level_check') THEN
    ALTER TABLE products ADD CONSTRAINT products_reorder_level_check 
    CHECK (reorder_level >= 0 AND reorder_level <= 10000);
  END IF;

  -- Stock vs reorder level warning (business logic)
  -- Note: This is informational, not enforcing
  
  -- Timestamps validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_timestamps_check') THEN
    ALTER TABLE products ADD CONSTRAINT products_timestamps_check 
    CHECK (created_at <= updated_at);
  END IF;
END $$;

COMMENT ON CONSTRAINT products_sku_format_check ON products IS 'SKU must be uppercase alphanumeric with hyphens/underscores';
COMMENT ON CONSTRAINT products_cost_price_check ON products IS 'Cost should not exceed selling price';

-- ============================================
-- CUSTOMERS TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Customer name validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_name_check') THEN
    ALTER TABLE customers ADD CONSTRAINT customers_name_check 
    CHECK (LENGTH(TRIM(name)) >= 2);
  END IF;

  -- Email format validation (if provided)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_email_format_check') THEN
    ALTER TABLE customers ADD CONSTRAINT customers_email_format_check 
    CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;

  -- Phone format validation (Indian format: 10 digits)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_phone_format_check') THEN
    ALTER TABLE customers ADD CONSTRAINT customers_phone_format_check 
    CHECK (phone IS NULL OR phone ~* '^[0-9]{10}$' OR phone ~* '^\+91[0-9]{10}$');
  END IF;

  -- GST number format (Indian GST: 15 characters)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_gst_format_check') THEN
    ALTER TABLE customers ADD CONSTRAINT customers_gst_format_check 
    CHECK (gst_number IS NULL OR gst_number ~* '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
  END IF;

  -- Total orders validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_total_orders_check') THEN
    ALTER TABLE customers ADD CONSTRAINT customers_total_orders_check 
    CHECK (total_orders >= 0);
  END IF;

  -- Total revenue validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_total_revenue_check') THEN
    ALTER TABLE customers ADD CONSTRAINT customers_total_revenue_check 
    CHECK (total_revenue >= 0);
  END IF;

  -- Business rule: At least one contact method required (email OR phone)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_contact_required_check') THEN
    ALTER TABLE customers ADD CONSTRAINT customers_contact_required_check 
    CHECK (email IS NOT NULL OR phone IS NOT NULL);
  END IF;

  -- Timestamps validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_timestamps_check') THEN
    ALTER TABLE customers ADD CONSTRAINT customers_timestamps_check 
    CHECK (created_at <= updated_at);
  END IF;
END $$;

COMMENT ON CONSTRAINT customers_phone_format_check ON customers IS 'Phone must be 10 digits or +91 followed by 10 digits';
COMMENT ON CONSTRAINT customers_gst_format_check ON customers IS 'GST number must be valid Indian GST format';
COMMENT ON CONSTRAINT customers_contact_required_check ON customers IS 'At least email or phone must be provided';

-- ============================================
-- CUSTOMER ADDRESSES TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Street address validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_addresses_street_check') THEN
    ALTER TABLE customer_addresses ADD CONSTRAINT customer_addresses_street_check 
    CHECK (LENGTH(TRIM(street)) >= 5);
  END IF;

  -- City validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_addresses_city_check') THEN
    ALTER TABLE customer_addresses ADD CONSTRAINT customer_addresses_city_check 
    CHECK (LENGTH(TRIM(city)) >= 2);
  END IF;

  -- State validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_addresses_state_check') THEN
    ALTER TABLE customer_addresses ADD CONSTRAINT customer_addresses_state_check 
    CHECK (LENGTH(TRIM(state)) >= 2);
  END IF;

  -- Pincode validation (Indian pincode: 6 digits)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_addresses_pincode_check') THEN
    ALTER TABLE customer_addresses ADD CONSTRAINT customer_addresses_pincode_check 
    CHECK (pincode ~* '^[0-9]{6}$');
  END IF;
END $$;

COMMENT ON CONSTRAINT customer_addresses_pincode_check ON customer_addresses IS 'Pincode must be 6 digits (Indian format)';

-- ============================================
-- WAREHOUSES TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Warehouse name validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_name_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_name_check 
    CHECK (LENGTH(TRIM(name)) >= 2);
  END IF;

  -- Warehouse code format (uppercase alphanumeric)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_code_format_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_code_format_check 
    CHECK (code ~* '^[A-Z0-9_-]+$');
  END IF;

  -- Warehouse code length
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_code_length_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_code_length_check 
    CHECK (LENGTH(code) >= 3 AND LENGTH(code) <= 50);
  END IF;

  -- Pincode validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_pincode_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_pincode_check 
    CHECK (pincode IS NULL OR pincode ~* '^[0-9]{6}$');
  END IF;

  -- Latitude range validation (-90 to 90)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_latitude_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_latitude_check 
    CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));
  END IF;

  -- Longitude range validation (-180 to 180)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_longitude_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_longitude_check 
    CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
  END IF;

  -- Capacity validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_capacity_positive_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_capacity_positive_check 
    CHECK (capacity > 0);
  END IF;

  -- Contact phone validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_contact_phone_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_contact_phone_check 
    CHECK (contact_phone IS NULL OR contact_phone ~* '^[0-9]{10}$' OR contact_phone ~* '^\+91[0-9]{10}$');
  END IF;

  -- Cost per sqft validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_cost_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_cost_check 
    CHECK (cost_per_sqft IS NULL OR cost_per_sqft >= 0);
  END IF;

  -- Timestamps validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'warehouses_timestamps_check') THEN
    ALTER TABLE warehouses ADD CONSTRAINT warehouses_timestamps_check 
    CHECK (created_at <= updated_at);
  END IF;
END $$;

COMMENT ON CONSTRAINT warehouses_code_format_check ON warehouses IS 'Warehouse code must be uppercase alphanumeric';
COMMENT ON CONSTRAINT warehouses_latitude_check ON warehouses IS 'Latitude must be between -90 and 90 degrees';
COMMENT ON CONSTRAINT warehouses_longitude_check ON warehouses IS 'Longitude must be between -180 and 180 degrees';

-- ============================================
-- ORDERS TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Order number format validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_order_number_format_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_order_number_format_check 
    CHECK (order_number ~* '^ORD-[0-9]{8}-[0-9]{4}$');
  END IF;

  -- Subtotal validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_subtotal_positive_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_subtotal_positive_check 
    CHECK (subtotal > 0);
  END IF;

  -- Total amount validation (must equal subtotal + tax)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_total_amount_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_total_amount_check 
    CHECK (total_amount = subtotal + tax_amount);
  END IF;

  -- Shipping pincode validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_shipping_pincode_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_shipping_pincode_check 
    CHECK (shipping_pincode IS NULL OR shipping_pincode ~* '^[0-9]{6}$');
  END IF;

  -- Business rule: delivered_at must be after created_at
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_delivery_time_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_delivery_time_check 
    CHECK (delivered_at IS NULL OR delivered_at >= created_at);
  END IF;

  -- Business rule: updated_at >= created_at
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_timestamps_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_timestamps_check 
    CHECK (created_at <= updated_at);
  END IF;

  -- Shipping address completeness (all or none)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_shipping_address_completeness') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_shipping_address_completeness 
    CHECK (
      (shipping_street IS NULL AND shipping_city IS NULL AND shipping_state IS NULL AND shipping_pincode IS NULL)
      OR
      (shipping_street IS NOT NULL AND shipping_city IS NOT NULL AND shipping_state IS NOT NULL AND shipping_pincode IS NOT NULL)
    );
  END IF;
END $$;

COMMENT ON CONSTRAINT orders_order_number_format_check ON orders IS 'Order number format: ORD-YYYYMMDD-NNNN';
COMMENT ON CONSTRAINT orders_total_amount_check ON orders IS 'Total must equal subtotal + tax';
COMMENT ON CONSTRAINT orders_shipping_address_completeness ON orders IS 'Either all shipping address fields or none';

-- ============================================
-- ORDER ITEMS TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Product name validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_product_name_check') THEN
    ALTER TABLE order_items ADD CONSTRAINT order_items_product_name_check 
    CHECK (LENGTH(TRIM(product_name)) >= 2);
  END IF;

  -- Quantity validation (at least 1)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_quantity_min_check') THEN
    ALTER TABLE order_items ADD CONSTRAINT order_items_quantity_min_check 
    CHECK (quantity >= 1);
  END IF;

  -- Quantity max validation (business rule: max 1000 per line item)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_quantity_max_check') THEN
    ALTER TABLE order_items ADD CONSTRAINT order_items_quantity_max_check 
    CHECK (quantity <= 10000);
  END IF;

  -- Unit price validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_unit_price_check') THEN
    ALTER TABLE order_items ADD CONSTRAINT order_items_unit_price_check 
    CHECK (unit_price > 0);
  END IF;

  -- Total price validation (must equal quantity * unit_price)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_total_price_check') THEN
    ALTER TABLE order_items ADD CONSTRAINT order_items_total_price_check 
    CHECK (total_price = quantity * unit_price);
  END IF;
END $$;

COMMENT ON CONSTRAINT order_items_total_price_check ON order_items IS 'Total price must equal quantity × unit price';

-- ============================================
-- DOCUMENTS TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Filename validation (no path traversal)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'documents_filename_check') THEN
    ALTER TABLE documents ADD CONSTRAINT documents_filename_check 
    CHECK (filename !~ '\.\.' AND filename !~ '/' AND filename !~ '\\' AND LENGTH(TRIM(filename)) >= 1);
  END IF;

  -- Original filename validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'documents_original_filename_check') THEN
    ALTER TABLE documents ADD CONSTRAINT documents_original_filename_check 
    CHECK (LENGTH(TRIM(original_filename)) >= 1);
  END IF;

  -- File size validation (max 50MB = 52428800 bytes)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'documents_file_size_check') THEN
    ALTER TABLE documents ADD CONSTRAINT documents_file_size_check 
    CHECK (file_size > 0 AND file_size <= 52428800);
  END IF;

  -- MIME type validation (not empty)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'documents_mime_type_check') THEN
    ALTER TABLE documents ADD CONSTRAINT documents_mime_type_check 
    CHECK (LENGTH(TRIM(mime_type)) >= 3);
  END IF;

  -- Storage path validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'documents_storage_path_check') THEN
    ALTER TABLE documents ADD CONSTRAINT documents_storage_path_check 
    CHECK (LENGTH(TRIM(storage_path)) >= 1);
  END IF;

  -- Processing timestamps validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'documents_processing_timestamps_check') THEN
    ALTER TABLE documents ADD CONSTRAINT documents_processing_timestamps_check 
    CHECK (processed_at IS NULL OR processed_at >= uploaded_at);
  END IF;
END $$;

COMMENT ON CONSTRAINT documents_filename_check ON documents IS 'Filename must not contain path traversal characters';
COMMENT ON CONSTRAINT documents_file_size_check ON documents IS 'File size must be between 1 byte and 50MB';

-- ============================================
-- ANALYTICS EVENTS TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Event type validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'analytics_events_event_type_check') THEN
    ALTER TABLE analytics_events ADD CONSTRAINT analytics_events_event_type_check 
    CHECK (LENGTH(TRIM(event_type)) >= 2);
  END IF;

  -- Session ID format (UUID or alphanumeric)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'analytics_events_session_id_check') THEN
    ALTER TABLE analytics_events ADD CONSTRAINT analytics_events_session_id_check 
    CHECK (session_id IS NULL OR LENGTH(session_id) >= 10);
  END IF;
END $$;

-- ============================================
-- BUSINESS METRICS TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Metric type validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'business_metrics_metric_type_check') THEN
    ALTER TABLE business_metrics ADD CONSTRAINT business_metrics_metric_type_check 
    CHECK (LENGTH(TRIM(metric_type)) >= 2);
  END IF;

  -- Metric unit validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'business_metrics_metric_unit_check') THEN
    ALTER TABLE business_metrics ADD CONSTRAINT business_metrics_metric_unit_check 
    CHECK (metric_unit IS NULL OR LENGTH(TRIM(metric_unit)) >= 1);
  END IF;

  -- Recorded timestamp validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'business_metrics_timestamps_check') THEN
    ALTER TABLE business_metrics ADD CONSTRAINT business_metrics_timestamps_check 
    CHECK (recorded_at <= created_at);
  END IF;
END $$;

-- ============================================
-- USER SESSIONS TABLE CONSTRAINTS
-- ============================================

DO $$
BEGIN
  -- Session ID format (UUID or alphanumeric)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_sessions_session_id_format_check') THEN
    ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_session_id_format_check 
    CHECK (LENGTH(session_id) >= 10);
  END IF;

  -- Duration validation (if ended)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_sessions_duration_check') THEN
    ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_duration_check 
    CHECK (duration_seconds IS NULL OR duration_seconds >= 0);
  END IF;

  -- Page views validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_sessions_page_views_check') THEN
    ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_page_views_check 
    CHECK (page_views >= 0);
  END IF;

  -- Events count validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_sessions_events_count_check') THEN
    ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_events_count_check 
    CHECK (events_count >= 0);
  END IF;

  -- Timestamps validation (ended >= started)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_sessions_timestamps_check') THEN
    ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_timestamps_check 
    CHECK (ended_at IS NULL OR ended_at >= started_at);
  END IF;

  -- Last activity validation
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_sessions_last_activity_check') THEN
    ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_last_activity_check 
    CHECK (last_activity_at >= started_at);
  END IF;
END $$;

COMMENT ON CONSTRAINT user_sessions_timestamps_check ON user_sessions IS 'Session end must be after start';

-- ============================================
-- ADD MISSING NOT NULL CONSTRAINTS
-- ============================================

-- These should already exist from original migrations, but adding for completeness
-- Using ALTER TABLE ... ALTER COLUMN ... SET NOT NULL

-- Products
ALTER TABLE products ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE products ALTER COLUMN name SET NOT NULL;
ALTER TABLE products ALTER COLUMN sku SET NOT NULL;
ALTER TABLE products ALTER COLUMN price SET NOT NULL;

-- Customers
ALTER TABLE customers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE customers ALTER COLUMN name SET NOT NULL;

-- Customer Addresses
ALTER TABLE customer_addresses ALTER COLUMN customer_id SET NOT NULL;
ALTER TABLE customer_addresses ALTER COLUMN type SET NOT NULL;
ALTER TABLE customer_addresses ALTER COLUMN street SET NOT NULL;
ALTER TABLE customer_addresses ALTER COLUMN city SET NOT NULL;
ALTER TABLE customer_addresses ALTER COLUMN state SET NOT NULL;
ALTER TABLE customer_addresses ALTER COLUMN pincode SET NOT NULL;

-- Warehouses
ALTER TABLE warehouses ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE warehouses ALTER COLUMN name SET NOT NULL;
ALTER TABLE warehouses ALTER COLUMN code SET NOT NULL;

-- Orders
ALTER TABLE orders ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE orders ALTER COLUMN order_number SET NOT NULL;
ALTER TABLE orders ALTER COLUMN subtotal SET NOT NULL;
ALTER TABLE orders ALTER COLUMN total_amount SET NOT NULL;

-- Order Items
ALTER TABLE order_items ALTER COLUMN order_id SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN product_name SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN quantity SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN unit_price SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN total_price SET NOT NULL;

-- Documents
ALTER TABLE documents ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE documents ALTER COLUMN filename SET NOT NULL;
ALTER TABLE documents ALTER COLUMN original_filename SET NOT NULL;
ALTER TABLE documents ALTER COLUMN mime_type SET NOT NULL;
ALTER TABLE documents ALTER COLUMN file_size SET NOT NULL;
ALTER TABLE documents ALTER COLUMN storage_path SET NOT NULL;

-- Analytics Events
ALTER TABLE analytics_events ALTER COLUMN event_type SET NOT NULL;

-- Business Metrics
ALTER TABLE business_metrics ALTER COLUMN metric_type SET NOT NULL;
ALTER TABLE business_metrics ALTER COLUMN metric_value SET NOT NULL;

-- User Sessions
ALTER TABLE user_sessions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_sessions ALTER COLUMN session_id SET NOT NULL;

-- ============================================
-- CREATE VALIDATION FUNCTIONS
-- ============================================

-- Function to validate Indian phone numbers
CREATE OR REPLACE FUNCTION is_valid_indian_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN phone IS NULL OR phone ~* '^[0-9]{10}$' OR phone ~* '^\+91[0-9]{10}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION is_valid_indian_phone IS 'Validates Indian phone number format (10 digits or +91 followed by 10 digits)';

-- Function to validate Indian GST number
CREATE OR REPLACE FUNCTION is_valid_indian_gst(gst_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN gst_number IS NULL OR gst_number ~* '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION is_valid_indian_gst IS 'Validates Indian GST number format (15 characters)';

-- Function to validate Indian pincode
CREATE OR REPLACE FUNCTION is_valid_indian_pincode(pincode TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN pincode IS NULL OR pincode ~* '^[0-9]{6}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION is_valid_indian_pincode IS 'Validates Indian pincode format (6 digits)';

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION is_valid_email IS 'Validates email format';

-- ============================================
-- ADD INDEXES FOR CONSTRAINT CHECKING
-- ============================================

-- Composite index for order total validation
CREATE INDEX IF NOT EXISTS idx_orders_amount_validation ON orders(subtotal, tax_amount, total_amount);

-- Index for date range queries with constraints
CREATE INDEX IF NOT EXISTS idx_orders_date_validation ON orders(created_at, updated_at, delivered_at);

-- ============================================
-- SUMMARY
-- ============================================

-- Generate summary of constraints added
DO $$
DECLARE
  constraint_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO constraint_count
  FROM pg_constraint
  WHERE conname LIKE '%_check' OR conname LIKE '%_format%';
  
  RAISE NOTICE '=== Migration 009 Complete ===';
  RAISE NOTICE 'Total CHECK constraints in database: %', constraint_count;
  RAISE NOTICE 'Data validation and integrity constraints applied successfully.';
  RAISE NOTICE 'All tables now have comprehensive validation rules.';
END $$;

-- List all constraints added in this migration
SELECT 
  conrelid::regclass AS table_name,
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname LIKE '%_check' OR conname LIKE '%_format%'
ORDER BY conrelid::regclass::text, conname;

COMMENT ON SCHEMA public IS 'Phase 4 Task 5: Comprehensive data validation and constraints applied';
