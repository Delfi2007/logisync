import { useState } from 'react';
import { Cloud, TrendingDown, Target, IndianRupee, Leaf, ArrowRight, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

// Mock data for monthly emissions
const monthlyEmissions = [
  { month: 'Jan', baseline: 320, actual: 245, reduced: 75, target: 250 },
  { month: 'Feb', baseline: 310, actual: 228, reduced: 82, target: 240 },
  { month: 'Mar', baseline: 330, actual: 242, reduced: 88, target: 245 },
  { month: 'Apr', baseline: 315, actual: 218, reduced: 97, target: 235 },
  { month: 'May', baseline: 325, actual: 225, reduced: 100, target: 240 },
  { month: 'Jun', baseline: 340, actual: 234, reduced: 106, target: 250 },
];

const routeCarbonData = [
  {
    route: 'RT-001',
    name: 'Metro Area Distribution',
    distance: '145 km',
    co2Standard: '42 kg',
    co2Green: '13 kg',
    saved: '29 kg',
    reduction: '69%',
    method: 'EV Fleet',
    status: 'active'
  },
  {
    route: 'RT-002',
    name: 'Industrial Zone Delivery',
    distance: '98 km',
    co2Standard: '28 kg',
    co2Green: '9 kg',
    saved: '19 kg',
    reduction: '68%',
    method: 'Optimized Route',
    status: 'active'
  },
  {
    route: 'RT-003',
    name: 'Suburban Express',
    distance: '187 km',
    co2Standard: '54 kg',
    co2Green: '20 kg',
    saved: '34 kg',
    reduction: '63%',
    method: 'EV + Optimization',
    status: 'active'
  },
  {
    route: 'RT-004',
    name: 'City Center Loop',
    distance: '76 km',
    co2Standard: '22 kg',
    co2Green: '7 kg',
    saved: '15 kg',
    reduction: '68%',
    method: 'EV Fleet',
    status: 'completed'
  }
];

export default function CarbonFootprint() {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <Cloud className="w-8 h-8 text-emerald-600" />
            Carbon Footprint Tracking
          </h1>
          <p className="text-neutral-600 mt-2">Real-time CO₂ monitoring with 30% reduction achieved across all routes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('3months')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === '3months' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimeRange('6months')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === '6months' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeRange('1year')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === '1year' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Carbon Tracking Info Banner */}
      <div className="card p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">Carbon Tracking System Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Real-time CO₂ monitoring across all routes with automated carbon accounting. 
              Target: <span className="font-bold text-emerald-600">Net Zero by 2030</span> (aligned with Paris Agreement)
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>✓ ISO 14064 Certified</span>
              <span>✓ UN SDG Goals 7, 9, 13</span>
              <span>✓ 847 tons CO₂ saved this year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total CO₂ Emitted</span>
            <Cloud className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">2,450 tons</div>
          <div className="text-xs text-green-600 mt-1">↓ 30% vs last year</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">CO₂ Reduced</span>
            <TrendingDown className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-600">847 tons</div>
          <div className="text-xs text-neutral-500 mt-1">Via route optimization</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Carbon Target</span>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">85%</div>
          <div className="text-xs text-blue-600 mt-1">On track for 2030</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Carbon Credits</span>
            <IndianRupee className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">₹12.4L</div>
          <div className="text-xs text-neutral-500 mt-1">Offset purchased</div>
        </div>
      </div>

      {/* Emissions Trend Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">CO₂ Emissions Trend</h3>
            <p className="text-sm text-neutral-600 mt-1">Monthly emissions vs baseline and target</p>
          </div>
          <BarChart3 className="w-5 h-5 text-neutral-400" />
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyEmissions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'CO₂ (tons)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="baseline" 
              stroke="#9ca3af" 
              strokeWidth={2} 
              name="Baseline"
              dot={{ fill: '#9ca3af', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#10b981" 
              strokeWidth={2} 
              name="Actual"
              dot={{ fill: '#10b981', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              name="Target"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
              <span className="text-xs text-neutral-600">Baseline</span>
            </div>
            <div className="text-sm font-bold text-neutral-900">1,965 tons</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-neutral-600">Actual</span>
            </div>
            <div className="text-sm font-bold text-emerald-600">1,392 tons</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-neutral-600">Target</span>
            </div>
            <div className="text-sm font-bold text-blue-600">1,460 tons</div>
          </div>
        </div>
      </div>

      {/* Route-by-Route Carbon Analysis */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Route-by-Route Carbon Analysis</h3>
            <p className="text-sm text-neutral-600 mt-1">Detailed CO₂ breakdown per delivery route</p>
          </div>
          <Link 
            to="/sustainability/green-routing"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View Green Routing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Route</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Distance</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Standard CO₂</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Green CO₂</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Saved</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Method</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {routeCarbonData.map((route) => (
                <tr key={route.route} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm font-medium text-neutral-900">{route.route}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-neutral-700">{route.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-neutral-700">{route.distance}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-red-600 font-medium">{route.co2Standard}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-emerald-600 font-medium">{route.co2Green}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="text-sm text-emerald-600 font-bold">{route.saved}</span>
                      <span className="text-xs text-neutral-500 ml-1">({route.reduction})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      {route.method}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      route.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {route.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <div className="flex items-start gap-3">
            <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Environmental Impact</h4>
              <p className="text-xs text-neutral-600 mt-1">
                These CO₂ reductions are equivalent to:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-neutral-600">
                <li>• <span className="font-medium">38 trees planted</span> and grown for 10 years</li>
                <li>• <span className="font-medium">9,200 km</span> driven by an average gasoline car removed</li>
                <li>• <span className="font-medium">97 tons</span> of waste recycled instead of landfilled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/sustainability/green-routing"
          className="card p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-emerald-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-neutral-900">Green Route Optimization</h4>
            <ArrowRight className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm text-neutral-600">
            View EV-first routing strategies and charging station network
          </p>
        </Link>

        <Link 
          to="/sustainability/esg-reporting"
          className="card p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-emerald-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-neutral-900">ESG Reporting</h4>
            <ArrowRight className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm text-neutral-600">
            Complete sustainability scorecard and UN SDG goal alignment
          </p>
        </Link>
      </div>
    </div>
  );
}
