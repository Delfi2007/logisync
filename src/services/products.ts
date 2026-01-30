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
  stock: number;
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
  stock?: number;
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

    try {
      const response = await apiClient.get<ApiSuccessResponse<ProductsResponse>>(
        `/products?${params.toString()}`
      );
      const backendData = handleApiResponse<ProductsResponse>(response);

      // Merge with local products
      const localProducts: Product[] = JSON.parse(localStorage.getItem('local_products') || '[]');

      if (localProducts.length > 0) {
        // Combine backend and local products, avoiding duplicates
        const allProducts = [...backendData.products];
        localProducts.forEach(localProduct => {
          if (!allProducts.find(p => p.id === localProduct.id)) {
            allProducts.push(localProduct);
          }
        });

        return {
          products: allProducts,
          pagination: {
            ...backendData.pagination,
            totalItems: allProducts.length,
          }
        };
      }

      return backendData;
    } catch (error) {
      // If backend fails, return only local products
      console.warn('Backend unavailable, returning local products only:', error);
      const localProducts: Product[] = JSON.parse(localStorage.getItem('local_products') || '[]');

      return {
        products: localProducts,
        pagination: {
          page: 1,
          limit: localProducts.length,
          totalItems: localProducts.length,
          totalPages: 1,
        }
      };
    }
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
    try {
      // Try to save to backend first
      const response = await apiClient.post<ApiSuccessResponse<Product>>(
        '/products',
        data
      );
      return handleApiResponse<Product>(response);
    } catch (error) {
      // If backend fails, save locally
      console.warn('Backend unavailable, saving product locally:', error);

      // Get existing local products
      const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');

      // Create new product with local ID
      const newProduct: Product = {
        id: Date.now(), // Use timestamp as ID
        user_id: 1,
        name: data.name,
        sku: data.sku,
        category: data.category || null,
        description: data.description || null,
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        reorder_level: data.reorder_level,
        unit: data.unit || null,
        supplier: data.supplier || null,
        status: 'active',
        needs_reorder: data.stock <= data.reorder_level,
        margin_percentage: ((data.price - data.cost) / data.price) * 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to local storage
      localProducts.push(newProduct);
      localStorage.setItem('local_products', JSON.stringify(localProducts));

      return newProduct;
    }
  },

  /**
   * Update product
   * @param id Product ID
   * @param data Updated product data
   * @returns Updated product
   */
  update: async (id: number, data: UpdateProductData): Promise<Product> => {
    try {
      // Try to update in backend first
      const response = await apiClient.put<ApiSuccessResponse<Product>>(
        `/products/${id}`,
        data
      );
      return handleApiResponse<Product>(response);
    } catch (error) {
      // If backend fails, update locally
      console.warn('Backend unavailable, updating product locally:', error);

      // Get existing local products
      const localProducts: Product[] = JSON.parse(localStorage.getItem('local_products') || '[]');

      // Find and update the product
      const productIndex = localProducts.findIndex(p => p.id === id);

      if (productIndex === -1) {
        throw new Error('Product not found in local storage');
      }

      // Update the product
      const updatedProduct: Product = {
        ...localProducts[productIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Recalculate derived fields if price or cost changed
      if (data.price !== undefined || data.cost !== undefined) {
        const price = data.price ?? updatedProduct.price;
        const cost = data.cost ?? updatedProduct.cost;
        updatedProduct.margin_percentage = ((price - cost) / price) * 100;
      }

      if (data.stock !== undefined || data.reorder_level !== undefined) {
        const stock = data.stock ?? updatedProduct.stock;
        const reorderLevel = data.reorder_level ?? updatedProduct.reorder_level;
        updatedProduct.needs_reorder = stock <= reorderLevel;
      }

      // Update in array
      localProducts[productIndex] = updatedProduct;
      localStorage.setItem('local_products', JSON.stringify(localProducts));

      return updatedProduct;
    }
  },

  /**
   * Delete product
   * @param id Product ID
   */
  delete: async (id: number): Promise<void> => {
    try {
      // Try to delete from backend first
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      // If backend fails, delete from local storage
      console.warn('Backend unavailable, deleting product locally:', error);

      // Get existing local products
      const localProducts: Product[] = JSON.parse(localStorage.getItem('local_products') || '[]');

      // Filter out the product to delete
      const updatedProducts = localProducts.filter(p => p.id !== id);

      // Save back to localStorage
      localStorage.setItem('local_products', JSON.stringify(updatedProducts));

      // If product wasn't in local storage either, throw error
      if (localProducts.length === updatedProducts.length) {
        throw new Error('Product not found in local storage');
      }
    }
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
  getLowStock: async (): Promise<{ products: Product[], count: number }> => {
    const response = await apiClient.get<ApiSuccessResponse<{ products: Product[], count: number }>>(
      '/products/alerts/low-stock'
    );
    return handleApiResponse<{ products: Product[], count: number }>(response);
  },
};

export default productsService;
