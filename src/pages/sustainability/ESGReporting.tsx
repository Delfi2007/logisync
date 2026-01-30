import { useState } from 'react';
import { Award, Leaf, Users, Shield, TrendingUp, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const esgScore = {
  overall: 85,
  rating: 'A',
  rank: 'Top 10%',
  pillars: {
    environmental: {
      score: 88,
      rating: 'A',
      metrics: [
        { name: 'Carbon Emissions', score: 92, status: 'excellent', target: 90 },
        { name: 'Energy Efficiency', score: 86, status: 'good', target: 85 },
        { name: 'Waste Management', score: 85, status: 'good', target: 80 },
        { name: 'Water Usage', score: 89, status: 'excellent', target: 85 }
      ]
    },
    social: {
      score: 82,
      rating: 'B+',
      metrics: [
        { name: 'Employee Safety', score: 95, status: 'excellent', target: 90 },
        { name: 'Fair Labor', score: 88, status: 'excellent', target: 85 },
        { name: 'Community Impact', score: 75, status: 'good', target: 75 },
        { name: 'Supplier Ethics', score: 70, status: 'fair', target: 75 }
      ]
    },
    governance: {
      score: 85,
      rating: 'A-',
      metrics: [
        { name: 'Transparency', score: 90, status: 'excellent', target: 85 },
        { name: 'Ethics Policy', score: 88, status: 'excellent', target: 85 },
        { name: 'Risk Management', score: 82, status: 'good', target: 80 },
        { name: 'Board Diversity', score: 80, status: 'good', target: 75 }
      ]
    }
  }
};

const unSdgGoals = [
  {
    number: 7,
    name: 'Affordable and Clean Energy',
    description: 'EV fleet adoption',
    progress: 68,
    status: 'on-track',
    impact: '68% of fleet electrified',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    number: 9,
    name: 'Industry, Innovation, Infrastructure',
    description: 'AI-powered logistics',
    progress: 85,
    status: 'exceeding',
    impact: '7 AI models deployed',
    color: 'from-orange-500 to-red-500'
  },
  {
    number: 11,
    name: 'Sustainable Cities',
    description: 'Urban delivery optimization',
    progress: 72,
    status: 'on-track',
    impact: '30% reduction in urban emissions',
    color: 'from-yellow-500 to-orange-400'
  },
  {
    number: 12,
    name: 'Responsible Consumption',
    description: 'Circular economy practices',
    progress: 65,
    status: 'on-track',
    impact: '95% packaging recyclable',
    color: 'from-orange-400 to-yellow-600'
  },
  {
    number: 13,
    name: 'Climate Action',
    description: 'Net-zero commitment',
    progress: 78,
    status: 'on-track',
    impact: '847 tons CO₂ reduced',
    color: 'from-green-500 to-emerald-600'
  },
  {
    number: 17,
    name: 'Partnerships for Goals',
    description: 'Industry collaboration',
    progress: 60,
    status: 'developing',
    impact: '12 sustainability partners',
    color: 'from-blue-500 to-indigo-600'
  }
];

const certifications = [
  { 
    name: 'ISO 14001', 
    fullName: 'Environmental Management',
    status: 'certified', 
    validUntil: '2026-12-31', 
    icon: CheckCircle,
    color: 'text-green-600'
  },
  { 
    name: 'Carbon Neutral', 
    fullName: 'Carbon Neutral Certification',
    status: 'certified', 
    validUntil: '2025-12-31', 
    icon: CheckCircle,
    color: 'text-green-600'
  },
  { 
    name: 'B Corp', 
    fullName: 'Benefit Corporation',
    status: 'in-progress', 
    validUntil: 'Q2 2025', 
    icon: Clock,
    color: 'text-yellow-600'
  },
  { 
    name: 'LEED Gold', 
    fullName: 'Green Building Certification',
    status: 'certified', 
    validUntil: '2027-06-30', 
    icon: CheckCircle,
    color: 'text-green-600'
  }
];

export default function ESGReporting() {
  const [selectedPillar, setSelectedPillar] = useState<'environmental' | 'social' | 'governance'>('environmental');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      default:
        return 'text-neutral-600';
    }
  };

  const pillarData = esgScore.pillars[selectedPillar];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
          <Award className="w-8 h-8 text-purple-600" />
          ESG Reporting & Compliance
        </h1>
        <p className="text-neutral-600 mt-2">UN SDG-aligned sustainability metrics and comprehensive ESG scorecard</p>
      </div>

      {/* ESG Info Banner */}
      <div className="card p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">ESG Framework Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Comprehensive Environmental, Social, and Governance reporting aligned with GRI Standards and UN SDGs.
              Current rating: <span className="font-bold text-purple-600">A (85/100)</span> - Top 10% in logistics sector
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>✓ GRI Standards compliant</span>
              <span>✓ 6 UN SDG goals tracked</span>
              <span>✓ Quarterly reporting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall ESG Score */}
      <div className="card p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="text-sm text-neutral-600 mb-2">Overall ESG Score</div>
        <div className="text-6xl font-bold text-purple-600 mb-2">{esgScore.overall}</div>
        <div className="text-2xl font-bold text-neutral-900 mb-2">{esgScore.rating} Rating</div>
        <div className="inline-block px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
          {esgScore.rank} in Logistics Industry
        </div>
      </div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedPillar('environmental')}
          className={`card p-6 text-left transition-all ${
            selectedPillar === 'environmental' 
              ? 'border-2 border-green-500 shadow-lg' 
              : 'border-2 border-transparent hover:border-green-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-neutral-900">Environmental</h3>
          </div>
          <div className="text-4xl font-bold text-green-600 mb-2">
            {esgScore.pillars.environmental.score}
          </div>
          <div className="text-sm text-neutral-600">{esgScore.pillars.environmental.rating} Rating</div>
        </button>

        <button
          onClick={() => setSelectedPillar('social')}
          className={`card p-6 text-left transition-all ${
            selectedPillar === 'social' 
              ? 'border-2 border-blue-500 shadow-lg' 
              : 'border-2 border-transparent hover:border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-neutral-900">Social</h3>
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {esgScore.pillars.social.score}
          </div>
          <div className="text-sm text-neutral-600">{esgScore.pillars.social.rating} Rating</div>
        </button>

        <button
          onClick={() => setSelectedPillar('governance')}
          className={`card p-6 text-left transition-all ${
            selectedPillar === 'governance' 
              ? 'border-2 border-purple-500 shadow-lg' 
              : 'border-2 border-transparent hover:border-purple-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-neutral-900">Governance</h3>
          </div>
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {esgScore.pillars.governance.score}
          </div>
          <div className="text-sm text-neutral-600">{esgScore.pillars.governance.rating} Rating</div>
        </button>
      </div>

      {/* Detailed Metrics for Selected Pillar */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-6">
          {selectedPillar.charAt(0).toUpperCase() + selectedPillar.slice(1)} Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillarData.metrics.map((metric) => (
            <div key={metric.name} className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-neutral-900">{metric.name}</h4>
                <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                  {metric.score}/100
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      metric.status === 'excellent' ? 'bg-green-600' :
                      metric.status === 'good' ? 'bg-blue-600' :
                      'bg-yellow-600'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`${getStatusColor(metric.status)}`}>
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </span>
                <span className="text-neutral-500">
                  Target: {metric.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UN SDG Goals */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-neutral-900">UN Sustainable Development Goals</h3>
          <p className="text-sm text-neutral-600 mt-1">Progress towards 6 key SDG goals aligned with our operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unSdgGoals.map((goal) => (
            <div key={goal.number} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {goal.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">{goal.name}</h4>
                  <p className="text-xs text-neutral-600 mb-2">{goal.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${goal.color}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-900">{goal.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      goal.status === 'exceeding' ? 'bg-green-100 text-green-700' :
                      goal.status === 'on-track' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">{goal.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-neutral-900">Certifications & Compliance</h3>
          <p className="text-sm text-neutral-600 mt-1">Industry-recognized sustainability certifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => {
            const IconComponent = cert.icon;
            return (
              <div key={cert.name} className="p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-6 h-6 ${cert.color} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-neutral-900">{cert.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cert.status === 'certified' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {cert.status === 'certified' ? 'Certified' : 'In Progress'}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{cert.fullName}</p>
                    <p className="text-xs text-neutral-500">
                      {cert.status === 'certified' ? 'Valid until: ' : 'Expected: '}
                      {cert.validUntil}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Achievements */}
      <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">2024 ESG Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">30% Carbon Reduction</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Achieved 30% reduction in CO₂ emissions vs 2023 baseline through EV adoption and route optimization
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">Zero Workplace Incidents</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Maintained 365 days without workplace accidents through enhanced safety protocols
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">100% Supplier Compliance</h4>
              <p className="text-xs text-neutral-600 mt-1">
                All suppliers audited and certified for ethical labor practices and environmental standards
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">4 Major Certifications</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Achieved ISO 14001, Carbon Neutral, and LEED Gold certifications in 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/sustainability/carbon-footprint"
          className="card p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-neutral-900">Carbon Footprint Tracking</h4>
            <ArrowRight className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm text-neutral-600">
            View detailed CO₂ emissions and reduction metrics
          </p>
        </Link>

        <Link 
          to="/sustainability/green-routing"
          className="card p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-neutral-900">Green Route Optimization</h4>
            <ArrowRight className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm text-neutral-600">
            EV-first routing and charging station network
          </p>
        </Link>
      </div>
    </div>
  );
}
