import { apiClient, handleApiResponse, ApiSuccessResponse } from './api';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type WarehouseStatus = 'active' | 'inactive' | 'maintenance';

export interface Warehouse {
  id: number;
  user_id: number;
  name: string;
  code: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  capacity: number;
  occupied: number;
  available: number; // Frontend field name
  available_space?: number; // Backend field name
  status: WarehouseStatus;
  is_verified: boolean;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  cost_per_sqft?: number;
  created_at: string;
  updated_at: string;
  
  // Populated fields
  amenities?: string[];
  utilization_percentage?: number;
}

export interface CreateWarehouseData {
  name: string;
  code: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  capacity: number;
  contact_person: string;
  contact_phone: string;
  contact_email?: string;
  cost_per_sqft?: number;
  occupied?: number;
  amenities?: string[];
}

export interface UpdateWarehouseData {
  name?: string;
  code?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  occupied?: number; // Current warehouse utilization
  status?: WarehouseStatus;
  is_verified?: boolean; // Warehouse verification status
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  cost_per_sqft?: number;
}

export interface UpdateAmenitiesData {
  amenities: string[];
}

export interface WarehouseFilters {
  page?: number;
  limit?: number;
  status?: WarehouseStatus;
  is_verified?: boolean;
  search?: string; // Search by name, code, city
  sortBy?: 'name' | 'code' | 'city' | 'capacity' | 'occupied' | 'created_at';
  order?: 'ASC' | 'DESC';
}

export interface NearbyWarehousesFilters {
  pincode: string;
  radius?: number; // in km
}

export interface WarehousesListResponse {
  warehouses: Warehouse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WarehouseStats {
  total_warehouses: number;
  active_warehouses: number;
  inactive_warehouses: number;
  maintenance_warehouses: number;
  total_capacity: number;
  total_occupied: number;
  total_available: number;
  average_utilization: number;
}

// ============================================================================
// Warehouses Service
// ============================================================================

export const warehousesService = {
  /**
   * Get all warehouses with optional filtering and pagination
   */
  getAll: async (filters?: WarehouseFilters): Promise<WarehousesListResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.is_verified !== undefined) params.append('is_verified', filters.is_verified.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);
    }

    const queryString = params.toString();
    const url = queryString ? `/warehouses?${queryString}` : '/warehouses';
    
    const response = await apiClient.get<ApiSuccessResponse<WarehousesListResponse>>(url);
    return handleApiResponse<WarehousesListResponse>(response);
  },

  /**
   * Get a single warehouse by ID (includes amenities)
   */
  getById: async (id: number): Promise<Warehouse> => {
    const response = await apiClient.get<ApiSuccessResponse<Warehouse>>(
      `/warehouses/${id}`
    );
    return handleApiResponse<Warehouse>(response);
  },

  /**
   * Find nearby warehouses by pincode
   */
  getNearby: async (filters: NearbyWarehousesFilters): Promise<Warehouse[]> => {
    const params = new URLSearchParams();
    params.append('pincode', filters.pincode);
    if (filters.radius) params.append('radius', filters.radius.toString());

    const response = await apiClient.get<ApiSuccessResponse<Warehouse[]>>(
      `/warehouses/nearby?${params.toString()}`
    );
    return handleApiResponse<Warehouse[]>(response);
  },

  /**
   * Create a new warehouse
   */
  create: async (warehouseData: CreateWarehouseData): Promise<Warehouse> => {
    const response = await apiClient.post<ApiSuccessResponse<Warehouse>>(
      '/warehouses',
      warehouseData
    );
    return handleApiResponse<Warehouse>(response);
  },

  /**
   * Update an existing warehouse
   */
  update: async (id: number, warehouseData: UpdateWarehouseData): Promise<Warehouse> => {
    const response = await apiClient.put<ApiSuccessResponse<Warehouse>>(
      `/warehouses/${id}`,
      warehouseData
    );
    return handleApiResponse<Warehouse>(response);
  },

  /**
   * Update warehouse amenities
   */
  updateAmenities: async (id: number, amenitiesData: UpdateAmenitiesData): Promise<Warehouse> => {
    const response = await apiClient.put<ApiSuccessResponse<Warehouse>>(
      `/warehouses/${id}/amenities`,
      amenitiesData
    );
    return handleApiResponse<Warehouse>(response);
  },

  /**
   * Delete a warehouse
   */
  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<ApiSuccessResponse<void>>(
      `/warehouses/${id}`
    );
    handleApiResponse<void>(response);
  },
};

export default warehousesService;
