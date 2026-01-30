import { apiClient, handleApiResponse, ApiSuccessResponse } from './api';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'netbanking' | 'wallet';

export interface Order {
  id: number;
  user_id: number;
  customer_id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  delivered_at?: string;
  
  // Populated fields (when fetching with details)
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  returned_orders: number;
  total_revenue: number;
  average_order_value: number;
}

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
  unit_price?: number; // Optional - will use product price if not provided
}

export interface CreateOrderData {
  customer_id: number;
  items: CreateOrderItem[];
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  payment_method?: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderData {
  shipping_street?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  payment_method?: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusData {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  customer_id?: number;
  search?: string; // Search by order number or customer name
  sortBy?: 'order_number' | 'status' | 'total_amount' | 'created_at' | 'delivered_at';
  order?: 'ASC' | 'DESC';
}

export interface OrdersListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Orders Service
// ============================================================================

export const ordersService = {
  /**
   * Get all orders with optional filtering and pagination
   */
  getAll: async (filters?: OrderFilters): Promise<OrdersListResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.payment_status) params.append('payment_status', filters.payment_status);
      if (filters.customer_id) params.append('customer_id', filters.customer_id.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);
    }

    const queryString = params.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    
    const response = await apiClient.get<ApiSuccessResponse<OrdersListResponse>>(url);
    return handleApiResponse<OrdersListResponse>(response);
  },

  /**
   * Get a single order by ID (includes items and customer details)
   */
  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<ApiSuccessResponse<Order>>(
      `/orders/${id}`
    );
    return handleApiResponse<Order>(response);
  },

  /**
   * Get order statistics
   */
  getStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<ApiSuccessResponse<OrderStats>>(
      '/orders/stats'
    );
    return handleApiResponse<OrderStats>(response);
  },

  /**
   * Create a new order with items
   */
  create: async (orderData: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post<ApiSuccessResponse<Order>>(
      '/orders',
      orderData
    );
    return handleApiResponse<Order>(response);
  },

  /**
   * Update an existing order (shipping address, payment method, notes)
   */
  update: async (id: number, orderData: UpdateOrderData): Promise<Order> => {
    const response = await apiClient.put<ApiSuccessResponse<Order>>(
      `/orders/${id}`,
      orderData
    );
    return handleApiResponse<Order>(response);
  },

  /**
   * Update order status and/or payment status
   */
  updateStatus: async (id: number, statusData: UpdateOrderStatusData): Promise<Order> => {
    const response = await apiClient.put<ApiSuccessResponse<Order>>(
      `/orders/${id}/status`,
      statusData
    );
    return handleApiResponse<Order>(response);
  },

  /**
   * Delete an order
   */
  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<ApiSuccessResponse<void>>(
      `/orders/${id}`
    );
    handleApiResponse<void>(response);
  },
};

export default ordersService;
