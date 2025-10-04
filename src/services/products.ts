/**
 * Products Service
 * Handles all product-related API calls
 */

import apiClient, { ApiSuccessResponse, PaginationMeta, handleApiResponse } from './api';

// Types
export interface Product {
  id: number;
  user_id: number;
  name: string;
  sku: string;
  category: string | null;
  description: string | null;
  price: number;
  cost: number;
  stock: number;
  reorder_level: number;
  unit: string | null;
  supplier: string | null;
  status: 'active' | 'inactive';
  needs_reorder?: boolean;
  margin_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface Category {
  category: string;
  product_count: number;
  total_stock: number;
  total_value: number;
}

export interface CreateProductData {
  name: string;
  sku: string;
  category?: string;
  description?: string;
  price: number;
  cost: number;
  stock_quantity: number;
  reorder_level: number;
  unit?: string;
  supplier?: string;
}

export interface UpdateProductData {
  name?: string;
  sku?: string;
  category?: string;
  description?: string;
  price?: number;
  cost?: number;
  reorder_level?: number;
  unit?: string;
  supplier?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateStockData {
  adjustment: number;
  reason: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: 'active' | 'inactive';
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

// Products API calls
export const productsService = {
  /**
   * Get all products with filters
   * @param filters Filter and pagination options
   * @returns Paginated products list
   */
  getAll: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);
    }
    
    const response = await apiClient.get<ApiSuccessResponse<ProductsResponse>>(
      `/products?${params.toString()}`
    );
    return handleApiResponse<ProductsResponse>(response);
  },

  /**
   * Get product by ID
   * @param id Product ID
   * @returns Product data
   */
  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiSuccessResponse<Product>>(
      `/products/${id}`
    );
    return handleApiResponse<Product>(response);
  },

  /**
   * Create new product
   * @param data Product data
   * @returns Created product
   */
  create: async (data: CreateProductData): Promise<Product> => {
    const response = await apiClient.post<ApiSuccessResponse<Product>>(
      '/products',
      data
    );
    return handleApiResponse<Product>(response);
  },

  /**
   * Update product
   * @param id Product ID
   * @param data Updated product data
   * @returns Updated product
   */
  update: async (id: number, data: UpdateProductData): Promise<Product> => {
    const response = await apiClient.put<ApiSuccessResponse<Product>>(
      `/products/${id}`,
      data
    );
    return handleApiResponse<Product>(response);
  },

  /**
   * Delete product
   * @param id Product ID
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Update product stock
   * @param id Product ID
   * @param data Stock adjustment data
   * @returns Updated product
   */
  updateStock: async (id: number, data: UpdateStockData): Promise<Product> => {
    const response = await apiClient.patch<ApiSuccessResponse<Product>>(
      `/products/${id}/stock`,
      data
    );
    return handleApiResponse<Product>(response);
  },

  /**
   * Get product categories
   * @returns List of categories with statistics
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiSuccessResponse<Category[]>>(
      '/products/categories'
    );
    return handleApiResponse<Category[]>(response);
  },

  /**
   * Get low stock products
   * @returns List of products with low stock
   */
  getLowStock: async (): Promise<{products: Product[], count: number}> => {
    const response = await apiClient.get<ApiSuccessResponse<{products: Product[], count: number}>>(
      '/products/alerts/low-stock'
    );
    return handleApiResponse<{products: Product[], count: number}>(response);
  },
};

export default productsService;
