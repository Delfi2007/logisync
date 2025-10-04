import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  AlertCircle, 
  IndianRupee,
  Plus,
  Warehouse,
  Truck,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dashboardService, { DashboardData } from '@/services/dashboard';

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  subtitle?: string;
}

function MetricCard({ title, value, change, icon: Icon, subtitle }: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="card p-6 hover:shadow-minimal-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <h3 className="text-3xl font-bold text-neutral-900 mt-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="w-14 h-14 bg-neutral-100 rounded-lg flex items-center justify-center">
            <Icon className="w-7 h-7 text-neutral-700" />
          </div>
        </div>
      </div>
      
      {change !== undefined && (
        <div className="flex items-center mt-4 pt-4 border-t border-neutral-100">
          {isPositive && (
            <>
              <TrendingUp className="w-4 h-4 text-neutral-900 mr-1" />
              <span className="text-sm font-medium text-neutral-900">
                +{change}%
              </span>
            </>
          )}
          {isNegative && (
            <>
              <TrendingDown className="w-4 h-4 text-neutral-600 mr-1" />
              <span className="text-sm font-medium text-neutral-600">
                {change}%
              </span>
            </>
          )}
          <span className="text-sm text-neutral-500 ml-2">vs last period</span>
        </div>
      )}
    </div>
  );
}

// Quick Action Button
interface QuickActionProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}

function QuickAction({ label, icon: Icon, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 card hover:shadow-minimal-lg transition-all hover:scale-105"
    >
      <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm font-medium text-neutral-900">{label}</span>
    </button>
  );
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neutral-400 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Failed to load dashboard</h2>
          <p className="text-neutral-600 mb-4">{error || 'Unknown error occurred'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, recent_orders, revenue_chart, top_products } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Orders"
          value={stats.total_orders}
          change={stats.orders_growth}
          icon={ShoppingCart}
          subtitle={`${stats.pending_orders} pending`}
        />
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(stats.total_revenue)}
          change={stats.revenue_growth}
          icon={IndianRupee}
        />
        <MetricCard
          title="Total Products"
          value={stats.total_products}
          icon={Package}
          subtitle={`${stats.low_stock_count} low stock`}
        />
        <MetricCard
          title="Total Customers"
          value={stats.total_customers}
          icon={Warehouse}
          subtitle="Registered customers"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            label="Create Order"
            icon={Plus}
            onClick={() => {/* TODO: Implement create order */}}
          />
          <QuickAction
            label="Add Inventory"
            icon={Package}
            onClick={() => {/* TODO: Implement add inventory */}}
          />
          <QuickAction
            label="Find Warehouse"
            icon={Warehouse}
            onClick={() => {/* TODO: Implement find warehouse */}}
          />
          <QuickAction
            label="Book Shipment"
            icon={Truck}
            onClick={() => {/* TODO: Implement book shipment */}}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Revenue Trends (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenue_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#737373', fontSize: 12 }}
                stroke="#d4d4d4"
              />
              <YAxis 
                tick={{ fill: '#737373', fontSize: 12 }}
                stroke="#d4d4d4"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0a0a0a" 
                strokeWidth={2}
                dot={{ fill: '#0a0a0a', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top_products}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#737373', fontSize: 12 }}
                stroke="#d4d4d4"
              />
              <YAxis 
                tick={{ fill: '#737373', fontSize: 12 }}
                stroke="#d4d4d4"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="total_revenue" fill="#0a0a0a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neutral-900">Recent Orders</h3>
          <button className="text-sm text-neutral-600 hover:text-neutral-900">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                  Order #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`badge ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-neutral-100 text-neutral-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent_orders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600">No recent orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
