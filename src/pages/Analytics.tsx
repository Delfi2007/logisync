import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Users,
  DollarSign,
  ShoppingCart,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    trend: number;
  };
  orders: {
    current: number;
    previous: number;
    trend: number;
  };
  customers: {
    current: number;
    previous: number;
    trend: number;
  };
  deliveryRate: {
    current: number;
    previous: number;
    trend: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  ordersByStatus: Array<{ status: string; count: number; percentage: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  topRegions: Array<{ region: string; orders: number; revenue: number }>;
  performanceMetrics: Array<{ metric: string; value: number; target: number; unit: string }>;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | '1year'>('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = () => {
    setLoading(true);

    setTimeout(() => {
      // STATIC MOCK ANALYTICS DATA
      const mockData: AnalyticsData = {
        revenue: {
          current: 2847500,
          previous: 2456000,
          trend: 15.9
        },
        orders: {
          current: 1247,
          previous: 1089,
          trend: 14.5
        },
        customers: {
          current: 523,
          previous: 487,
          trend: 7.4
        },
        deliveryRate: {
          current: 96.8,
          previous: 94.2,
          trend: 2.8
        },
        monthlyRevenue: [
          { month: 'Apr', revenue: 1850000, orders: 842 },
          { month: 'May', revenue: 2120000, orders: 956 },
          { month: 'Jun', revenue: 2456000, orders: 1089 },
          { month: 'Jul', revenue: 2680000, orders: 1178 },
          { month: 'Aug', revenue: 2340000, orders: 1034 },
          { month: 'Sep', revenue: 2580000, orders: 1156 },
          { month: 'Oct', revenue: 2847500, orders: 1247 }
        ],
        ordersByStatus: [
          { status: 'Delivered', count: 1089, percentage: 87.3 },
          { status: 'In Transit', count: 98, percentage: 7.9 },
          { status: 'Processing', count: 42, percentage: 3.4 },
          { status: 'Pending', count: 18, percentage: 1.4 }
        ],
        topProducts: [
          { name: 'Industrial Equipment Set', sales: 234, revenue: 1170000 },
          { name: 'Medical Supplies Bundle', sales: 189, revenue: 945000 },
          { name: 'Electronics Components', sales: 156, revenue: 780000 },
          { name: 'Construction Materials', sales: 142, revenue: 710000 },
          { name: 'Office Furniture Package', sales: 98, revenue: 490000 }
        ],
        topRegions: [
          { region: 'Mumbai, Maharashtra', orders: 342, revenue: 855000 },
          { region: 'Delhi NCR', orders: 298, revenue: 745000 },
          { region: 'Bangalore, Karnataka', orders: 267, revenue: 667500 },
          { region: 'Chennai, Tamil Nadu', orders: 189, revenue: 472500 },
          { region: 'Pune, Maharashtra', orders: 151, revenue: 377500 }
        ],
        performanceMetrics: [
          { metric: 'Average Delivery Time', value: 2.8, target: 3.0, unit: 'days' },
          { metric: 'Order Fulfillment Rate', value: 96.8, target: 95.0, unit: '%' },
          { metric: 'Customer Satisfaction', value: 4.7, target: 4.5, unit: '/5' },
          { metric: 'Inventory Turnover', value: 8.2, target: 7.0, unit: 'x' },
          { metric: 'On-Time Delivery', value: 94.5, target: 90.0, unit: '%' },
          { metric: 'Return Rate', value: 1.8, target: 3.0, unit: '%' }
        ]
      };

      setData(mockData);
      setLoading(false);
    }, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const MetricCard = ({ icon: Icon, label, current, previous, trend, format = 'number' }: any) => {
    const isPositive = trend >= 0;
    const displayValue = format === 'currency' ? formatCurrency(current) : 
                        format === 'percentage' ? `${current}%` : 
                        current.toLocaleString();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-primary-50 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-1">{displayValue}</h3>
        <p className="text-sm text-neutral-600">{label}</p>
        <p className="text-xs text-neutral-500 mt-2">
          vs. previous period: {format === 'currency' ? formatCurrency(previous) : previous.toLocaleString()}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">LogiMind Analytics</h1>
          <p className="text-neutral-600 mt-2">Comprehensive insights and performance metrics</p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex gap-2">
          {(['7days', '30days', '90days', '1year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : range === '90days' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          label="Total Revenue"
          current={data.revenue.current}
          previous={data.revenue.previous}
          trend={data.revenue.trend}
          format="currency"
        />
        <MetricCard
          icon={ShoppingCart}
          label="Total Orders"
          current={data.orders.current}
          previous={data.orders.previous}
          trend={data.orders.trend}
        />
        <MetricCard
          icon={Users}
          label="Active Customers"
          current={data.customers.current}
          previous={data.customers.previous}
          trend={data.customers.trend}
        />
        <MetricCard
          icon={CheckCircle}
          label="Delivery Success Rate"
          current={data.deliveryRate.current}
          previous={data.deliveryRate.previous}
          trend={data.deliveryRate.trend}
          format="percentage"
        />
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            Revenue & Orders Trend
          </h2>
        </div>
        
        {/* Simple Bar Chart Visualization */}
        <div className="space-y-4">
          {data.monthlyRevenue.map((item, idx) => {
            const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenue));
            const revenueWidth = (item.revenue / maxRevenue) * 100;
            
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700 w-12">{item.month}</span>
                  <span className="text-neutral-600">{item.orders} orders</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                    style={{ width: `${revenueWidth}%` }}
                  >
                    <span className="text-xs font-medium text-white">{revenueWidth.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary-600" />
            Orders by Status
          </h2>
          
          <div className="space-y-4">
            {data.ordersByStatus.map((item, idx) => {
              const colors = [
                'bg-green-500',
                'bg-blue-500',
                'bg-amber-500',
                'bg-neutral-400'
              ];
              
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[idx]}`}></div>
                      <span className="text-sm font-medium text-neutral-700">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-neutral-900">{item.count}</span>
                      <span className="text-xs text-neutral-500 ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div
                      className={`${colors[idx]} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary-600" />
            Top Selling Products
          </h2>
          
          <div className="space-y-4">
            {data.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">#{idx + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout - Regions & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Regions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            Top Performing Regions
          </h2>
          
          <div className="space-y-3">
            {data.topRegions.map((region, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-neutral-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{region.region}</p>
                    <p className="text-xs text-neutral-500">{region.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">{formatCurrency(region.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary-600" />
            Performance Metrics
          </h2>
          
          <div className="space-y-4">
            {data.performanceMetrics.map((metric, idx) => {
              const progress = (metric.value / metric.target) * 100;
              const isAboveTarget = metric.value >= metric.target;
              const isBelowTarget = metric.metric === 'Return Rate' ? metric.value < metric.target : false;
              
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700">{metric.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900">
                        {metric.value}{metric.unit}
                      </span>
                      {(isAboveTarget || isBelowTarget) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress >= 100 ? 'bg-green-500' : progress >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-neutral-500">Target: {metric.target}{metric.unit}</span>
                    <span className="text-xs text-neutral-500">{progress.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights Banner */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary-600 p-3 rounded-lg">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">AI-Powered Insights</h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Revenue is up 15.9% compared to last period, with strong growth in industrial equipment sales.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Delivery success rate of 96.8% exceeds target. On-time delivery performance is excellent at 94.5%.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Average delivery time of 2.8 days is beating the 3-day target. Consider optimizing routes in Delhi NCR.</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Mumbai and Delhi NCR are your top markets. Consider expanding warehouse capacity in Bangalore.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
