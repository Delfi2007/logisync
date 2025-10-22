import { useState } from 'react';
import { TrendingUp, Calendar, Package, AlertCircle, Sparkles, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock forecast data
const mockForecastData = [
  { date: 'Week 1', actual: 245, predicted: 240, confidence: 95 },
  { date: 'Week 2', actual: 280, predicted: 275, confidence: 94 },
  { date: 'Week 3', actual: 310, predicted: 315, confidence: 93 },
  { date: 'Week 4', actual: 0, predicted: 340, confidence: 92 },
  { date: 'Week 5', actual: 0, predicted: 365, confidence: 90 },
  { date: 'Week 6', actual: 0, predicted: 390, confidence: 88 },
  { date: 'Week 7', actual: 0, predicted: 410, confidence: 85 },
];

const topProducts = [
  { name: 'Laptop Pro 15"', currentStock: 45, predicted: 78, trend: 'up', confidence: 94 },
  { name: 'Wireless Mouse', currentStock: 230, predicted: 310, trend: 'up', confidence: 92 },
  { name: 'USB-C Charger', currentStock: 120, predicted: 95, trend: 'down', confidence: 88 },
  { name: 'Monitor 27"', currentStock: 34, predicted: 52, trend: 'up', confidence: 91 },
];

export default function DemandForecasting() {
  const [timeHorizon, setTimeHorizon] = useState('7days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI Demand Forecasting
          </h1>
          <p className="text-neutral-600 mt-2">Graph Neural Network powered demand prediction with 30% higher accuracy</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeHorizon('7days')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeHorizon === '7days' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeHorizon('30days')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeHorizon === '30days' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeHorizon('90days')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeHorizon === '90days' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* AI Model Info Banner */}
      <div className="card p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">GNN-Powered Predictions Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Using Graph Neural Networks to analyze product relationships, seasonal patterns, and network effects.
              Model accuracy: <span className="font-bold text-purple-600">92.3%</span> (30% better than traditional methods)
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Last trained: 2 hours ago</span>
              <span>Training data: 18 months</span>
              <span>Network nodes: 1,247 products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Forecast Accuracy</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">92.3%</div>
          <div className="text-xs text-green-600 mt-1">↑ 8.5% vs last month</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Stockout Prevention</span>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">95%</div>
          <div className="text-xs text-blue-600 mt-1">37 prevented this week</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Overstock Reduction</span>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">28%</div>
          <div className="text-xs text-purple-600 mt-1">$45k saved this month</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Reorder Alerts</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">12</div>
          <div className="text-xs text-orange-600 mt-1">Action needed this week</div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Demand Forecast - Next 7 Weeks
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockForecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="Actual Demand"
              dot={{ fill: '#8b5cf6', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#3b82f6" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="AI Prediction"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
            <span className="text-neutral-600">Actual Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-blue-600 rounded"></div>
            <span className="text-neutral-600">AI Predicted (GNN Model)</span>
          </div>
        </div>
      </div>

      {/* Top Products Forecast */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">High-Priority Products - Reorder Recommendations</h2>
        <div className="space-y-3">
          {topProducts.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-neutral-900">{product.name}</div>
                <div className="text-sm text-neutral-600 mt-1">
                  Current: <span className="font-medium">{product.currentStock}</span> units
                  <span className="mx-2">→</span>
                  Predicted: <span className="font-medium">{product.predicted}</span> units (7 days)
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-neutral-900">
                    {product.trend === 'up' ? '+' : '-'}
                    {Math.abs(product.predicted - product.currentStock)} units
                  </div>
                  <div className="text-xs text-neutral-500">
                    {product.confidence}% confidence
                  </div>
                </div>
                <TrendingUp className={`w-5 h-5 ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                {product.predicted > product.currentStock * 1.5 && (
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    Reorder Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          AI Insights & Recommendations
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Seasonal Spike Detected:</span> Electronics demand expected to increase 45% in next 2 weeks (holiday season pattern)</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Network Effect:</span> Laptop sales correlate with mouse/charger demand (0.89 correlation) - consider bundle reorders</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Cost Optimization:</span> Reordering 230 units now vs. emergency orders will save $3,400 (bulk discount + no expedited shipping)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
