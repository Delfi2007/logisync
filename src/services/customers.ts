import { apiClient, handleApiResponse, ApiSuccessResponse } from './api';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  business_name?: string;
  gst_number?: string;
  segment: 'premium' | 'regular' | 'new';
  total_orders: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
  addresses?: CustomerAddress[];
}

export interface CustomerAddress {
  id: number;
  customer_id: number;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone: string;
  business_name?: string;
  gst_number?: string;
  segment?: 'premium' | 'regular' | 'new';
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  gst_number?: string;
  segment?: 'premium' | 'regular' | 'new';
}

export interface CreateAddressData {
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface UpdateAddressData {
  type?: 'billing' | 'shipping';
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  segment?: 'premium' | 'regular' | 'new';
  search?: string;
  sortBy?: 'name' | 'email' | 'segment' | 'total_orders' | 'total_revenue' | 'created_at';
  order?: 'ASC' | 'DESC';
}

export interface CustomersListResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Customers Service
// ============================================================================

export const customersService = {
  /**
   * Get all customers with optional filtering and pagination
   */
  getAll: async (filters?: CustomerFilters): Promise<CustomersListResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.segment) params.append('segment', filters.segment);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);
    }

    const queryString = params.toString();
    const url = queryString ? `/customers?${queryString}` : '/customers';

    try {
      const response = await apiClient.get<ApiSuccessResponse<CustomersListResponse>>(url);
      const backendData = handleApiResponse<CustomersListResponse>(response);

      // Merge with local customers
      const localCustomers: Customer[] = JSON.parse(localStorage.getItem('local_customers') || '[]');

      if (localCustomers.length > 0) {
        // Combine backend and local customers, avoiding duplicates
        const allCustomers = [...backendData.customers];
        localCustomers.forEach(localCustomer => {
          if (!allCustomers.find(c => c.id === localCustomer.id)) {
            allCustomers.push(localCustomer);
          }
        });

        return {
          customers: allCustomers,
          pagination: {
            ...backendData.pagination,
            total: allCustomers.length,
          }
        };
      }

      return backendData;
    } catch (error) {
      // If backend fails, return only local customers
      console.warn('Backend unavailable, returning local customers only:', error);
      const localCustomers: Customer[] = JSON.parse(localStorage.getItem('local_customers') || '[]');

      return {
        customers: localCustomers,
        pagination: {
          page: 1,
          limit: localCustomers.length,
          total: localCustomers.length,
          totalPages: 1,
        }
      };
    }
  },

  /**
   * Get a single customer by ID (includes addresses and recent orders)
   */
  getById: async (id: number): Promise<Customer> => {
    const response = await apiClient.get<ApiSuccessResponse<Customer>>(
      `/customers/${id}`
    );
    return handleApiResponse<Customer>(response);
  },

  /**
   * Create a new customer
   */
  create: async (customerData: CreateCustomerData): Promise<Customer> => {
    try {
      // Try to create customer in backend first
      const response = await apiClient.post<ApiSuccessResponse<Customer>>(
        '/customers',
        customerData
      );
      return handleApiResponse<Customer>(response);
    } catch (error) {
      // If backend fails, save locally
      console.warn('Backend unavailable, saving customer locally:', error);

      // Get existing local customers
      const localCustomers: Customer[] = JSON.parse(localStorage.getItem('local_customers') || '[]');

      // Create new customer
      const newCustomer: Customer = {
        id: Date.now(),
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        business_name: customerData.business_name,
        gst_number: customerData.gst_number,
        segment: customerData.segment || 'new',
        total_orders: 0,
        total_revenue: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to local storage
      localCustomers.push(newCustomer);
      localStorage.setItem('local_customers', JSON.stringify(localCustomers));

      return newCustomer;
    }
  },

  /**
   * Update an existing customer
   */
  update: async (id: number, customerData: UpdateCustomerData): Promise<Customer> => {
    const response = await apiClient.put<ApiSuccessResponse<Customer>>(
      `/customers/${id}`,
      customerData
    );
    return handleApiResponse<Customer>(response);
  },

  /**
   * Delete a customer
   */
  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<ApiSuccessResponse<void>>(
      `/customers/${id}`
    );
    handleApiResponse<void>(response);
  },

  // ============================================================================
  // Address Management
  // ============================================================================

  /**
   * Add a new address for a customer
   */
  addAddress: async (customerId: number, addressData: CreateAddressData): Promise<CustomerAddress> => {
    const response = await apiClient.post<ApiSuccessResponse<CustomerAddress>>(
      `/customers/${customerId}/addresses`,
      addressData
    );
    return handleApiResponse<CustomerAddress>(response);
  },

  /**
   * Update an existing customer address
   */
  updateAddress: async (
    customerId: number,
    addressId: number,
    addressData: UpdateAddressData
  ): Promise<CustomerAddress> => {
    const response = await apiClient.put<ApiSuccessResponse<CustomerAddress>>(
      `/customers/${customerId}/addresses/${addressId}`,
      addressData
    );
    return handleApiResponse<CustomerAddress>(response);
  },

  /**
   * Delete a customer address
   */
  deleteAddress: async (customerId: number, addressId: number): Promise<void> => {
    const response = await apiClient.delete<ApiSuccessResponse<void>>(
      `/customers/${customerId}/addresses/${addressId}`
    );
    handleApiResponse<void>(response);
  },
};

export default customersService;
