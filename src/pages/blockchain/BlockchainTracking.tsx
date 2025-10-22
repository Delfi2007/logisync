import { useState } from 'react';
import { Link as LinkIcon, Package, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const mockJourney = [
  {
    id: 1,
    stage: 'Manufacturing',
    location: 'Shenzhen Factory, China',
    timestamp: '2025-01-15 08:30:00',
    txHash: '0x7a8f3b2c1d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    status: 'completed',
    validator: 'Factory QC Station',
    details: 'Product manufactured and passed quality inspection'
  },
  {
    id: 2,
    stage: 'Warehouse Intake',
    location: 'Shanghai Distribution Center',
    timestamp: '2025-01-16 14:20:00',
    txHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    status: 'completed',
    validator: 'Warehouse Manager',
    details: 'Received and stored in climate-controlled zone'
  },
  {
    id: 3,
    stage: 'In Transit - Air',
    location: 'Shanghai → Los Angeles',
    timestamp: '2025-01-17 22:15:00',
    txHash: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
    status: 'completed',
    validator: 'Cargo Airlines Ltd.',
    details: 'Air freight shipment - temperature monitored'
  },
  {
    id: 4,
    stage: 'Customs Clearance',
    location: 'LAX Customs, USA',
    timestamp: '2025-01-18 16:45:00',
    txHash: '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
    status: 'completed',
    validator: 'US Customs Authority',
    details: 'Cleared customs - all documentation verified'
  },
  {
    id: 5,
    stage: 'Final Mile Delivery',
    location: 'En route to customer',
    timestamp: '2025-01-22 10:30:00',
    txHash: '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    status: 'in-progress',
    validator: 'Delivery Partner',
    details: 'Last-mile delivery in progress - ETA 2 hours'
  }
];

const blockchainStats = [
  { label: 'Total Transactions', value: '12,847', change: '+342 today' },
  { label: 'Active Products', value: '3,456', change: '100% tracked' },
  { label: 'Network Nodes', value: '127', change: 'Validators' },
  { label: 'Avg Confirmation', value: '2.3s', change: 'Block time' }
];

export default function BlockchainTracking() {
  const [selectedProduct] = useState('LAPTOP-PRO-15-SN847293');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
          <LinkIcon className="w-8 h-8 text-violet-600" />
          Blockchain Product Tracking
        </h1>
        <p className="text-neutral-600 mt-2">Ethereum-based immutable supply chain transparency with smart contract automation</p>
      </div>

      {/* Blockchain Network Info */}
      <div className="card p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <LinkIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">Ethereum Mainnet + Polygon L2</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Hybrid blockchain architecture - Ethereum for critical events + Polygon for cost-effective tracking.
              Gas optimization: <span className="font-bold text-violet-600">92% cost reduction</span> vs Ethereum-only
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Network: Ethereum + Polygon</span>
              <span>Smart Contract: ERC-721 (NFTs)</span>
              <span>Consensus: Proof of Stake</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {blockchainStats.map((stat, idx) => (
          <div key={idx} className="card p-6">
            <div className="text-sm text-neutral-600 mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
            <div className="text-xs text-violet-600 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Product Search */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Track Product Journey</h2>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={selectedProduct}
            readOnly
            className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-lg bg-neutral-50 font-mono text-sm"
            placeholder="Enter Product ID or Serial Number"
          />
          <button className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
            Track
          </button>
          <button className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium">
            Verify on Chain
          </button>
        </div>

        {/* Product Info Card */}
        <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg border-2 border-violet-200 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-neutral-900 mb-2">Laptop Pro 15"</div>
              <div className="flex gap-2 text-sm text-neutral-600">
                <span className="font-mono bg-white px-2 py-1 rounded border border-neutral-300">
                  SN: {selectedProduct}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                  ✓ Authentic
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-600 mb-1">NFT Token ID</div>
              <div className="font-mono text-lg font-bold text-violet-600">#8472</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Minted:</span>
              <span className="ml-2 font-medium">2025-01-15</span>
            </div>
            <div>
              <span className="text-neutral-500">Total Events:</span>
              <span className="ml-2 font-medium">5</span>
            </div>
            <div>
              <span className="text-neutral-500">Current Status:</span>
              <span className="ml-2 font-medium text-orange-600">In Transit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Supply Chain Journey</h2>
        <div className="space-y-4">
          {mockJourney.map((event, idx) => (
            <div key={event.id} className="relative">
              {/* Connector Line */}
              {idx < mockJourney.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-full bg-neutral-200"></div>
              )}
              
              <div className={`flex gap-4 p-4 rounded-lg border-2 ${
                event.status === 'completed' 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-orange-200 bg-orange-50'
              }`}>
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  event.status === 'completed' 
                    ? 'bg-green-600' 
                    : 'bg-orange-600'
                }`}>
                  {event.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Clock className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-neutral-900 text-lg">{event.stage}</div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-500">{event.timestamp}</div>
                      <div className={`text-xs px-2 py-1 rounded mt-1 font-medium ${
                        event.status === 'completed' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-orange-600 text-white'
                      }`}>
                        {event.status === 'completed' ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-neutral-700 mb-3">{event.details}</div>

                  {/* Blockchain Info */}
                  <div className="bg-white p-3 rounded border border-neutral-200">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-neutral-500">Tx Hash:</span>
                        <span className="ml-2 font-mono text-violet-600">{event.txHash.slice(0, 20)}...{event.txHash.slice(-10)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Validator:</span>
                        <span className="ml-2 font-medium">{event.validator}</span>
                      </div>
                      <button className="px-3 py-1 bg-violet-100 text-violet-700 rounded hover:bg-violet-200 transition-colors font-medium">
                        View on Chain ↗
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Contract Events */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Recent Smart Contract Events</h2>
        <div className="space-y-2">
          {[
            { event: 'ProductMinted', product: 'LAPTOP-PRO-15-SN847293', time: '7 days ago', gas: '0.002 ETH' },
            { event: 'LocationUpdated', product: 'LAPTOP-PRO-15-SN847293', time: '2 hours ago', gas: '0.0001 MATIC' },
            { event: 'OwnershipTransferred', product: 'MOUSE-WL-42-SN991823', time: '5 hours ago', gas: '0.003 ETH' },
            { event: 'QualityCheckPassed', product: 'CHARGER-USB-C-SN445678', time: '1 day ago', gas: '0.0001 MATIC' }
          ].map((evt, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded hover:bg-violet-50 transition-colors">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-violet-600" />
                <div>
                  <span className="font-medium text-neutral-900">{evt.event}</span>
                  <span className="text-sm text-neutral-600 ml-2">• {evt.product}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-neutral-500">{evt.time}</span>
                <span className="text-violet-600 font-mono">{evt.gas}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="card p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-violet-600" />
          Blockchain Benefits & Trust Metrics
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-violet-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Immutable Records:</span> All 12,847 transactions permanently recorded on Ethereum - cannot be altered or deleted (100% data integrity)</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Real-Time Transparency:</span> Customers verify product authenticity independently - reduced counterfeit claims by 94%</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Cost Efficiency:</span> Polygon L2 scaling reduces gas costs by 92% vs Ethereum-only ($0.01 per event vs $1.20)</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Smart Contract Automation:</span> Automatic ownership transfers and quality checks - 3x faster processing with zero human error</p>
          </div>
        </div>
      </div>
    </div>
  );
}
