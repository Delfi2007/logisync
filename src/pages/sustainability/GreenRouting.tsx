import { useState } from 'react';
import { Leaf, Truck, TrendingDown, Zap, MapPin, ArrowRight, Battery, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const greenRouteComparison = [
  {
    routeId: 'RT-001',
    name: 'Metro Distribution',
    regular: {
      distance: '145 km',
      time: '3h 45m',
      fuel: '18 L',
      co2: '42 kg',
      cost: '₹1,450'
    },
    green: {
      distance: '112 km',
      time: '3h 07m',
      fuel: '45 kWh',
      co2: '13 kg',
      cost: '₹420'
    },
    savings: {
      distance: '33 km (23%)',
      co2: '29 kg (69%)',
      cost: '₹1,030 (71%)',
      trees: '1.3 trees/day'
    },
    method: 'EV Fleet + Optimized Route',
    status: 'active'
  },
  {
    routeId: 'RT-002',
    name: 'Industrial Zone',
    regular: {
      distance: '98 km',
      time: '2h 30m',
      fuel: '12 L',
      co2: '28 kg',
      cost: '₹960'
    },
    green: {
      distance: '76 km',
      time: '2h 05m',
      fuel: '30 kWh',
      co2: '9 kg',
      cost: '₹280'
    },
    savings: {
      distance: '22 km (22%)',
      co2: '19 kg (68%)',
      cost: '₹680 (71%)',
      trees: '0.9 trees/day'
    },
    method: 'EV Fleet',
    status: 'active'
  }
];

const evChargingStations = [
  {
    id: 'CS-001',
    location: 'Mumbai Hub - Andheri East',
    address: 'MIDC Industrial Area, Andheri (E)',
    type: 'Fast Charging (150kW)',
    status: 'available',
    slots: '4/6 available',
    nextAvailable: 'Now',
    avgWaitTime: '0 min',
    cost: '₹12/kWh'
  },
  {
    id: 'CS-002',
    location: 'Pune Distribution Center',
    address: 'Chakan Industrial Zone, Pune',
    type: 'Rapid Charging (350kW)',
    status: 'available',
    slots: '2/4 available',
    nextAvailable: 'Now',
    avgWaitTime: '0 min',
    cost: '₹15/kWh'
  },
  {
    id: 'CS-003',
    location: 'Bangalore Tech Hub',
    address: 'Electronic City Phase 1',
    type: 'Fast Charging (150kW)',
    status: 'occupied',
    slots: '0/4 available',
    nextAvailable: '15 min',
    avgWaitTime: '12 min',
    cost: '₹13/kWh'
  },
  {
    id: 'CS-004',
    location: 'Delhi NCR Warehouse',
    address: 'IMT Manesar, Gurugram',
    type: 'Ultra Fast (350kW)',
    status: 'available',
    slots: '3/6 available',
    nextAvailable: 'Now',
    avgWaitTime: '0 min',
    cost: '₹16/kWh'
  },
  {
    id: 'CS-005',
    location: 'Hyderabad Logistics Park',
    address: 'Genome Valley, Shamirpet',
    type: 'Fast Charging (150kW)',
    status: 'maintenance',
    slots: '0/4 available',
    nextAvailable: '2 hours',
    avgWaitTime: 'N/A',
    cost: '₹12/kWh'
  }
];

export default function GreenRouting() {
  const [selectedRoute, setSelectedRoute] = useState(greenRouteComparison[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
          <Leaf className="w-8 h-8 text-green-600" />
          Green Route Optimization
        </h1>
        <p className="text-neutral-600 mt-2">EV-first routing with 68% average emission reduction across fleet</p>
      </div>

      {/* Green Routing Info Banner */}
      <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">EV Fleet Integration Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              AI-powered routing prioritizes electric vehicles and optimizes charging schedules. 
              Fleet electrification: <span className="font-bold text-green-600">68% complete</span> (target: 100% by 2028)
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>✓ 145 EVs in active fleet</span>
              <span>✓ 18 charging stations</span>
              <span>✓ 97% uptime rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Avg CO₂ Reduction</span>
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">68%</div>
          <div className="text-xs text-neutral-500 mt-1">Per route</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Cost Savings</span>
            <TrendingDown className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">71%</div>
          <div className="text-xs text-blue-600 mt-1">Fuel costs reduced</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">EV Fleet</span>
            <Battery className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">145</div>
          <div className="text-xs text-emerald-600 mt-1">Active vehicles</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Charging Stations</span>
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">18</div>
          <div className="text-xs text-neutral-500 mt-1">Across India</div>
        </div>
      </div>

      {/* Route Comparison Selector */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Select Route to Compare</h3>
        <div className="flex gap-2">
          {greenRouteComparison.map((route) => (
            <button
              key={route.routeId}
              onClick={() => setSelectedRoute(route)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRoute.routeId === route.routeId
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {route.routeId} - {route.name}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Route Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Regular Route */}
        <div className="card p-6 border-2 border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-neutral-500" />
            <h3 className="font-bold text-neutral-900">Regular Route</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Distance</span>
              <span className="font-medium text-neutral-900">{selectedRoute.regular.distance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Time</span>
              <span className="font-medium text-neutral-900">{selectedRoute.regular.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Fuel</span>
              <span className="font-medium text-neutral-900">{selectedRoute.regular.fuel}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-neutral-600">CO₂ Emissions</span>
              <span className="font-bold text-red-600">{selectedRoute.regular.co2}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Cost</span>
              <span className="font-medium text-neutral-900">{selectedRoute.regular.cost}</span>
            </div>
          </div>
        </div>

        {/* Green Route */}
        <div className="card p-6 border-2 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-900">Green Route</h3>
            <span className="ml-auto text-xs bg-green-600 text-white px-2 py-1 rounded-full">
              Recommended
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Distance</span>
              <span className="font-medium text-neutral-900">{selectedRoute.green.distance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Time</span>
              <span className="font-medium text-neutral-900">{selectedRoute.green.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Energy</span>
              <span className="font-medium text-neutral-900">{selectedRoute.green.fuel}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-neutral-600">CO₂ Emissions</span>
              <span className="font-bold text-green-600">{selectedRoute.green.co2}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Cost</span>
              <span className="font-medium text-neutral-900">{selectedRoute.green.cost}</span>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="card p-6 border-2 border-emerald-200 bg-emerald-50">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-emerald-900">Savings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Distance</span>
              <span className="font-medium text-emerald-600">↓ {selectedRoute.savings.distance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Method</span>
              <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">
                {selectedRoute.method}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-neutral-600">CO₂ Saved</span>
              <span className="font-bold text-emerald-600">↓ {selectedRoute.savings.co2}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Cost Saved</span>
              <span className="font-bold text-emerald-600">↓ {selectedRoute.savings.cost}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-neutral-600">Tree Equivalent</span>
              <span className="font-medium text-green-700">{selectedRoute.savings.trees}</span>
            </div>
          </div>
        </div>
      </div>

      {/* EV Charging Station Network */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">EV Charging Station Network</h3>
            <p className="text-sm text-neutral-600 mt-1">Real-time availability across 18 locations in India</p>
          </div>
          <MapPin className="w-5 h-5 text-neutral-400" />
        </div>

        <div className="space-y-3">
          {evChargingStations.map((station) => (
            <div 
              key={station.id} 
              className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-neutral-900">{station.location}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      station.status === 'available' 
                        ? 'bg-green-100 text-green-700'
                        : station.status === 'occupied'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {station.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-2">{station.address}</p>
                  <div className="flex gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {station.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Battery className="w-3 h-3" />
                      {station.slots}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Wait: {station.avgWaitTime}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-neutral-900">{station.cost}</div>
                  <div className="text-xs text-neutral-500">Charging cost</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Green Routing Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">68% Lower Emissions</h4>
              <p className="text-xs text-neutral-600 mt-1">
                EV fleet reduces CO₂ emissions by an average of 68% compared to diesel vehicles
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">71% Cost Savings</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Electric vehicles reduce fuel costs by 71% with optimized charging schedules
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">Smart Charging</h4>
              <p className="text-xs text-neutral-600 mt-1">
                AI optimizes charging times during off-peak hours for 40% lower electricity costs
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">18 Charging Stations</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Strategic locations ensure 100% coverage with average 15-minute charging stops
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/sustainability/carbon-footprint"
          className="card p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-neutral-900">Carbon Footprint Tracking</h4>
            <ArrowRight className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-neutral-600">
            View detailed CO₂ emissions and reduction metrics
          </p>
        </Link>

        <Link 
          to="/sustainability/esg-reporting"
          className="card p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-neutral-900">ESG Reporting</h4>
            <ArrowRight className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-neutral-600">
            Complete sustainability scorecard and UN SDG alignment
          </p>
        </Link>
      </div>
    </div>
  );
}
