import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Inventory from '@/pages/Inventory';
import Orders from '@/pages/Orders';
import Marketplace from '@/pages/Marketplace';
import Analytics from '@/pages/Analytics';
import Customers from '@/pages/Customers';
import Warehouses from '@/pages/Warehouses';
import Settings from '@/pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
