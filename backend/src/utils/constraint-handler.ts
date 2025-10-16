/**
 * Constraint Violation Handler Service
 * 
 * Handles database constraint violations and provides user-friendly error messages.
 * Maps PostgreSQL constraint errors to meaningful business messages.
 * 
 * Phase 4 Task 5: Data Validation & Constraints
 * Date: October 16, 2025
 */

import { DatabaseError } from 'pg';
import { ValidationError, DatabaseConstraintError } from './errors';
import logger from '../config/logger';

// ============================================
// CONSTRAINT ERROR MAPPINGS
// ============================================

interface ConstraintMapping {
  table: string;
  constraint: string;
  message: string;
  field?: string;
}

const CONSTRAINT_MAPPINGS: ConstraintMapping[] = [
  // Users table
  { table: 'users', constraint: 'users_email_key', message: 'Email address is already registered', field: 'email' },
  { table: 'users', constraint: 'users_email_format_check', message: 'Invalid email format', field: 'email' },
  { table: 'users', constraint: 'users_email_length_check', message: 'Email must be 5-255 characters', field: 'email' },
  { table: 'users', constraint: 'users_full_name_check', message: 'Full name must be at least 2 characters', field: 'full_name' },
  { table: 'users', constraint: 'users_role_check', message: 'Role must be either "user" or "admin"', field: 'role' },

  // Products table
  { table: 'products', constraint: 'products_sku_key', message: 'SKU already exists', field: 'sku' },
  { table: 'products', constraint: 'products_name_check', message: 'Product name must be at least 2 characters', field: 'name' },
  { table: 'products', constraint: 'products_sku_format_check', message: 'SKU must contain only uppercase letters, numbers, hyphens, and underscores', field: 'sku' },
  { table: 'products', constraint: 'products_sku_length_check', message: 'SKU must be 3-100 characters', field: 'sku' },
  { table: 'products', constraint: 'products_price_check', message: 'Price must be positive', field: 'price' },
  { table: 'products', constraint: 'products_price_positive_check', message: 'Price must be greater than 0', field: 'price' },
  { table: 'products', constraint: 'products_cost_check', message: 'Cost must be non-negative', field: 'cost' },
  { table: 'products', constraint: 'products_cost_price_check', message: 'Cost should not exceed selling price', field: 'cost' },
  { table: 'products', constraint: 'products_stock_check', message: 'Stock must be non-negative', field: 'stock' },
  { table: 'products', constraint: 'products_reorder_level_check', message: 'Reorder level must be 0-10,000', field: 'reorder_level' },
  { table: 'products', constraint: 'products_status_check', message: 'Invalid product status', field: 'status' },

  // Customers table
  { table: 'customers', constraint: 'customers_name_check', message: 'Customer name must be at least 2 characters', field: 'name' },
  { table: 'customers', constraint: 'customers_email_format_check', message: 'Invalid email format', field: 'email' },
  { table: 'customers', constraint: 'customers_phone_format_check', message: 'Phone must be 10 digits or +91 followed by 10 digits', field: 'phone' },
  { table: 'customers', constraint: 'customers_gst_format_check', message: 'Invalid GST number format', field: 'gst_number' },
  { table: 'customers', constraint: 'customers_total_orders_check', message: 'Total orders must be non-negative', field: 'total_orders' },
  { table: 'customers', constraint: 'customers_total_revenue_check', message: 'Total revenue must be non-negative', field: 'total_revenue' },
  { table: 'customers', constraint: 'customers_contact_required_check', message: 'At least email or phone must be provided', field: 'email' },
  { table: 'customers', constraint: 'customers_segment_check', message: 'Customer segment must be premium, regular, or new', field: 'segment' },

  // Customer Addresses table
  { table: 'customer_addresses', constraint: 'customer_addresses_street_check', message: 'Street address must be at least 5 characters', field: 'street' },
  { table: 'customer_addresses', constraint: 'customer_addresses_city_check', message: 'City must be at least 2 characters', field: 'city' },
  { table: 'customer_addresses', constraint: 'customer_addresses_state_check', message: 'State must be at least 2 characters', field: 'state' },
  { table: 'customer_addresses', constraint: 'customer_addresses_pincode_check', message: 'Pincode must be exactly 6 digits', field: 'pincode' },
  { table: 'customer_addresses', constraint: 'customer_addresses_type_check', message: 'Address type must be billing or shipping', field: 'type' },

  // Warehouses table
  { table: 'warehouses', constraint: 'warehouses_code_key', message: 'Warehouse code already exists', field: 'code' },
  { table: 'warehouses', constraint: 'warehouses_name_check', message: 'Warehouse name must be at least 2 characters', field: 'name' },
  { table: 'warehouses', constraint: 'warehouses_code_format_check', message: 'Warehouse code must contain only uppercase letters, numbers, hyphens, and underscores', field: 'code' },
  { table: 'warehouses', constraint: 'warehouses_code_length_check', message: 'Warehouse code must be 3-50 characters', field: 'code' },
  { table: 'warehouses', constraint: 'warehouses_pincode_check', message: 'Pincode must be exactly 6 digits', field: 'pincode' },
  { table: 'warehouses', constraint: 'warehouses_latitude_check', message: 'Latitude must be between -90 and 90 degrees', field: 'latitude' },
  { table: 'warehouses', constraint: 'warehouses_longitude_check', message: 'Longitude must be between -180 and 180 degrees', field: 'longitude' },
  { table: 'warehouses', constraint: 'warehouses_capacity_check', message: 'Capacity must be positive', field: 'capacity' },
  { table: 'warehouses', constraint: 'warehouses_capacity_positive_check', message: 'Capacity must be greater than 0', field: 'capacity' },
  { table: 'warehouses', constraint: 'warehouses_occupied_check', message: 'Occupied space must be non-negative', field: 'occupied' },
  { table: 'warehouses', constraint: 'check_occupied_capacity', message: 'Occupied space cannot exceed capacity', field: 'occupied' },
  { table: 'warehouses', constraint: 'warehouses_status_check', message: 'Warehouse status must be active, inactive, or maintenance', field: 'status' },
  { table: 'warehouses', constraint: 'warehouses_contact_phone_check', message: 'Contact phone must be 10 digits or +91 followed by 10 digits', field: 'contact_phone' },
  { table: 'warehouses', constraint: 'warehouses_cost_check', message: 'Cost per sqft must be non-negative', field: 'cost_per_sqft' },

  // Orders table
  { table: 'orders', constraint: 'orders_order_number_key', message: 'Order number already exists', field: 'order_number' },
  { table: 'orders', constraint: 'orders_order_number_format_check', message: 'Order number format must be ORD-YYYYMMDD-NNNN', field: 'order_number' },
  { table: 'orders', constraint: 'orders_subtotal_check', message: 'Subtotal must be positive', field: 'subtotal' },
  { table: 'orders', constraint: 'orders_subtotal_positive_check', message: 'Subtotal must be greater than 0', field: 'subtotal' },
  { table: 'orders', constraint: 'orders_tax_amount_check', message: 'Tax amount must be non-negative', field: 'tax_amount' },
  { table: 'orders', constraint: 'orders_total_amount_check', message: 'Total amount must equal subtotal + tax', field: 'total_amount' },
  { table: 'orders', constraint: 'orders_shipping_pincode_check', message: 'Shipping pincode must be exactly 6 digits', field: 'shipping_pincode' },
  { table: 'orders', constraint: 'orders_delivery_time_check', message: 'Delivery date must be after order creation date', field: 'delivered_at' },
  { table: 'orders', constraint: 'orders_shipping_address_completeness', message: 'Either provide all shipping address fields or none', field: 'shipping_street' },
  { table: 'orders', constraint: 'orders_status_check', message: 'Invalid order status', field: 'status' },
  { table: 'orders', constraint: 'orders_payment_status_check', message: 'Invalid payment status', field: 'payment_status' },

  // Order Items table
  { table: 'order_items', constraint: 'order_items_product_name_check', message: 'Product name must be at least 2 characters', field: 'product_name' },
  { table: 'order_items', constraint: 'order_items_quantity_check', message: 'Quantity must be positive', field: 'quantity' },
  { table: 'order_items', constraint: 'order_items_quantity_min_check', message: 'Quantity must be at least 1', field: 'quantity' },
  { table: 'order_items', constraint: 'order_items_quantity_max_check', message: 'Quantity must not exceed 10,000', field: 'quantity' },
  { table: 'order_items', constraint: 'order_items_unit_price_check', message: 'Unit price must be positive', field: 'unit_price' },
  { table: 'order_items', constraint: 'order_items_total_price_check', message: 'Total price must equal quantity × unit price', field: 'total_price' },

  // Documents table
  { table: 'documents', constraint: 'documents_filename_check', message: 'Invalid filename: must not contain path traversal characters', field: 'filename' },
  { table: 'documents', constraint: 'documents_original_filename_check', message: 'Original filename cannot be empty', field: 'original_filename' },
  { table: 'documents', constraint: 'documents_file_size_check', message: 'File size must be between 1 byte and 50MB', field: 'file_size' },
  { table: 'documents', constraint: 'documents_mime_type_check', message: 'MIME type cannot be empty', field: 'mime_type' },
  { table: 'documents', constraint: 'documents_storage_path_check', message: 'Storage path cannot be empty', field: 'storage_path' },

  // Analytics Events table
  { table: 'analytics_events', constraint: 'analytics_events_event_type_check', message: 'Event type must be at least 2 characters', field: 'event_type' },
  { table: 'analytics_events', constraint: 'analytics_events_session_id_check', message: 'Session ID must be at least 10 characters', field: 'session_id' },

  // Business Metrics table
  { table: 'business_metrics', constraint: 'business_metrics_metric_type_check', message: 'Metric type must be at least 2 characters', field: 'metric_type' },
  { table: 'business_metrics', constraint: 'business_metrics_metric_unit_check', message: 'Metric unit cannot be empty', field: 'metric_unit' },

  // User Sessions table
  { table: 'user_sessions', constraint: 'user_sessions_session_id_key', message: 'Session ID already exists', field: 'session_id' },
  { table: 'user_sessions', constraint: 'user_sessions_session_id_format_check', message: 'Session ID must be at least 10 characters', field: 'session_id' },
  { table: 'user_sessions', constraint: 'user_sessions_duration_check', message: 'Session duration must be non-negative', field: 'duration_seconds' },
  { table: 'user_sessions', constraint: 'user_sessions_page_views_check', message: 'Page views must be non-negative', field: 'page_views' },
  { table: 'user_sessions', constraint: 'user_sessions_events_count_check', message: 'Events count must be non-negative', field: 'events_count' },
  { table: 'user_sessions', constraint: 'user_sessions_timestamps_check', message: 'Session end must be after start', field: 'ended_at' }
];

