import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
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

// AI/ML Features
const DemandForecasting = lazy(() => import('@/pages/ai/DemandForecasting'));
const RouteOptimization = lazy(() => import('@/pages/ai/RouteOptimization'));
const FraudDetection = lazy(() => import('@/pages/ai/FraudDetection'));
const ProductRecommendations = lazy(() => import('@/pages/ai/ProductRecommendations'));
const DynamicPricing = lazy(() => import('@/pages/ai/DynamicPricing'));
const ComputerVisionQC = lazy(() => import('@/pages/ai/ComputerVisionQC'));
const NLPInterface = lazy(() => import('@/pages/ai/NLPInterface'));

// Blockchain Features
const BlockchainTracking = lazy(() => import('@/pages/blockchain/BlockchainTracking'));
const NFTDigitalTwins = lazy(() => import('@/pages/blockchain/NFTDigitalTwins'));

// Sustainability Features
const CarbonFootprint = lazy(() => import('@/pages/sustainability/CarbonFootprint'));
const GreenRouting = lazy(() => import('@/pages/sustainability/GreenRouting'));
const ESGReporting = lazy(() => import('@/pages/sustainability/ESGReporting'));

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

            {/* All Routes - No Authentication Required */}
            <Route
              path="/*"
              element={
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
                    
                    {/* AI/ML Features */}
                    <Route path="/ai/demand-forecasting" element={<DemandForecasting />} />
                    <Route path="/ai/route-optimization" element={<RouteOptimization />} />
                    <Route path="/ai/fraud-detection" element={<FraudDetection />} />
                    <Route path="/ai/recommendations" element={<ProductRecommendations />} />
                    <Route path="/ai/dynamic-pricing" element={<DynamicPricing />} />
                    <Route path="/ai/vision-qc" element={<ComputerVisionQC />} />
                    <Route path="/ai/nlp-interface" element={<NLPInterface />} />
                    
                    {/* Blockchain Features */}
                    <Route path="/blockchain/tracking" element={<BlockchainTracking />} />
                    <Route path="/blockchain/nft-twins" element={<NFTDigitalTwins />} />
                    
                    {/* Sustainability Features */}
                    <Route path="/sustainability/carbon-footprint" element={<CarbonFootprint />} />
                    <Route path="/sustainability/green-routing" element={<GreenRouting />} />
                    <Route path="/sustainability/esg-reporting" element={<ESGReporting />} />
                  </Routes>
                </MainLayout>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
