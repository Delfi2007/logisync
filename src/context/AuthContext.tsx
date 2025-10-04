/**
 * Authentication Context
 * Manages user authentication state and provides auth functions to the app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData } from '@/services/auth';

// Context types
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = authService.getToken();
        
        if (currentUser && token) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login function
   * Authenticates user and stores token
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      const { user: loggedInUser } = await authService.login(credentials);
      setUser(loggedInUser);
      return Promise.resolve();
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  /**
   * Register function
   * Creates new user account and logs them in
   */
  const register = async (data: RegisterData) => {
    try {
      const { user: newUser } = await authService.register(data);
      setUser(newUser);
      return Promise.resolve();
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  /**
   * Logout function
   * Clears user state and token
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Refresh user data
   * Reloads user from localStorage
   */
  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user && authService.isAuthenticated(),
    login,
    register,
    logout,
    refreshUser,
  };

  // Don't render children until auth state is initialized
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * Access authentication context in components
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