// ============================================
// FOREIGN KEY ERROR MAPPINGS
// ============================================

interface ForeignKeyMapping {
  constraint: string;
  message: string;
  referencedTable: string;
}

const FOREIGN_KEY_MAPPINGS: ForeignKeyMapping[] = [
  { constraint: 'products_user_id_fkey', message: 'User does not exist', referencedTable: 'users' },
  { constraint: 'customers_user_id_fkey', message: 'User does not exist', referencedTable: 'users' },
  { constraint: 'customer_addresses_customer_id_fkey', message: 'Customer does not exist', referencedTable: 'customers' },
  { constraint: 'warehouses_user_id_fkey', message: 'User does not exist', referencedTable: 'users' },
  { constraint: 'warehouse_amenities_warehouse_id_fkey', message: 'Warehouse does not exist', referencedTable: 'warehouses' },
  { constraint: 'orders_user_id_fkey', message: 'User does not exist', referencedTable: 'users' },
  { constraint: 'orders_customer_id_fkey', message: 'Customer does not exist', referencedTable: 'customers' },
  { constraint: 'order_items_order_id_fkey', message: 'Order does not exist', referencedTable: 'orders' },
  { constraint: 'order_items_product_id_fkey', message: 'Product does not exist', referencedTable: 'products' },
  { constraint: 'documents_user_id_fkey', message: 'User does not exist', referencedTable: 'users' },
  { constraint: 'analytics_events_user_id_fkey', message: 'User does not exist', referencedTable: 'users' },
  { constraint: 'business_metrics_user_id_fkey', message: 'User does not exist', referencedTable: 'users' },
  { constraint: 'user_sessions_user_id_fkey', message: 'User does not exist', referencedTable: 'users' }
];

