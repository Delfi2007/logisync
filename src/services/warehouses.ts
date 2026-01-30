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

    try {
      const response = await apiClient.get<ApiSuccessResponse<WarehousesListResponse>>(url);
      const backendData = handleApiResponse<WarehousesListResponse>(response);

      // Merge with local warehouses
      const localWarehouses: Warehouse[] = JSON.parse(localStorage.getItem('local_warehouses') || '[]');

      if (localWarehouses.length > 0) {
        // Combine backend and local warehouses, avoiding duplicates
        const allWarehouses = [...backendData.warehouses];
        localWarehouses.forEach(localWarehouse => {
          if (!allWarehouses.find(w => w.id === localWarehouse.id)) {
            allWarehouses.push(localWarehouse);
          }
        });

        return {
          warehouses: allWarehouses,
          pagination: {
            ...backendData.pagination,
            total: allWarehouses.length,
          }
        };
      }

      return backendData;
    } catch (error) {
      // If backend fails, return only local warehouses
      console.warn('Backend unavailable, returning local warehouses only:', error);
      const localWarehouses: Warehouse[] = JSON.parse(localStorage.getItem('local_warehouses') || '[]');

      return {
        warehouses: localWarehouses,
        pagination: {
          page: 1,
          limit: localWarehouses.length,
          total: localWarehouses.length,
          totalPages: 1,
        }
      };
    }
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
    try {
      // Try to create warehouse in backend first
      const response = await apiClient.post<ApiSuccessResponse<Warehouse>>(
        '/warehouses',
        warehouseData
      );
      return handleApiResponse<Warehouse>(response);
    } catch (error) {
      // If backend fails, save locally
      console.warn('Backend unavailable, saving warehouse locally:', error);

      // Get existing local warehouses
      const localWarehouses: Warehouse[] = JSON.parse(localStorage.getItem('local_warehouses') || '[]');

      // Calculate available space
      const occupied = warehouseData.occupied || 0;
      const available = warehouseData.capacity - occupied;

      // Create new warehouse
      const newWarehouse: Warehouse = {
        id: Date.now(),
        user_id: 1,
        name: warehouseData.name,
        code: warehouseData.code,
        street: warehouseData.street,
        city: warehouseData.city,
        state: warehouseData.state,
        pincode: warehouseData.pincode,
        country: 'India',
        latitude: warehouseData.latitude,
        longitude: warehouseData.longitude,
        capacity: warehouseData.capacity,
        occupied: occupied,
        available: available,
        available_space: available,
        status: 'active',
        is_verified: false,
        contact_person: warehouseData.contact_person,
        contact_phone: warehouseData.contact_phone,
        contact_email: warehouseData.contact_email,
        cost_per_sqft: warehouseData.cost_per_sqft,
        amenities: warehouseData.amenities || [],
        utilization_percentage: (occupied / warehouseData.capacity) * 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to local storage
      localWarehouses.push(newWarehouse);
      localStorage.setItem('local_warehouses', JSON.stringify(localWarehouses));

      return newWarehouse;
    }
  },

  /**
   * Update an existing warehouse
   */
  update: async (id: number, warehouseData: UpdateWarehouseData): Promise<Warehouse> => {
    try {
      const response = await apiClient.put<ApiSuccessResponse<Warehouse>>(
        `/warehouses/${id}`,
        warehouseData
      );
      return handleApiResponse<Warehouse>(response);
    } catch (error) {
      // If backend fails, update locally
      console.warn('Backend unavailable, updating warehouse locally:', error);

      const localWarehouses: Warehouse[] = JSON.parse(localStorage.getItem('local_warehouses') || '[]');
      const warehouseIndex = localWarehouses.findIndex(w => w.id === id);

      if (warehouseIndex === -1) {
        throw new Error('Warehouse not found in local storage');
      }

      const updatedWarehouse: Warehouse = {
        ...localWarehouses[warehouseIndex],
        ...warehouseData,
        updated_at: new Date().toISOString(),
      };

      // Recalculate available space if capacity or occupied changed
      if (warehouseData.capacity !== undefined || warehouseData.occupied !== undefined) {
        const capacity = warehouseData.capacity ?? updatedWarehouse.capacity;
        const occupied = warehouseData.occupied ?? updatedWarehouse.occupied;
        updatedWarehouse.available = capacity - occupied;
        updatedWarehouse.available_space = capacity - occupied;
        updatedWarehouse.utilization_percentage = (occupied / capacity) * 100;
      }

      localWarehouses[warehouseIndex] = updatedWarehouse;
      localStorage.setItem('local_warehouses', JSON.stringify(localWarehouses));

      return updatedWarehouse;
    }
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
    try {
      const response = await apiClient.delete<ApiSuccessResponse<void>>(
        `/warehouses/${id}`
      );
      handleApiResponse<void>(response);
    } catch (error) {
      // If backend fails, delete from local storage
      console.warn('Backend unavailable, deleting warehouse locally:', error);

      const localWarehouses: Warehouse[] = JSON.parse(localStorage.getItem('local_warehouses') || '[]');
      const updatedWarehouses = localWarehouses.filter(w => w.id !== id);

      localStorage.setItem('local_warehouses', JSON.stringify(updatedWarehouses));

      // If warehouse wasn't in local storage either, throw error
      if (localWarehouses.length === updatedWarehouses.length) {
        throw new Error('Warehouse not found in local storage');
      }
    }
  },
};

export default warehousesService;
