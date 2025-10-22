import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Brain, Activity } from 'lucide-react';

const mockTransactions = [
  {
    id: 'TXN-8823',
    timestamp: '2025-01-22 14:23:45',
    amount: '$847.50',
    vendor: 'TechSupply Inc.',
    riskScore: 12,
    status: 'safe',
    anomalies: []
  },
  {
    id: 'TXN-8824',
    timestamp: '2025-01-22 14:28:12',
    amount: '$12,450.00',
    vendor: 'Industrial Parts Co.',
    riskScore: 87,
    status: 'flagged',
    anomalies: ['Unusual amount', 'New vendor', 'Rapid transaction']
  },
  {
    id: 'TXN-8825',
    timestamp: '2025-01-22 14:35:09',
    amount: '$3,200.00',
    vendor: 'Global Logistics Ltd.',
    riskScore: 45,
    status: 'review',
    anomalies: ['Slightly elevated amount']
  },
  {
    id: 'TXN-8826',
    timestamp: '2025-01-22 14:42:33',
    amount: '$1,150.00',
    vendor: 'Office Supplies Plus',
    riskScore: 8,
    status: 'safe',
    anomalies: []
  }
];

const fraudPatterns = [
  { type: 'Duplicate Invoices', detected: 3, blocked: '$8,400', confidence: 98 },
  { type: 'Price Manipulation', detected: 1, blocked: '$2,100', confidence: 94 },
  { type: 'Phantom Vendors', detected: 0, blocked: '$0', confidence: 99 },
  { type: 'Timing Anomalies', detected: 2, blocked: '$15,600', confidence: 92 }
];

export default function FraudDetection() {
  const [timeRange, setTimeRange] = useState('today');

  const flaggedCount = mockTransactions.filter(t => t.status === 'flagged').length;
  const reviewCount = mockTransactions.filter(t => t.status === 'review').length;
  const safeCount = mockTransactions.filter(t => t.status === 'safe').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-600" />
            AI Fraud Detection
          </h1>
          <p className="text-neutral-600 mt-2">Anomaly detection using Isolation Forest & autoencoders for real-time protection</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === 'today' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === 'week' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* AI Model Info */}
      <div className="card p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">Multi-Model Fraud Detection Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Combining Isolation Forest for anomaly detection + LSTM autoencoders for pattern recognition.
              Detection rate: <span className="font-bold text-red-600">96.7%</span> with 0.3% false positives
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Models: Isolation Forest + LSTM</span>
              <span>Training data: 145k transactions</span>
              <span>Real-time scanning: ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6 border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Protected Transactions</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">{safeCount}</div>
          <div className="text-xs text-neutral-600 mt-1">0 fraud detected</div>
        </div>

        <div className="card p-6 border-2 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Under Review</span>
            <Activity className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-600">{reviewCount}</div>
          <div className="text-xs text-neutral-600 mt-1">Awaiting verification</div>
        </div>

        <div className="card p-6 border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">High Risk Flagged</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{flaggedCount}</div>
          <div className="text-xs text-neutral-600 mt-1">Action required</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Amount Protected</span>
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600">$26.1k</div>
          <div className="text-xs text-green-600 mt-1">Fraud blocked this month</div>
        </div>
      </div>

      {/* Transaction Monitor */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Real-Time Transaction Monitor
        </h2>
        <div className="space-y-3">
          {mockTransactions.map((txn) => (
            <div
              key={txn.id}
              className={`p-4 rounded-lg border-2 ${
                txn.status === 'flagged'
                  ? 'border-red-200 bg-red-50'
                  : txn.status === 'review'
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-neutral-900">{txn.id}</span>
                    <span className="text-sm text-neutral-600">{txn.timestamp}</span>
                    {txn.status === 'flagged' && (
                      <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        HIGH RISK
                      </span>
                    )}
                    {txn.status === 'review' && (
                      <span className="text-xs px-2 py-1 bg-orange-600 text-white rounded-full font-medium">
                        REVIEW
                      </span>
                    )}
                    {txn.status === 'safe' && (
                      <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        SAFE
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-neutral-600">
                    <span className="font-medium">{txn.vendor}</span> - {txn.amount}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    txn.riskScore > 70 ? 'text-red-600' : txn.riskScore > 40 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {txn.riskScore}
                  </div>
                  <div className="text-xs text-neutral-500">Risk Score</div>
                </div>
              </div>
              {txn.anomalies.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-200">
                  <div className="text-xs font-medium text-neutral-700 mb-1">Detected Anomalies:</div>
                  <div className="flex flex-wrap gap-2">
                    {txn.anomalies.map((anomaly, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-white rounded border border-neutral-300 text-neutral-700">
                        {anomaly}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {txn.status === 'flagged' && (
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    Block Transaction
                  </button>
                  <button className="flex-1 px-4 py-2 bg-white text-neutral-700 border-2 border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
                    Investigate
                  </button>
                  <button className="px-4 py-2 bg-white text-neutral-700 border-2 border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
                    Mark Safe
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fraud Pattern Analysis */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Fraud Patterns Detected This Week</h2>
        <div className="space-y-3">
          {fraudPatterns.map((pattern, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-neutral-900">{pattern.type}</div>
                <div className="text-sm text-neutral-600 mt-1">
                  Detected: <span className="font-medium">{pattern.detected}</span> attempts
                  <span className="mx-2">•</span>
                  Confidence: <span className="font-medium">{pattern.confidence}%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">{pattern.blocked}</div>
                <div className="text-xs text-neutral-500">Amount blocked</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-orange-600" />
          AI Insights & Security Recommendations
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Pattern Alert:</span> TXN-8824 matches known fraud signature (new vendor + large amount + rapid processing) - 87% confidence</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Behavioral Anomaly:</span> 3 transactions from same IP in 15 minutes - unusual for this account's normal pattern</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Model Update:</span> Autoencoder retrained with 2,400 new transactions - detection accuracy improved to 96.7%</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Success Metric:</span> $26,100 in fraudulent transactions blocked this month with 0.3% false positive rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