// ============================================
// ERROR HANDLER
// ============================================

/**
 * Handle database constraint violations
 */
export const handleConstraintViolation = (error: any): never => {
  // PostgreSQL error codes
  const UNIQUE_VIOLATION = '23505';
  const FOREIGN_KEY_VIOLATION = '23503';
  const CHECK_VIOLATION = '23514';
  const NOT_NULL_VIOLATION = '23502';
  const STRING_DATA_RIGHT_TRUNCATION = '22001';

  // Log the original error for debugging
  logger.error('Database constraint violation', {
    code: error.code,
    constraint: error.constraint,
    table: error.table,
    detail: error.detail,
    message: error.message
  });

  // Handle different error codes
  switch (error.code) {
    case UNIQUE_VIOLATION:
      throw handleUniqueViolation(error);

    case FOREIGN_KEY_VIOLATION:
      throw handleForeignKeyViolation(error);

    case CHECK_VIOLATION:
      throw handleCheckViolation(error);

    case NOT_NULL_VIOLATION:
      throw handleNotNullViolation(error);

    case STRING_DATA_RIGHT_TRUNCATION:
      throw handleStringTruncation(error);

    default:
      // Generic database error
      throw new DatabaseConstraintError(
        'Database constraint violation',
        {
          code: error.code,
          constraint: error.constraint,
          detail: error.detail
        }
      );
  }
};

