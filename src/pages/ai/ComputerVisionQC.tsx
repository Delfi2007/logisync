import { useState } from 'react';
import { Camera, CheckCircle, XCircle, AlertTriangle, Eye, Sparkles } from 'lucide-react';

const mockInspections = [
  {
    id: 'INS-2401',
    product: 'Laptop Pro 15"',
    batch: 'BATCH-8821',
    timestamp: '2025-01-22 14:45:23',
    status: 'passed',
    confidence: 98.5,
    defects: [],
    imageUrl: '💻'
  },
  {
    id: 'INS-2402',
    product: 'Wireless Mouse',
    batch: 'BATCH-8822',
    timestamp: '2025-01-22 14:47:15',
    status: 'failed',
    confidence: 96.2,
    defects: ['Surface scratch detected', 'Color variance 15%'],
    imageUrl: '🖱️'
  },
  {
    id: 'INS-2403',
    product: 'USB-C Charger',
    batch: 'BATCH-8823',
    timestamp: '2025-01-22 14:49:08',
    status: 'warning',
    confidence: 92.1,
    defects: ['Minor discoloration'],
    imageUrl: '🔌'
  },
  {
    id: 'INS-2404',
    product: 'Monitor 27"',
    batch: 'BATCH-8824',
    timestamp: '2025-01-22 14:51:42',
    status: 'passed',
    confidence: 99.1,
    defects: [],
    imageUrl: '🖥️'
  }
];

const defectCategories = [
  { type: 'Surface Defects', detected: 12, rate: '2.4%', trend: 'down' },
  { type: 'Dimensional Variance', detected: 3, rate: '0.6%', trend: 'stable' },
  { type: 'Color Inconsistency', detected: 8, rate: '1.6%', trend: 'down' },
  { type: 'Assembly Errors', detected: 1, rate: '0.2%', trend: 'down' }
];

export default function ComputerVisionQC() {
  const [viewMode, setViewMode] = useState('realtime');

  const passedCount = mockInspections.filter(i => i.status === 'passed').length;
  const failedCount = mockInspections.filter(i => i.status === 'failed').length;
  const warningCount = mockInspections.filter(i => i.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <Camera className="w-8 h-8 text-indigo-600" />
            Computer Vision Quality Control
          </h1>
          <p className="text-neutral-600 mt-2">CNN-based defect detection with 99.2% accuracy for automated quality assurance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('realtime')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'realtime' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Real-Time
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'history' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* AI Model Info */}
      <div className="card p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">Deep Learning Vision System Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              YOLOv8 + ResNet50 ensemble for multi-class defect detection at production speed (120 items/min).
              Accuracy: <span className="font-bold text-indigo-600">99.2%</span> with 0.4% false rejection rate
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Models: YOLOv8 + ResNet50</span>
              <span>Training images: 284k</span>
              <span>Processing speed: 8ms/image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6 border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Passed</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">{passedCount}</div>
          <div className="text-xs text-neutral-600 mt-1">97.6% pass rate</div>
        </div>

        <div className="card p-6 border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Failed</span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{failedCount}</div>
          <div className="text-xs text-neutral-600 mt-1">Defects detected</div>
        </div>

        <div className="card p-6 border-2 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Warnings</span>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-600">{warningCount}</div>
          <div className="text-xs text-neutral-600 mt-1">Manual review needed</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Inspections Today</span>
            <Camera className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">1,247</div>
          <div className="text-xs text-indigo-600 mt-1">120 items/min avg</div>
        </div>
      </div>

      {/* Live Inspection Feed */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Live Inspection Feed
        </h2>
        <div className="space-y-3">
          {mockInspections.map((inspection) => (
            <div
              key={inspection.id}
              className={`p-4 rounded-lg border-2 ${
                inspection.status === 'passed'
                  ? 'border-green-200 bg-green-50'
                  : inspection.status === 'failed'
                  ? 'border-red-200 bg-red-50'
                  : 'border-orange-200 bg-orange-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{inspection.imageUrl}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neutral-900">{inspection.product}</span>
                      <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600">{inspection.id}</span>
                      <span className="text-xs text-neutral-600">{inspection.batch}</span>
                      {inspection.status === 'passed' && (
                        <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          PASSED
                        </span>
                      )}
                      {inspection.status === 'failed' && (
                        <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full font-medium flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          FAILED
                        </span>
                      )}
                      {inspection.status === 'warning' && (
                        <span className="text-xs px-2 py-1 bg-orange-600 text-white rounded-full font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          WARNING
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{inspection.confidence}%</div>
                      <div className="text-xs text-neutral-500">Confidence</div>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500 mb-2">{inspection.timestamp}</div>
                  
                  {inspection.defects.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-neutral-200">
                      <div className="text-xs font-medium text-neutral-700 mb-1">Detected Defects:</div>
                      <div className="flex flex-wrap gap-2">
                        {inspection.defects.map((defect, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-white rounded border border-red-300 text-red-700">
                            {defect}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {inspection.status !== 'passed' && (
                <div className="mt-3 flex gap-2">
                  <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium">
                    View Full Analysis
                  </button>
                  <button className="px-4 py-2 bg-white text-neutral-700 border-2 border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
                    Manual Review
                  </button>
                  {inspection.status === 'warning' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Override & Approve
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Defect Categories */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Defect Categories - Last 24 Hours</h2>
        <div className="space-y-3">
          {defectCategories.map((category, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-neutral-900">{category.type}</div>
                <div className="text-sm text-neutral-600 mt-1">
                  Detected: <span className="font-medium">{category.detected}</span> instances
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-neutral-900">{category.rate}</div>
                  <div className="text-xs text-neutral-500">Defect rate</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.trend === 'down' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {category.trend === 'down' ? '↓ Improving' : '→ Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camera Grid Simulation */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Inspection Stations</h2>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((station) => (
            <div key={station} className="p-4 bg-neutral-100 rounded-lg text-center">
              <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-neutral-900">Station {station}</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Active</span>
              </div>
              <div className="text-xs text-neutral-500 mt-1">32 items/min</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Insights & Quality Trends
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">System Performance:</span> 99.2% detection accuracy with 0.4% false rejection rate - processing 120 items/min across 4 stations</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Quality Improvement:</span> Surface defect rate decreased 23% this week after identifying Supplier B material issue</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Cost Savings:</span> Automated QC reduced manual inspection costs by $12,400/month while improving defect detection by 47%</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Model Update:</span> Retrained with 2,840 new defect images - improved color inconsistency detection from 94% to 96.8%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
