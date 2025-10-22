import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  TrendingUp,
  Package,
  Zap,
  Shield,
  Award,
  Download,
  Eye,
  Users,
  DollarSign
} from 'lucide-react';

interface MarketplaceItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  downloads: number;
  vendor: string;
  featured: boolean;
  image: string;
  tags: string[];
}

interface MarketplaceStats {
  total_listings: number;
  featured_listings: number;
  total_vendors: number;
  avg_rating: number;
}

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price'>('popular');

  useEffect(() => {
    fetchMarketplaceData();
  }, [searchQuery, categoryFilter, sortBy]);

  const fetchMarketplaceData = () => {
    setLoading(true);
    
    setTimeout(() => {
      // STATIC MOCK DATA
      const mockItems: MarketplaceItem[] = [
        {
          id: 1,
          name: 'Advanced Route Optimizer',
          category: 'Transportation',
          description: 'AI-powered route optimization tool that reduces delivery times by 30% and fuel costs by 25%.',
          price: 29900,
          rating: 4.8,
          reviews: 156,
          downloads: 2340,
          vendor: 'LogiTech Solutions',
          featured: true,
          image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop',
          tags: ['AI', 'Route Planning', 'Cost Reduction']
        },
        {
          id: 2,
          name: 'Smart Warehouse Manager',
          category: 'Warehouse',
          description: 'Complete warehouse management system with real-time inventory tracking and automated reordering.',
          price: 34900,
          rating: 4.9,
          reviews: 203,
          downloads: 1890,
          vendor: 'WareHub Inc',
          featured: true,
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
          tags: ['Inventory', 'Automation', 'Analytics']
        },
        {
          id: 3,
          name: 'Blockchain Tracking Module',
          category: 'Technology',
          description: 'Integrate blockchain technology for transparent and immutable shipment tracking across the supply chain.',
          price: 49900,
          rating: 4.7,
          reviews: 89,
          downloads: 1450,
          vendor: 'ChainLogix',
          featured: true,
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
          tags: ['Blockchain', 'Security', 'Transparency']
        },
        {
          id: 4,
          name: 'Fleet Maintenance Tracker',
          category: 'Transportation',
          description: 'Predictive maintenance system that monitors vehicle health and schedules service automatically.',
          price: 24900,
          rating: 4.6,
          reviews: 124,
          downloads: 1680,
          vendor: 'FleetCare Pro',
          featured: false,
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
          tags: ['Maintenance', 'Fleet', 'Predictive']
        },
        {
          id: 5,
          name: 'Customer Portal Builder',
          category: 'Customer Service',
          description: 'White-label customer portal for order tracking, support tickets, and self-service management.',
          price: 19900,
          rating: 4.5,
          reviews: 167,
          downloads: 2120,
          vendor: 'PortalPro',
          featured: false,
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
          tags: ['Portal', 'Customer Service', 'White-label']
        },
        {
          id: 6,
          name: 'AI Demand Forecaster',
          category: 'Analytics',
          description: 'Machine learning model that predicts demand patterns with 95% accuracy for better inventory planning.',
          price: 39900,
          rating: 4.9,
          reviews: 142,
          downloads: 1560,
          vendor: 'PredictAI',
          featured: true,
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          tags: ['AI', 'Forecasting', 'Machine Learning']
        },
        {
          id: 7,
          name: 'Carbon Footprint Calculator',
          category: 'Sustainability',
          description: 'Calculate and reduce carbon emissions across your logistics operations with detailed reporting.',
          price: 14900,
          rating: 4.7,
          reviews: 98,
          downloads: 1340,
          vendor: 'EcoLogistics',
          featured: false,
          image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
          tags: ['Sustainability', 'Carbon', 'Reporting']
        },
        {
          id: 8,
          name: 'Multi-Carrier Integration',
          category: 'Integration',
          description: 'Connect with 50+ shipping carriers worldwide through a single unified API interface.',
          price: 27900,
          rating: 4.8,
          reviews: 211,
          downloads: 2890,
          vendor: 'CarrierConnect',
          featured: false,
          image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=300&fit=crop',
          tags: ['Integration', 'API', 'Shipping']
        },
        {
          id: 9,
          name: 'Real-Time Analytics Dashboard',
          category: 'Analytics',
          description: 'Comprehensive analytics dashboard with 50+ KPIs, custom reports, and predictive insights.',
          price: 32900,
          rating: 4.9,
          reviews: 178,
          downloads: 2240,
          vendor: 'DataViz Pro',
          featured: true,
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          tags: ['Analytics', 'Dashboard', 'Reporting']
        },
        {
          id: 10,
          name: 'IoT Sensor Network',
          category: 'Technology',
          description: 'Monitor temperature, humidity, and location of shipments in real-time with IoT sensors.',
          price: 44900,
          rating: 4.6,
          reviews: 76,
          downloads: 980,
          vendor: 'SensorNet',
          featured: false,
          image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=300&fit=crop',
          tags: ['IoT', 'Monitoring', 'Real-time']
        },
        {
          id: 11,
          name: 'Automated Invoice Generator',
          category: 'Finance',
          description: 'Generate, send, and track invoices automatically with payment gateway integration.',
          price: 17900,
          rating: 4.5,
          reviews: 143,
          downloads: 1890,
          vendor: 'InvoiceAuto',
          featured: false,
          image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
          tags: ['Finance', 'Invoicing', 'Automation']
        },
        {
          id: 12,
          name: 'Supplier Collaboration Hub',
          category: 'Procurement',
          description: 'Collaborate with suppliers in real-time, manage contracts, and track performance metrics.',
          price: 29900,
          rating: 4.7,
          reviews: 109,
          downloads: 1450,
          vendor: 'SupplyChain+',
          featured: false,
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
          tags: ['Procurement', 'Collaboration', 'Suppliers']
        }
      ];

      const mockStats: MarketplaceStats = {
        total_listings: 12,
        featured_listings: 5,
        total_vendors: 12,
        avg_rating: 4.7
      };

      // Apply filters
      let filtered = mockItems;

      if (searchQuery) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category === categoryFilter);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.price - b.price;
          case 'popular':
          default:
            return b.downloads - a.downloads;
        }
      });

      setItems(filtered);
      setStats(mockStats);
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

  const categories = ['all', 'Transportation', 'Warehouse', 'Technology', 'Analytics', 'Customer Service', 'Sustainability', 'Integration', 'Finance', 'Procurement'];

  const StatCard = ({ icon: Icon, label, value, bgColor, iconColor }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">LogiSphere Marketplace</h1>
        <p className="text-neutral-600 mt-2">Discover and integrate powerful logistics solutions</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Package}
            label="Total Listings"
            value={stats.total_listings}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={Award}
            label="Featured Products"
            value={stats.featured_listings}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            icon={Users}
            label="Trusted Vendors"
            value={stats.total_vendors}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={Star}
            label="Average Rating"
            value={stats.avg_rating.toFixed(1)}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-1">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-1">
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.featured && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Featured
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-500">{item.vendor}</p>
                </div>
              </div>

              <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Rating & Downloads */}
              <div className="flex items-center gap-3 mb-3 text-xs text-neutral-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{item.rating}</span>
                  <span>({item.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{item.downloads.toLocaleString()}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div>
                  <span className="text-lg font-bold text-neutral-900">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1 text-sm font-medium">
                    <ShoppingCart className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
          <Package className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No products found</h3>
          <p className="text-neutral-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
