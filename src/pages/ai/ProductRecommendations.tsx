import { useState } from 'react';
import { Heart, Star, ShoppingCart, TrendingUp, Sparkles, Package } from 'lucide-react';

const mockRecommendations = [
  {
    id: 'P-1024',
    name: 'Wireless Ergonomic Keyboard',
    category: 'Electronics',
    price: '$89.99',
    matchScore: 94,
    reason: 'Based on your recent laptop purchases',
    expectedRevenue: '$2,700',
    similarBuyers: 127,
    image: '⌨️'
  },
  {
    id: 'P-2156',
    name: 'USB-C Hub Multi-Port Adapter',
    category: 'Accessories',
    price: '$45.99',
    matchScore: 91,
    reason: 'Frequently bought together with laptops',
    expectedRevenue: '$1,840',
    similarBuyers: 98,
    image: '🔌'
  },
  {
    id: 'P-3298',
    name: 'Laptop Stand Adjustable',
    category: 'Office',
    price: '$35.99',
    matchScore: 88,
    reason: 'Customers who bought laptops also liked',
    expectedRevenue: '$1,440',
    similarBuyers: 76,
    image: '🖥️'
  },
  {
    id: 'P-4512',
    name: 'Wireless Mouse Pro',
    category: 'Electronics',
    price: '$29.99',
    matchScore: 85,
    reason: 'Complements your keyboard selection',
    expectedRevenue: '$1,200',
    similarBuyers: 65,
    image: '🖱️'
  }
];

const customerSegments = [
  { name: 'Tech Enthusiasts', size: 342, avgOrder: '$458', recommendations: 12 },
  { name: 'Office Managers', size: 189, avgOrder: '$1,247', recommendations: 8 },
  { name: 'Small Businesses', size: 156, avgOrder: '$892', recommendations: 15 },
  { name: 'Enterprise Buyers', size: 78, avgOrder: '$3,450', recommendations: 6 }
];

export default function ProductRecommendations() {
  const [selectedCustomer, setSelectedCustomer] = useState('Tech Enthusiasts');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
          <Heart className="w-8 h-8 text-pink-600" />
          AI Product Recommendations
        </h1>
        <p className="text-neutral-600 mt-2">Collaborative filtering + content-based recommendations for personalized upselling</p>
      </div>

      {/* AI Model Info */}
      <div className="card p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">Hybrid Recommendation Engine Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Combining collaborative filtering (user behavior patterns) + content-based analysis (product attributes).
              Conversion rate: <span className="font-bold text-pink-600">28% higher</span> than manual recommendations
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Model: Matrix Factorization + Neural CF</span>
              <span>User profiles: 12,456</span>
              <span>Product catalog: 8,934 items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Conversion Rate</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">28%</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% vs baseline</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Avg Order Value</span>
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">$347</div>
          <div className="text-xs text-blue-600 mt-1">↑ $87 with recommendations</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Additional Revenue</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">$47.2k</div>
          <div className="text-xs text-purple-600 mt-1">From AI recommendations</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Active Campaigns</span>
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">24</div>
          <div className="text-xs text-orange-600 mt-1">Personalized campaigns</div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Customer Segments</h2>
        <div className="grid grid-cols-4 gap-4">
          {customerSegments.map((segment) => (
            <button
              key={segment.name}
              onClick={() => setSelectedCustomer(segment.name)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedCustomer === segment.name
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div className="font-bold text-neutral-900 mb-2">{segment.name}</div>
              <div className="space-y-1 text-sm text-neutral-600">
                <div>{segment.size} customers</div>
                <div className="font-medium text-green-600">{segment.avgOrder} avg</div>
                <div>{segment.recommendations} active recs</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Top Recommendations for {selectedCustomer}
        </h2>
        <div className="space-y-3">
          {mockRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg border-2 border-neutral-200 hover:border-pink-300 hover:bg-pink-50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{rec.image}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-900">{rec.name}</span>
                        <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600">{rec.id}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{rec.category}</span>
                      </div>
                      <div className="text-sm text-neutral-600 mt-1 italic">{rec.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-neutral-900">{rec.price}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="relative w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                          style={{ width: `${rec.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-900">{rec.matchScore}% match</span>
                    </div>
                    
                    <div className="text-sm text-neutral-600">
                      Expected revenue: <span className="font-bold text-green-600">{rec.expectedRevenue}</span>
                    </div>
                    
                    <div className="text-sm text-neutral-600">
                      {rec.similarBuyers} similar buyers
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium text-sm">
                    Create Campaign
                  </button>
                  <button className="px-4 py-2 bg-white text-neutral-700 border-2 border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Sell Bundles */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">AI-Generated Product Bundles</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
            <div className="font-bold text-neutral-900 mb-3">Tech Starter Bundle</div>
            <div className="space-y-2 text-sm text-neutral-700 mb-4">
              <div>✓ Laptop Pro 15"</div>
              <div>✓ Wireless Mouse Pro</div>
              <div>✓ USB-C Hub Adapter</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-neutral-500 line-through">$945</span>
                <span className="text-2xl font-bold text-purple-600 ml-2">$799</span>
              </div>
              <span className="text-sm font-medium text-green-600">Save $146</span>
            </div>
            <div className="text-xs text-neutral-600 mt-2">Conversion rate: 34%</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
            <div className="font-bold text-neutral-900 mb-3">Office Productivity Pack</div>
            <div className="space-y-2 text-sm text-neutral-700 mb-4">
              <div>✓ Ergonomic Keyboard</div>
              <div>✓ Laptop Stand</div>
              <div>✓ Monitor 27"</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-neutral-500 line-through">$625</span>
                <span className="text-2xl font-bold text-blue-600 ml-2">$529</span>
              </div>
              <span className="text-sm font-medium text-green-600">Save $96</span>
            </div>
            <div className="text-xs text-neutral-600 mt-2">Conversion rate: 29%</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Insights & Opportunities
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">High Potential:</span> Tech Enthusiasts show 94% match with wireless keyboards - campaign expected to generate $2,700 in revenue</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-pink-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Bundle Opportunity:</span> 87% of laptop buyers purchase accessories within 30 days - automated bundle recommendations increase AOV by $87</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Seasonal Pattern:</span> Office equipment demand rising (Q1 budget spending) - prioritize Office Managers segment for next 2 weeks</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Model Performance:</span> Recommendation conversion rate 28% higher than manual suggestions - generating $47.2k additional revenue this month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
