/**
 * Data Validation Utilities
 * 
 * Comprehensive validation functions for business logic and data integrity.
 * These validators complement database constraints with application-level validation.
 * 
 * Phase 4 Task 5: Data Validation & Constraints
 * Date: October 16, 2025
 */

import { ValidationError } from './errors';

// ============================================
// INDIAN FORMAT VALIDATORS
// ============================================

/**
 * Validate Indian phone number
 * Formats: 9876543210 or +919876543210
 */
export const validateIndianPhone = (phone: string | null | undefined): {
  valid: boolean;
  error?: string;
  formatted?: string;
} => {
  if (!phone) {
    return { valid: true }; // Optional field
  }

  const cleaned = phone.trim().replace(/\s+/g, '');

  // Format 1: 10 digits
  if (/^[0-9]{10}$/.test(cleaned)) {
    return {
      valid: true,
      formatted: cleaned
    };
  }

  // Format 2: +91 followed by 10 digits
  if (/^\+91[0-9]{10}$/.test(cleaned)) {
    return {
      valid: true,
      formatted: cleaned
    };
  }

  return {
    valid: false,
    error: 'Phone number must be 10 digits or +91 followed by 10 digits'
  };
};

/**
 * Validate Indian GST number
 * Format: 22AAAAA0000A1Z5 (15 characters)
 */
export const validateIndianGST = (gst: string | null | undefined): {
  valid: boolean;
  error?: string;
  formatted?: string;
} => {
  if (!gst) {
    return { valid: true }; // Optional field
  }

  const cleaned = gst.trim().toUpperCase();

  // GST format: 2 digits + 5 letters + 4 digits + 1 letter + 1 digit/letter + Z + 1 digit/letter
  const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstPattern.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid GST number format. Expected format: 22AAAAA0000A1Z5'
    };
  }

  return {
    valid: true,
    formatted: cleaned
  };
};

/**
 * Validate Indian pincode
 * Format: 6 digits (110001)
 */
export const validateIndianPincode = (pincode: string | null | undefined): {
  valid: boolean;
  error?: string;
  formatted?: string;
} => {
  if (!pincode) {
    return { valid: true }; // Optional field
  }

  const cleaned = pincode.trim();

  if (!/^[0-9]{6}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Pincode must be exactly 6 digits'
    };
  }

  // Validate pincode range (Indian pincodes: 110001 to 855118)
  const pincodeNum = parseInt(cleaned, 10);
  if (pincodeNum < 110001 || pincodeNum > 855118) {
    return {
      valid: false,
      error: 'Invalid Indian pincode range'
    };
  }

  return {
    valid: true,
    formatted: cleaned
  };
};

// ============================================
// GENERAL VALIDATORS
// ============================================

/**
 * Validate email format
 */
export const validateEmail = (email: string): {
  valid: boolean;
  error?: string;
  formatted?: string;
} => {
  if (!email) {
    return {
      valid: false,
      error: 'Email is required'
    };
  }

  const cleaned = email.trim().toLowerCase();

  if (cleaned.length < 5 || cleaned.length > 255) {
    return {
      valid: false,
      error: 'Email must be between 5 and 255 characters'
    };
  }

  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailPattern.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid email format'
    };
  }

  return {
    valid: true,
    formatted: cleaned
  };
};

/**
 * Validate URL format
 */
export const validateURL = (url: string | null | undefined): {
  valid: boolean;
  error?: string;
} => {
  if (!url) {
    return { valid: true }; // Optional field
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'URL must use HTTP or HTTPS protocol'
      };
    }
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: 'Invalid URL format'
    };
  }
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (
  value: number | null | undefined,
  fieldName: string,
  options: { min?: number; max?: number; allowZero?: boolean } = {}
): {
  valid: boolean;
  error?: string;
} => {
  if (value === null || value === undefined) {
    return { valid: true }; // Optional field
  }

  const min = options.min ?? (options.allowZero ? 0 : 0.01);
  const max = options.max ?? Number.MAX_SAFE_INTEGER;

  if (typeof value !== 'number' || isNaN(value)) {
    return {
      valid: false,
      error: `${fieldName} must be a valid number`
    };
  }

  if (value < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min}`
    };
  }

  if (value > max) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${max}`
    };
  }

  return { valid: true };
};

/**
 * Validate integer in range
 */
