/**
 * User Management API Service
 * Handles all user-related API calls
 */

import { apiClient } from './api';
import type { 
  UserDetailed, 
  UsersResponse, 
  ActivityResponse, 
  Role,
  UserFilters,
  ActivityFilters 
} from '../types/user';

export const userService = {
  /**
   * Get all users with filters and pagination
   */
  async getAll(filters?: UserFilters): Promise<UsersResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = `/users${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<{ data: UsersResponse }>(url);
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<UserDetailed> {
    const response = await apiClient.get<{ data: UserDetailed }>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Assign roles to user (replaces existing roles)
   */
  async assignRoles(userId: number, roleIds: number[]): Promise<UserDetailed> {
    const response = await apiClient.put<{ data: UserDetailed }>(
      `/users/${userId}/roles`,
      { roleIds }
    );
    return response.data.data;
  },

  /**
   * Add a role to user (append)
   */
  async addRole(userId: number, roleId: number): Promise<UserDetailed> {
    const response = await apiClient.post<{ data: UserDetailed }>(
      `/users/${userId}/roles`,
      { roleId }
    );
    return response.data.data;
  },

  /**
   * Remove role from user
   */
  async removeRole(userId: number, roleId: number): Promise<UserDetailed> {
    const response = await apiClient.delete<{ data: UserDetailed }>(
      `/users/${userId}/roles/${roleId}`
    );
    return response.data.data;
  },

  /**
   * Update user status (activate/deactivate)
   */
  async updateStatus(userId: number, isActive: boolean): Promise<UserDetailed> {
    const response = await apiClient.put<{ data: UserDetailed }>(
      `/users/${userId}/status`,
      { isActive }
    );
    return response.data.data;
  },

  /**
   * Get user activity log
   */
  async getActivity(userId: number, filters?: ActivityFilters): Promise<ActivityResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.action) params.append('action', filters.action);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = `/users/${userId}/activity${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<{ data: ActivityResponse }>(url);
    return response.data.data;
  },

  /**
   * Get all activity (admin only)
   */
  async getAllActivity(filters?: ActivityFilters): Promise<ActivityResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.userId) params.append('userId', filters.userId.toString());
    if (filters?.action) params.append('action', filters.action);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = `/activity/all${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<{ data: ActivityResponse }>(url);
    return response.data.data;
  },
};

export const roleService = {
  /**
   * Get all roles
   */
  async getAll(): Promise<Role[]> {
    const response = await apiClient.get<{ data: Role[] }>('/roles');
    return response.data.data;
  },

  /**
   * Get role by ID
   */
  async getById(id: number): Promise<Role> {
    const response = await apiClient.get<{ data: Role }>(`/roles/${id}`);
    return response.data.data;
  },

  /**
   * Get role by name
   */
  async getByName(name: string): Promise<Role> {
    const response = await apiClient.get<{ data: Role }>(`/roles/name/${name}`);
    return response.data.data;
  },

  /**
   * Get role permissions
   */
  async getPermissions(id: number): Promise<string[]> {
    const response = await apiClient.get<{ data: string[] }>(`/roles/${id}/permissions`);
    return response.data.data;
  },

  /**
   * Get all unique permissions
   */
  async getAllPermissions(): Promise<string[]> {
    const response = await apiClient.get<{ data: string[] }>('/roles/permissions/all');
    return response.data.data;
  },

  /**
   * Get role statistics
   */
  async getStats(): Promise<any[]> {
    const response = await apiClient.get<{ data: any[] }>('/roles/stats');
    return response.data.data;
  },
};