/**
 * Handle unique constraint violations
 */
const handleUniqueViolation = (error: any): DatabaseConstraintError => {
  const constraint = error.constraint;
  const mapping = CONSTRAINT_MAPPINGS.find(m => m.constraint === constraint);

  if (mapping) {
    return new DatabaseConstraintError(mapping.message, {
      field: mapping.field,
      constraint,
      table: error.table
    });
  }

  // Generic unique violation message
  return new DatabaseConstraintError(
    'A record with this value already exists',
    {
      constraint,
      detail: error.detail,
      table: error.table
    }
  );
};

/**
 * Handle foreign key constraint violations
 */
const handleForeignKeyViolation = (error: any): DatabaseConstraintError => {
  const constraint = error.constraint;
  const mapping = FOREIGN_KEY_MAPPINGS.find(m => m.constraint === constraint);

  if (mapping) {
    return new DatabaseConstraintError(mapping.message, {
      constraint,
      referencedTable: mapping.referencedTable,
      table: error.table
    });
  }

  // Generic foreign key violation message
  return new DatabaseConstraintError(
    'Referenced record does not exist',
    {
      constraint,
      detail: error.detail,
      table: error.table
    }
  );
};

/**
 * Handle check constraint violations
 */
const handleCheckViolation = (error: any): DatabaseConstraintError => {
  const constraint = error.constraint;
  const mapping = CONSTRAINT_MAPPINGS.find(m => m.constraint === constraint);

  if (mapping) {
    return new DatabaseConstraintError(mapping.message, {
      field: mapping.field,
      constraint,
      table: error.table
    });
  }

  // Generic check violation message
  return new DatabaseConstraintError(
    'Invalid data: constraint violation',
    {
      constraint,
      detail: error.detail,
      table: error.table
    }
  );
};

/**
 * Handle NOT NULL constraint violations
 */
const handleNotNullViolation = (error: any): DatabaseConstraintError => {
  const column = error.column;
  const table = error.table;

  return new DatabaseConstraintError(
    `${column} is required`,
    {
      field: column,
      table,
      constraint: 'not_null'
    }
  );
};

/**
 * Handle string truncation errors
 */
const handleStringTruncation = (error: any): DatabaseConstraintError => {
  return new DatabaseConstraintError(
    'Value is too long for the field',
    {
      detail: error.detail,
      table: error.table
    }
  );
};

/**
 * Check if error is a database constraint violation
 */
export const isConstraintViolation = (error: any): boolean => {
  const constraintCodes = ['23000', '23502', '23503', '23505', '23514', '22001'];
  return constraintCodes.includes(error.code);
};

/**
 * Get user-friendly message for constraint
 */
export const getConstraintMessage = (constraintName: string): string => {
  const mapping = CONSTRAINT_MAPPINGS.find(m => m.constraint === constraintName);
  return mapping?.message || 'Database constraint violation';
};

/**
 * Validate referential integrity before deletion
 */
export const checkReferentialIntegrity = async (
  table: string,
  id: number,
  dbClient: any
): Promise<{ canDelete: boolean; blockedBy?: string[] }> => {
  const dependencies: { [key: string]: string[] } = {
    users: ['products', 'customers', 'warehouses', 'orders', 'documents'],
    customers: ['orders', 'customer_addresses'],
    products: ['order_items'],
    warehouses: ['warehouse_amenities'],
    orders: ['order_items']
  };

  const blockedBy: string[] = [];
  const deps = dependencies[table] || [];

  for (const depTable of deps) {
    let foreignKeyColumn = '';
    
    // Map table to foreign key column
    switch (table) {
      case 'users':
        foreignKeyColumn = 'user_id';
        break;
      case 'customers':
        foreignKeyColumn = 'customer_id';
        break;
      case 'products':
        foreignKeyColumn = 'product_id';
        break;
      case 'warehouses':
        foreignKeyColumn = 'warehouse_id';
        break;
      case 'orders':
        foreignKeyColumn = 'order_id';
        break;
    }

    const result = await dbClient.query(
      `SELECT COUNT(*) as count FROM ${depTable} WHERE ${foreignKeyColumn} = $1`,
      [id]
    );

    if (parseInt(result.rows[0].count) > 0) {
      blockedBy.push(depTable);
    }
  }

  return {
    canDelete: blockedBy.length === 0,
    blockedBy: blockedBy.length > 0 ? blockedBy : undefined
  };
};

// ============================================
// EXPORTS
// ============================================

export default {
  handleConstraintViolation,
  isConstraintViolation,
  getConstraintMessage,
  checkReferentialIntegrity
};