export const validateInteger = (
  value: number | null | undefined,
  fieldName: string,
  min: number,
  max: number
): {
  valid: boolean;
  error?: string;
} => {
  if (value === null || value === undefined) {
    return { valid: true }; // Optional field
  }

  if (!Number.isInteger(value)) {
    return {
      valid: false,
      error: `${fieldName} must be an integer`
    };
  }

  if (value < min || value > max) {
    return {
      valid: false,
      error: `${fieldName} must be between ${min} and ${max}`
    };
  }

  return { valid: true };
};

/**
 * Validate string length
 */
export const validateStringLength = (
  value: string | null | undefined,
  fieldName: string,
  minLength: number,
  maxLength: number
): {
  valid: boolean;
  error?: string;
} => {
  if (!value) {
    return { valid: true }; // Optional field
  }

  const trimmed = value.trim();

  if (trimmed.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${minLength} characters`
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`
    };
  }

  return { valid: true };
};

/**
 * Validate enum value
 */
export const validateEnum = <T extends string>(
  value: string | null | undefined,
  fieldName: string,
  allowedValues: T[]
): {
  valid: boolean;
  error?: string;
} => {
  if (!value) {
    return { valid: true }; // Optional field
  }

  if (!allowedValues.includes(value as T)) {
    return {
      valid: false,
      error: `${fieldName} must be one of: ${allowedValues.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Validate date range
 */
export const validateDateRange = (
  startDate: Date | string,
  endDate: Date | string,
  fieldName: string = 'Date range'
): {
  valid: boolean;
  error?: string;
} => {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  if (isNaN(start.getTime())) {
    return {
      valid: false,
      error: `${fieldName}: Invalid start date`
    };
  }

  if (isNaN(end.getTime())) {
    return {
      valid: false,
      error: `${fieldName}: Invalid end date`
    };
  }

  if (start > end) {
    return {
      valid: false,
      error: `${fieldName}: Start date must be before end date`
    };
  }

  return { valid: true };
};

/**
 * Validate coordinates (latitude, longitude)
 */
export const validateCoordinates = (
  latitude: number | null | undefined,
  longitude: number | null | undefined
): {
  valid: boolean;
  error?: string;
} => {
  if (latitude === null || latitude === undefined) {
    if (longitude !== null && longitude !== undefined) {
      return {
        valid: false,
        error: 'Latitude is required when longitude is provided'
      };
    }
    return { valid: true };
  }

  if (longitude === null || longitude === undefined) {
    return {
      valid: false,
      error: 'Longitude is required when latitude is provided'
    };
  }

  if (latitude < -90 || latitude > 90) {
    return {
      valid: false,
      error: 'Latitude must be between -90 and 90 degrees'
    };
  }

  if (longitude < -180 || longitude > 180) {
    return {
      valid: false,
      error: 'Longitude must be between -180 and 180 degrees'
    };
  }

  return { valid: true };
};

// ============================================
// BUSINESS LOGIC VALIDATORS
// ============================================

/**
 * Validate product data
 */
export const validateProduct = (product: {
  name: string;
  sku: string;
  price: number;
  cost?: number;
  stock?: number;
  reorder_level?: number;
}): void => {
  const errors: string[] = [];

  // Name validation
  const nameCheck = validateStringLength(product.name, 'Product name', 2, 255);
  if (!nameCheck.valid) errors.push(nameCheck.error!);

  // SKU validation
  if (!product.sku || !/^[A-Z0-9_-]+$/.test(product.sku)) {
    errors.push('SKU must contain only uppercase letters, numbers, hyphens, and underscores');
  }
  const skuCheck = validateStringLength(product.sku, 'SKU', 3, 100);
  if (!skuCheck.valid) errors.push(skuCheck.error!);

  // Price validation
  const priceCheck = validatePositiveNumber(product.price, 'Price', { min: 0.01 });
  if (!priceCheck.valid) errors.push(priceCheck.error!);

  // Cost vs Price validation
  if (product.cost !== null && product.cost !== undefined) {
    const costCheck = validatePositiveNumber(product.cost, 'Cost', { allowZero: true });
    if (!costCheck.valid) errors.push(costCheck.error!);

    if (product.cost > product.price) {
      errors.push('Cost should not exceed selling price for profitability');
    }
  }

  // Stock validation
  if (product.stock !== null && product.stock !== undefined) {
    const stockCheck = validateInteger(product.stock, 'Stock', 0, 1000000);
    if (!stockCheck.valid) errors.push(stockCheck.error!);
  }

  // Reorder level validation
  if (product.reorder_level !== null && product.reorder_level !== undefined) {
    const reorderCheck = validateInteger(product.reorder_level, 'Reorder level', 0, 10000);
    if (!reorderCheck.valid) errors.push(reorderCheck.error!);
  }

  if (errors.length > 0) {
    throw new ValidationError('Product validation failed', { errors });
  }
};

/**
 * Validate customer data
 */
export const validateCustomer = (customer: {
  name: string;
  email?: string;
  phone?: string;
  gst_number?: string;
}): void => {
  const errors: string[] = [];

  // Name validation
  const nameCheck = validateStringLength(customer.name, 'Customer name', 2, 255);
  if (!nameCheck.valid) errors.push(nameCheck.error!);

  // At least one contact method required
  if (!customer.email && !customer.phone) {
    errors.push('At least one contact method (email or phone) is required');
  }

  // Email validation (if provided)
  if (customer.email) {
    const emailCheck = validateEmail(customer.email);
    if (!emailCheck.valid) errors.push(emailCheck.error!);
  }

  // Phone validation (if provided)
  if (customer.phone) {
    const phoneCheck = validateIndianPhone(customer.phone);
    if (!phoneCheck.valid) errors.push(phoneCheck.error!);
  }

  // GST validation (if provided)
  if (customer.gst_number) {
    const gstCheck = validateIndianGST(customer.gst_number);
    if (!gstCheck.valid) errors.push(gstCheck.error!);
  }

  if (errors.length > 0) {
    throw new ValidationError('Customer validation failed', { errors });
  }
};

/**
 * Validate address data
 */
export const validateAddress = (address: {
  street: string;
  city: string;
  state: string;
  pincode: string;
}): void => {
  const errors: string[] = [];

  // Street validation
  const streetCheck = validateStringLength(address.street, 'Street address', 5, 500);
  if (!streetCheck.valid) errors.push(streetCheck.error!);

  // City validation
  const cityCheck = validateStringLength(address.city, 'City', 2, 100);
  if (!cityCheck.valid) errors.push(cityCheck.error!);

  // State validation
  const stateCheck = validateStringLength(address.state, 'State', 2, 100);
  if (!stateCheck.valid) errors.push(stateCheck.error!);

  // Pincode validation
  const pincodeCheck = validateIndianPincode(address.pincode);
  if (!pincodeCheck.valid) errors.push(pincodeCheck.error!);

  if (errors.length > 0) {
    throw new ValidationError('Address validation failed', { errors });
  }
};

/**
 * Validate warehouse data
 */
export const validateWarehouse = (warehouse: {
  name: string;
  code: string;
  capacity: number;
  latitude?: number;
  longitude?: number;
  pincode?: string;
}): void => {
  const errors: string[] = [];

  // Name validation
  const nameCheck = validateStringLength(warehouse.name, 'Warehouse name', 2, 255);
  if (!nameCheck.valid) errors.push(nameCheck.error!);

  // Code validation
  if (!warehouse.code || !/^[A-Z0-9_-]+$/.test(warehouse.code)) {
    errors.push('Warehouse code must contain only uppercase letters, numbers, hyphens, and underscores');
  }
  const codeCheck = validateStringLength(warehouse.code, 'Warehouse code', 3, 50);
  if (!codeCheck.valid) errors.push(codeCheck.error!);

  // Capacity validation
  const capacityCheck = validatePositiveNumber(warehouse.capacity, 'Capacity', { min: 1 });
  if (!capacityCheck.valid) errors.push(capacityCheck.error!);

  // Coordinates validation
  const coordCheck = validateCoordinates(warehouse.latitude, warehouse.longitude);
  if (!coordCheck.valid) errors.push(coordCheck.error!);

  // Pincode validation
  if (warehouse.pincode) {
    const pincodeCheck = validateIndianPincode(warehouse.pincode);
    if (!pincodeCheck.valid) errors.push(pincodeCheck.error!);
  }

  if (errors.length > 0) {
    throw new ValidationError('Warehouse validation failed', { errors });
  }
};

/**
 * Validate order data
 */
export const validateOrder = (order: {
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  items?: Array<{ quantity: number; unit_price: number; total_price: number }>;
}): void => {
  const errors: string[] = [];

  // Subtotal validation
  const subtotalCheck = validatePositiveNumber(order.subtotal, 'Subtotal', { min: 0.01 });
  if (!subtotalCheck.valid) errors.push(subtotalCheck.error!);

  // Tax validation
  const taxCheck = validatePositiveNumber(order.tax_amount, 'Tax amount', { allowZero: true });
  if (!taxCheck.valid) errors.push(taxCheck.error!);

  // Total validation
  const totalCheck = validatePositiveNumber(order.total_amount, 'Total amount', { min: 0.01 });
  if (!totalCheck.valid) errors.push(totalCheck.error!);

  // Total must equal subtotal + tax
  const calculatedTotal = Math.round((order.subtotal + order.tax_amount) * 100) / 100;
  const actualTotal = Math.round(order.total_amount * 100) / 100;
  if (calculatedTotal !== actualTotal) {
    errors.push(`Total amount (${actualTotal}) must equal subtotal (${order.subtotal}) + tax (${order.tax_amount}) = ${calculatedTotal}`);
  }

  // Validate items if provided
  if (order.items && order.items.length > 0) {
    order.items.forEach((item, index) => {
      const itemTotal = Math.round(item.quantity * item.unit_price * 100) / 100;
      const actualItemTotal = Math.round(item.total_price * 100) / 100;
      if (itemTotal !== actualItemTotal) {
        errors.push(`Item ${index + 1}: Total price must equal quantity × unit price`);
      }
    });
  }

  if (errors.length > 0) {
    throw new ValidationError('Order validation failed', { errors });
  }
};

/**
 * Validate order item data
 */
export const validateOrderItem = (item: {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}): void => {
  const errors: string[] = [];

  // Product name validation
  const nameCheck = validateStringLength(item.product_name, 'Product name', 2, 255);
  if (!nameCheck.valid) errors.push(nameCheck.error!);

  // Quantity validation (1 to 10,000)
  const quantityCheck = validateInteger(item.quantity, 'Quantity', 1, 10000);
  if (!quantityCheck.valid) errors.push(quantityCheck.error!);

  // Unit price validation
  const priceCheck = validatePositiveNumber(item.unit_price, 'Unit price', { min: 0.01 });
  if (!priceCheck.valid) errors.push(priceCheck.error!);

  // Total price validation (must equal quantity * unit_price)
  const calculatedTotal = Math.round(item.quantity * item.unit_price * 100) / 100;
  const actualTotal = Math.round(item.total_price * 100) / 100;
  if (calculatedTotal !== actualTotal) {
    errors.push(`Total price must equal quantity (${item.quantity}) × unit price (${item.unit_price}) = ${calculatedTotal}, got ${actualTotal}`);
  }

  if (errors.length > 0) {
    throw new ValidationError('Order item validation failed', { errors });
  }
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file: {
  filename: string;
  size: number;
  mimetype: string;
}): void => {
  const errors: string[] = [];

  // Filename validation (no path traversal)
  if (!file.filename || /\.\./.test(file.filename) || /[\/\\]/.test(file.filename)) {
    errors.push('Invalid filename: must not contain path traversal characters');
  }

  // File size validation (max 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  if (file.size <= 0 || file.size > maxSize) {
    errors.push(`File size must be between 1 byte and 50MB (got ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  }

  // MIME type validation
  if (!file.mimetype || file.mimetype.length < 3) {
    errors.push('Invalid MIME type');
  }

  if (errors.length > 0) {
    throw new ValidationError('File upload validation failed', { errors });
  }
};

// ============================================
// BATCH VALIDATORS
// ============================================

/**
 * Validate all fields and collect errors
 */
export const validateFields = (validations: Array<{ valid: boolean; error?: string }>): void => {
  const errors = validations
    .filter(v => !v.valid)
    .map(v => v.error!)
    .filter(Boolean);

  if (errors.length > 0) {
    throw new ValidationError('Validation failed', { errors });
  }
};

// ============================================
// EXPORTS
// ============================================

export default {
  // Indian format validators
  validateIndianPhone,
  validateIndianGST,
  validateIndianPincode,

  // General validators
  validateEmail,
  validateURL,
  validatePositiveNumber,
  validateInteger,
  validateStringLength,
  validateEnum,
  validateDateRange,
  validateCoordinates,

  // Business logic validators
  validateProduct,
  validateCustomer,
  validateAddress,
  validateWarehouse,
  validateOrder,
  validateOrderItem,
  validateFileUpload,

  // Batch validator
  validateFields
};
