import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import PageLoader from '@/components/PageLoader';

// Lazy load all page components for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Orders = lazy(() => import('@/pages/Orders'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Customers = lazy(() => import('@/pages/Customers'));
const Warehouses = lazy(() => import('@/pages/Warehouses'));
const Settings = lazy(() => import('@/pages/Settings'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/warehouses" element={<Warehouses />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/admin/users" element={<UserManagement />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
