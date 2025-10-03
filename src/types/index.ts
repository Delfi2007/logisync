// Core data models for LogiSync

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  businessName: string;
  gstNumber?: string;
  subscriptionTier: 'starter' | 'growth' | 'enterprise';
  createdAt: Date;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  currentStock: number;
  reorderLevel: number;
  unit: 'pieces' | 'kg' | 'liters';
  locations: Array<{
    warehouseId: string;
    quantity: number;
  }>;
  supplier?: {
    name: string;
    contact: string;
  };
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'partial';
export type DeliveryType = 'standard' | 'express' | 'scheduled';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  deliveryType: DeliveryType;
  estimatedDelivery: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerSegment = 'new' | 'regular' | 'premium';

export interface Customer {
  id: string;
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  gstNumber?: string;
  billingAddress: Address;
  shippingAddresses: Address[];
  totalOrders: number;
  lifetimeValue: number;
  segment: CustomerSegment;
  createdAt: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  ownerId: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: { lat: number; lng: number };
  };
  totalArea: number;
  availableArea: number;
  pricePerSqft: number;
  amenities: string[];
  operationalHours: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: 'order' | 'shipment' | 'inventory' | 'customer';
  action: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

export interface DashboardMetrics {
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  pendingShipments: number;
  lowStockAlerts: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}
