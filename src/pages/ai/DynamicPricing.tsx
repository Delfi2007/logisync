import { useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Zap, BarChart3 } from 'lucide-react';

const mockPricingSuggestions = [
  {
    id: 'P-1024',
    name: 'Laptop Pro 15"',
    currentPrice: '$1,299',
    suggestedPrice: '$1,399',
    expectedChange: '+7.7%',
    reasoning: 'High demand + low competitor stock',
    confidence: 94,
    revenueImpact: '+$12,400',
    elasticity: -0.35
  },
  {
    id: 'P-2156',
    name: 'Wireless Mouse',
    currentPrice: '$29.99',
    suggestedPrice: '$24.99',
    expectedChange: '-16.7%',
    reasoning: 'Excess inventory + price competition',
    confidence: 88,
    revenueImpact: '+$2,100',
    elasticity: -1.2
  },
  {
    id: 'P-3298',
    name: 'USB-C Charger',
    currentPrice: '$45.99',
    suggestedPrice: '$49.99',
    expectedChange: '+8.7%',
    reasoning: 'Premium positioning opportunity',
    confidence: 91,
    revenueImpact: '+$3,800',
    elasticity: -0.42
  },
  {
    id: 'P-4512',
    name: 'Monitor 27"',
    currentPrice: '$349',
    suggestedPrice: '$329',
    expectedChange: '-5.7%',
    reasoning: 'Clear slow-moving stock',
    confidence: 86,
    revenueImpact: '+$5,200',
    elasticity: -0.95
  }
];

const marketFactors = [
  { factor: 'Competitor Pricing', impact: 'High', status: '3% below avg', trend: 'favorable' },
  { factor: 'Demand Elasticity', impact: 'Medium', status: '-0.65 avg', trend: 'stable' },
  { factor: 'Inventory Levels', impact: 'High', status: '78% stocked', trend: 'healthy' },
  { factor: 'Seasonal Trends', impact: 'Medium', status: 'Peak season', trend: 'favorable' }
];

export default function DynamicPricing() {
  const [optimizationMode, setOptimizationMode] = useState('revenue');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            AI Dynamic Pricing
          </h1>
          <p className="text-neutral-600 mt-2">Reinforcement learning for real-time price optimization based on market conditions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOptimizationMode('revenue')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              optimizationMode === 'revenue' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Max Revenue
          </button>
          <button
            onClick={() => setOptimizationMode('profit')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              optimizationMode === 'profit' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Max Profit
          </button>
          <button
            onClick={() => setOptimizationMode('market')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              optimizationMode === 'market' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Market Share
          </button>
        </div>
      </div>

      {/* AI Model Info */}
      <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">Reinforcement Learning Pricing Engine</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Multi-armed bandit algorithm learning optimal price points through A/B testing and market feedback.
              Revenue improvement: <span className="font-bold text-green-600">18.5%</span> vs static pricing
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Algorithm: Thompson Sampling</span>
              <span>Live experiments: 127</span>
              <span>Competitor tracking: 34 sources</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Revenue Increase</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">18.5%</div>
          <div className="text-xs text-green-600 mt-1">+$73.2k this month</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Avg Price Elasticity</span>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">-0.65</div>
          <div className="text-xs text-blue-600 mt-1">Healthy demand response</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Active Price Tests</span>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">127</div>
          <div className="text-xs text-purple-600 mt-1">Real-time experiments</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Price Updates</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">34</div>
          <div className="text-xs text-orange-600 mt-1">Recommendations pending</div>
        </div>
      </div>

      {/* Pricing Recommendations */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          AI Pricing Recommendations ({optimizationMode.charAt(0).toUpperCase() + optimizationMode.slice(1)} Optimization)
        </h2>
        <div className="space-y-3">
          {mockPricingSuggestions.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border-2 border-neutral-200 hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-neutral-900">{item.name}</span>
                    <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600">{item.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.expectedChange.startsWith('+') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.expectedChange}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600 italic">{item.reasoning}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-500 line-through">{item.currentPrice}</div>
                  <div className="text-2xl font-bold text-green-600">{item.suggestedPrice}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="p-3 bg-neutral-50 rounded">
                  <div className="text-xs text-neutral-600 mb-1">Confidence</div>
                  <div className="text-lg font-bold text-neutral-900">{item.confidence}%</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded">
                  <div className="text-xs text-neutral-600 mb-1">Revenue Impact</div>
                  <div className="text-lg font-bold text-green-600">{item.revenueImpact}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded">
                  <div className="text-xs text-neutral-600 mb-1">Elasticity</div>
                  <div className="text-lg font-bold text-blue-600">{item.elasticity}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded">
                  <div className="text-xs text-neutral-600 mb-1">Expected Demand</div>
                  <div className={`text-lg font-bold ${
                    item.expectedChange.startsWith('+') ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {item.expectedChange.startsWith('+') ? '↓ 3%' : '↑ 12%'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  Apply Price Change
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Run A/B Test (7 days)
                </button>
                <button className="px-4 py-2 bg-white text-neutral-700 border-2 border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
                  View Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Factors */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Market Intelligence Factors</h2>
        <div className="space-y-3">
          {marketFactors.map((factor, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-neutral-900">{factor.factor}</div>
                <div className="text-sm text-neutral-600 mt-1">{factor.status}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  factor.impact === 'High' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {factor.impact} Impact
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  factor.trend === 'favorable' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {factor.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Pricing */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Competitor Price Tracking</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-neutral-600 mb-2">Competitor A</div>
            <div className="text-2xl font-bold text-blue-600">+5%</div>
            <div className="text-xs text-neutral-500 mt-1">Above our average</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-neutral-600 mb-2">Competitor B</div>
            <div className="text-2xl font-bold text-green-600">-3%</div>
            <div className="text-xs text-neutral-500 mt-1">Below our average</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm text-neutral-600 mb-2">Market Average</div>
            <div className="text-2xl font-bold text-purple-600">$0.98</div>
            <div className="text-xs text-neutral-500 mt-1">Per unit comparison</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-600" />
          AI Insights & Strategy Recommendations
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Premium Opportunity:</span> Laptop Pro 15" can support 7.7% price increase - low competitor stock + high demand signals (94% confidence, +$12.4k revenue)</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Clearance Strategy:</span> Monitor 27" price reduction to $329 will accelerate inventory turnover by 35% (+$5.2k total revenue vs holding cost)</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Elasticity Insight:</span> Wireless Mouse shows -1.2 elasticity (elastic) - small price cuts drive large volume increases (optimal at $24.99)</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Seasonal Timing:</span> Peak Q1 budget spending detected - maintain premium positioning for next 3 weeks before adjusting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
