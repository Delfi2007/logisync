/**
 * User Management Types
 * Types for user, role, and activity management
 */

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  user_count?: number;
  created_at: string;
  assigned_at?: string;
  assigned_by?: number;
}

export interface UserDetailed {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions?: string[];
  activity_count?: number;
}

export interface Activity {
  id: number;
  user_id: number;
  action: string;
  resource_type?: string;
  resource_id?: number;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at: string;
  timestamp: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  performed_by?: number;
  performed_by_name?: string;
  details?: {
    old_roles?: string[];
    new_roles?: string[];
    status?: boolean;
    ip_address?: string;
    user_agent?: string;
    [key: string]: any;
  };
}

export interface UsersResponse {
  users: UserDetailed[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ActivityResponse {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ActivityFilters {
  page?: number;
  limit?: number;
  userId?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export type RoleName = 'admin' | 'manager' | 'driver' | 'customer' | 'vendor';

export const ROLE_COLORS: Record<RoleName, string> = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  driver: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  customer: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  vendor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

export const ACTION_LABELS: Record<string, string> = {
  login: 'Logged in',
  logout: 'Logged out',
  register: 'Registered',
  password_changed: 'Changed password',
  password_reset_requested: 'Requested password reset',
  password_reset_completed: 'Completed password reset',
  email_verified: 'Verified email',
  roles_updated: 'Updated roles',
  role_added: 'Added role',
  role_removed: 'Removed role',
  user_activated: 'Activated user',
  user_deactivated: 'Deactivated user',
  profile_updated: 'Updated profile',
};
