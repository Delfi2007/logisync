import { useState } from 'react';
import { MapPin, Truck, Clock, TrendingDown, Zap, Route } from 'lucide-react';

const mockRoutes = [
  {
    id: 'RT-001',
    name: 'Metro Area Distribution',
    stops: 12,
    distance: '145 km',
    optimized: '112 km',
    timeSaved: '38 min',
    fuelSaved: '12.5 L',
    costSaved: '$42',
    status: 'active',
    co2Reduced: '29 kg'
  },
  {
    id: 'RT-002',
    name: 'Industrial Zone Delivery',
    stops: 8,
    distance: '98 km',
    optimized: '76 km',
    timeSaved: '25 min',
    fuelSaved: '8.3 L',
    costSaved: '$28',
    status: 'active',
    co2Reduced: '19 kg'
  },
  {
    id: 'RT-003',
    name: 'Suburban Express',
    stops: 15,
    distance: '187 km',
    optimized: '156 km',
    timeSaved: '42 min',
    fuelSaved: '14.8 L',
    costSaved: '$51',
    status: 'pending',
    co2Reduced: '34 kg'
  }
];

const trafficFactors = [
  { time: 'Morning Rush', multiplier: 1.45, recommendation: 'Avoid 7-9 AM' },
  { time: 'Midday', multiplier: 1.0, recommendation: 'Optimal window' },
  { time: 'Evening Rush', multiplier: 1.55, recommendation: 'Avoid 5-7 PM' },
  { time: 'Night', multiplier: 0.85, recommendation: 'Best for long haul' }
];

export default function RouteOptimization() {
  const [selectedRoute, setSelectedRoute] = useState(mockRoutes[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
          <Route className="w-8 h-8 text-blue-600" />
          AI Route Optimization
        </h1>
        <p className="text-neutral-600 mt-2">Reinforcement Learning for real-time routing with traffic & weather integration</p>
      </div>

      {/* AI Model Info */}
      <div className="card p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">Reinforcement Learning Model Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Deep Q-Network (DQN) continuously learning from real traffic patterns, weather conditions, and delivery outcomes.
              Average route efficiency: <span className="font-bold text-blue-600">23% improvement</span>
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Live traffic integration: ✓</span>
              <span>Weather API: Active</span>
              <span>Learning episodes: 47,231</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Distance Saved</span>
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">748 km</div>
          <div className="text-xs text-green-600 mt-1">This week</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Time Saved</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">24.5 hrs</div>
          <div className="text-xs text-blue-600 mt-1">Across all routes</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Fuel Cost Saved</span>
            <TrendingDown className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">$2,847</div>
          <div className="text-xs text-purple-600 mt-1">23% reduction</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">CO₂ Reduced</span>
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">892 kg</div>
          <div className="text-xs text-green-600 mt-1">Environmental impact</div>
        </div>
      </div>

      {/* Active Routes */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Optimized Routes Today
        </h2>
        <div className="space-y-3">
          {mockRoutes.map((route) => (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRoute.id === route.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-neutral-900">{route.name}</span>
                    <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600">{route.id}</span>
                    {route.status === 'active' && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Stops:</span>
                      <span className="ml-2 font-medium text-neutral-900">{route.stops}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Original:</span>
                      <span className="ml-2 font-medium text-red-600 line-through">{route.distance}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Optimized:</span>
                      <span className="ml-2 font-medium text-green-600">{route.optimized}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Saved:</span>
                      <span className="ml-2 font-medium text-blue-600">{route.timeSaved}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{route.costSaved}</div>
                  <div className="text-xs text-neutral-500">Cost saved</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Route Details */}
      {selectedRoute && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Route Details - {selectedRoute.name}</h2>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-neutral-600 mb-1">Distance Reduction</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(((parseInt(selectedRoute.distance) - parseInt(selectedRoute.optimized)) / parseInt(selectedRoute.distance)) * 100)}%
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {parseInt(selectedRoute.distance) - parseInt(selectedRoute.optimized)} km saved
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-neutral-600 mb-1">Fuel Savings</div>
              <div className="text-2xl font-bold text-blue-600">{selectedRoute.fuelSaved}</div>
              <div className="text-xs text-neutral-500 mt-1">{selectedRoute.costSaved} cost reduction</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm text-neutral-600 mb-1">CO₂ Reduced</div>
              <div className="text-2xl font-bold text-purple-600">{selectedRoute.co2Reduced}</div>
              <div className="text-xs text-neutral-500 mt-1">Environmental benefit</div>
            </div>
          </div>

          {/* Mock Map Placeholder */}
          <div className="bg-neutral-100 rounded-lg p-8 text-center mb-4">
            <MapPin className="w-16 h-16 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium">Interactive Route Map</p>
            <p className="text-sm text-neutral-500 mt-1">Real-time visualization with traffic overlay</p>
            <div className="flex gap-2 justify-center mt-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-neutral-600">Start</span>
              <div className="w-8 border-t-2 border-dashed border-blue-500 mt-1.5"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-neutral-600">Stops ({selectedRoute.stops})</span>
              <div className="w-8 border-t-2 border-dashed border-blue-500 mt-1.5"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-neutral-600">End</span>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Intelligence */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Real-Time Traffic Intelligence</h2>
        <div className="space-y-3">
          {trafficFactors.map((factor, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <div className="font-medium text-neutral-900">{factor.time}</div>
                <div className="text-sm text-neutral-600 mt-1">{factor.recommendation}</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  factor.multiplier > 1.2 ? 'text-red-600' : factor.multiplier < 1 ? 'text-green-600' : 'text-neutral-900'
                }`}>
                  {factor.multiplier}x
                </div>
                <div className="text-xs text-neutral-500">Traffic factor</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-600" />
          AI Insights & Recommendations
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-cyan-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Weather Alert:</span> Light rain expected 2-4 PM - adding 15% buffer time to afternoon routes automatically</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Pattern Detected:</span> Tuesday deliveries to Industrial Zone are 18% faster when scheduled before 11 AM</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Optimization Opportunity:</span> Combining RT-001 and RT-003 stops could save additional 23 km ($31 fuel savings)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
