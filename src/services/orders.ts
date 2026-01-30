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

    try {
      const response = await apiClient.get<ApiSuccessResponse<OrdersListResponse>>(url);
      const backendData = handleApiResponse<OrdersListResponse>(response);

      // Merge with local orders
      const localOrders: Order[] = JSON.parse(localStorage.getItem('local_orders') || '[]');

      if (localOrders.length > 0) {
        // Combine backend and local orders, avoiding duplicates
        const allOrders = [...backendData.orders];
        localOrders.forEach(localOrder => {
          if (!allOrders.find(o => o.id === localOrder.id)) {
            allOrders.push(localOrder);
          }
        });

        return {
          orders: allOrders,
          pagination: {
            ...backendData.pagination,
            total: allOrders.length,
          }
        };
      }

      return backendData;
    } catch (error) {
      // If backend fails, return only local orders
      console.warn('Backend unavailable, returning local orders only:', error);
      const localOrders: Order[] = JSON.parse(localStorage.getItem('local_orders') || '[]');

      return {
        orders: localOrders,
        pagination: {
          page: 1,
          limit: localOrders.length,
          total: localOrders.length,
          totalPages: 1,
        }
      };
    }
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
    try {
      // Try to create order in backend first
      const response = await apiClient.post<ApiSuccessResponse<Order>>(
        '/orders',
        orderData
      );
      return handleApiResponse<Order>(response);
    } catch (error) {
      // If backend fails, save locally
      console.warn('Backend unavailable, saving order locally:', error);

      // Get existing local orders
      const localOrders: Order[] = JSON.parse(localStorage.getItem('local_orders') || '[]');

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => {
        const price = item.unit_price || 0;
        return sum + (price * item.quantity);
      }, 0);

      const taxAmount = subtotal * 0.18; // 18% GST
      const shippingCost = 100; // Default shipping cost
      const totalAmount = subtotal + taxAmount + shippingCost;

      // Create new order
      const newOrder: Order = {
        id: Date.now(),
        user_id: 1,
        customer_id: orderData.customer_id,
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        payment_method: orderData.payment_method || 'cash',
        subtotal: subtotal,
        tax_amount: taxAmount,
        shipping_cost: shippingCost,
        discount_amount: 0,
        total_amount: totalAmount,
        shipping_street: orderData.shipping_street,
        shipping_city: orderData.shipping_city,
        shipping_state: orderData.shipping_state,
        shipping_pincode: orderData.shipping_pincode,
        notes: orderData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to local storage
      localOrders.push(newOrder);
      localStorage.setItem('local_orders', JSON.stringify(localOrders));

      return newOrder;
    }
  },

  /**
   * Update an existing order (shipping address, payment method, notes)
   */
  update: async (id: number, orderData: UpdateOrderData): Promise<Order> => {
    try {
      const response = await apiClient.put<ApiSuccessResponse<Order>>(
        `/orders/${id}`,
        orderData
      );
      return handleApiResponse<Order>(response);
    } catch (error) {
      // If backend fails, update locally
      console.warn('Backend unavailable, updating order locally:', error);

      const localOrders: Order[] = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const orderIndex = localOrders.findIndex(o => o.id === id);

      if (orderIndex === -1) {
        throw new Error('Order not found in local storage');
      }

      const updatedOrder: Order = {
        ...localOrders[orderIndex],
        ...orderData,
        updated_at: new Date().toISOString(),
      };

      localOrders[orderIndex] = updatedOrder;
      localStorage.setItem('local_orders', JSON.stringify(localOrders));

      return updatedOrder;
    }
  },

  /**
   * Update order status and/or payment status
   */
  updateStatus: async (id: number, statusData: UpdateOrderStatusData): Promise<Order> => {
    try {
      const response = await apiClient.put<ApiSuccessResponse<Order>>(
        `/orders/${id}/status`,
        statusData
      );
      return handleApiResponse<Order>(response);
    } catch (error) {
      // If backend fails, update locally
      console.warn('Backend unavailable, updating order status locally:', error);

      const localOrders: Order[] = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const orderIndex = localOrders.findIndex(o => o.id === id);

      if (orderIndex === -1) {
        throw new Error('Order not found in local storage');
      }

      const updatedOrder: Order = {
        ...localOrders[orderIndex],
        ...statusData,
        updated_at: new Date().toISOString(),
      };

      // If status is delivered, set delivered_at
      if (statusData.status === 'delivered' && !updatedOrder.delivered_at) {
        updatedOrder.delivered_at = new Date().toISOString();
      }

      localOrders[orderIndex] = updatedOrder;
      localStorage.setItem('local_orders', JSON.stringify(localOrders));

      return updatedOrder;
    }
  },

  /**
   * Delete an order
   */
  delete: async (id: number): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiSuccessResponse<void>>(
        `/orders/${id}`
      );
      handleApiResponse<void>(response);
    } catch (error) {
      // If backend fails, delete from local storage
      console.warn('Backend unavailable, deleting order locally:', error);

      const localOrders: Order[] = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const updatedOrders = localOrders.filter(o => o.id !== id);

      localStorage.setItem('local_orders', JSON.stringify(updatedOrders));

      // If order wasn't in local storage either, throw error
      if (localOrders.length === updatedOrders.length) {
        throw new Error('Order not found in local storage');
      }
    }
  },
};

export default ordersService;
