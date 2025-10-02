import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  AlertCircle, 
  IndianRupee,
  Plus,
  Warehouse,
  Truck
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  mockDashboardMetrics,
  orderTrendsData,
  topProductsData,
  deliveryStatusData,
  mockActivities,
} from '@/data/mockData';

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

// Activity Item
interface ActivityItemProps {
  activity: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

function ActivityItem({ activity }: ActivityItemProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'shipment':
        return <Truck className="w-4 h-4" />;
      case 'inventory':
        return <Package className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
        {getTypeIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-900">{activity.description}</p>
        <p className="text-xs text-neutral-500 mt-1">{formatTime(activity.timestamp)}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const metrics = mockDashboardMetrics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
          title="Today's Orders"
          value={metrics.todayOrders}
          change={12.5}
          icon={ShoppingCart}
          subtitle={`${metrics.weekOrders} this week`}
        />
        <MetricCard
          title="Today's Revenue"
          value={formatCurrency(metrics.todayRevenue)}
          change={8.2}
          icon={IndianRupee}
          subtitle={`${formatCurrency(metrics.monthRevenue)} this month`}
        />
        <MetricCard
          title="Pending Shipments"
          value={metrics.pendingShipments}
          icon={Truck}
          subtitle="Awaiting dispatch"
        />
        <MetricCard
          title="Low Stock Alerts"
          value={metrics.lowStockAlerts}
          change={-25}
          icon={AlertCircle}
          subtitle="Items below reorder level"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            label="Create Order"
            icon={Plus}
            onClick={() => console.log('Create Order')}
          />
          <QuickAction
            label="Add Inventory"
            icon={Package}
            onClick={() => console.log('Add Inventory')}
          />
          <QuickAction
            label="Find Warehouse"
            icon={Warehouse}
            onClick={() => console.log('Find Warehouse')}
          />
          <QuickAction
            label="Book Shipment"
            icon={Truck}
            onClick={() => console.log('Book Shipment')}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trends Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Order Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderTrendsData}>
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
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
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
            <BarChart data={topProductsData}>
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
              />
              <Bar dataKey="sales" fill="#0a0a0a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Delivery Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Status Pie Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Delivery Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deliveryStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Activity</h3>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {mockActivities.slice(0, 7).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
