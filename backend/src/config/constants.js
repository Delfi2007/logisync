// Application constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded'
};

export const CUSTOMER_SEGMENT = {
  PREMIUM: 'premium',
  REGULAR: 'regular',
  NEW: 'new'
};

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  DISCONTINUED: 'discontinued',
  OUT_OF_STOCK: 'out_of_stock'
};

export const WAREHOUSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance'
};

export const STOCK_MOVEMENT_TYPE = {
  IN: 'in',
  OUT: 'out',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment',
  RETURN: 'return'
};

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin'
};

export const ADDRESS_TYPE = {
  BILLING: 'billing',
  SHIPPING: 'shipping'
};

// GST rates for India
export const GST_RATES = {
  RATE_5: 0.05,
  RATE_12: 0.12,
  RATE_18: 0.18,
  RATE_28: 0.28
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// JWT expiration times
export const JWT_EXPIRY = {
  ACCESS_TOKEN: '7d',
  REFRESH_TOKEN: '30d'
};

export default {
  ORDER_STATUS,
  PAYMENT_STATUS,
  CUSTOMER_SEGMENT,
  PRODUCT_STATUS,
  WAREHOUSE_STATUS,
  STOCK_MOVEMENT_TYPE,
  USER_ROLE,
  ADDRESS_TYPE,
  GST_RATES,
  PAGINATION,
  JWT_EXPIRY
};
