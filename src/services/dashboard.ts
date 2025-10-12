/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import apiClient, { ApiSuccessResponse, handleApiResponse } from './api';

// Types
export interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    delivered: number;
    total_revenue: number;
    delivered_revenue: number;
    average_order_value: number;
  };
  customers: {
    total: number;
    premium: number;
    new: number;
  };
  products: {
    total: number;
    active: number;
    low_stock: number;
    inventory_value: number;
  };
  warehouses: {
    total: number;
    active: number;
    total_capacity: number;
    total_occupied: number;
    utilization_rate: number;
  };
}

export interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  order_count: number;
  avg_order_value: number;
}

export interface TopProduct {
  id: number;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  segment: string;
  total_orders: number;
  total_revenue: number;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_orders: RecentOrder[];
  revenue_chart: {
    period: string;
    data: RevenueData[];
  };
  top_products: TopProduct[];
}

// Dashboard API calls
export const dashboardService = {
  /**
   * Get all dashboard data
   * @returns Complete dashboard data
   */
  getData: async (): Promise<DashboardData> => {
    const response = await apiClient.get<ApiSuccessResponse<DashboardData>>(
      '/dashboard'
    );
    return handleApiResponse<DashboardData>(response);
  },

  /**
   * Get dashboard statistics only
   * @returns Dashboard stats
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiSuccessResponse<DashboardStats>>(
      '/dashboard/stats'
    );
    return handleApiResponse<DashboardStats>(response);
  },

  /**
   * Get recent orders
   * @param limit Number of orders to fetch
   * @returns List of recent orders
   */
  getRecentOrders: async (limit: number = 10): Promise<RecentOrder[]> => {
    const response = await apiClient.get<ApiSuccessResponse<RecentOrder[]>>(
      `/dashboard/recent-orders?limit=${limit}`
    );
    return handleApiResponse<RecentOrder[]>(response);
  },

  /**
   * Get revenue chart data
   * @param days Number of days to fetch (default: 7)
   * @returns Revenue data for chart
   */
  getRevenueChart: async (days: number = 7): Promise<RevenueData[]> => {
    const response = await apiClient.get<ApiSuccessResponse<RevenueData[]>>(
      `/dashboard/revenue-chart?days=${days}`
    );
    return handleApiResponse<RevenueData[]>(response);
  },

  /**
   * Get top selling products
   * @param limit Number of products to fetch
   * @returns List of top products
   */
  getTopProducts: async (limit: number = 5): Promise<TopProduct[]> => {
    const response = await apiClient.get<ApiSuccessResponse<TopProduct[]>>(
      `/dashboard/top-products?limit=${limit}`
    );
    return handleApiResponse<TopProduct[]>(response);
  },
};

export default dashboardService;
