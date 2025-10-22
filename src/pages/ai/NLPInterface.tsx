import { useState } from 'react';
import { MessageSquare, Mic, Send, Bot, User, Sparkles } from 'lucide-react';

const mockConversation = [
  {
    id: 1,
    role: 'user',
    message: 'Show me all orders from last week that are still pending',
    timestamp: '14:32'
  },
  {
    id: 2,
    role: 'assistant',
    message: 'I found 8 pending orders from last week. Here\'s the summary:\n\n• 3 orders awaiting payment confirmation\n• 4 orders in processing\n• 1 order pending inventory allocation\n\nWould you like me to show details for any specific order?',
    timestamp: '14:32',
    data: { orderCount: 8, breakdown: ['Payment: 3', 'Processing: 4', 'Inventory: 1'] }
  },
  {
    id: 3,
    role: 'user',
    message: 'Yes, show me the one with inventory issue',
    timestamp: '14:33'
  },
  {
    id: 4,
    role: 'assistant',
    message: 'Order #ORD-2847 for TechCorp Inc.\n\n• Customer: TechCorp Inc.\n• Items: 50x Laptop Pro 15"\n• Issue: Only 45 units in stock\n• Estimated restock: 2 days\n\nI can automatically notify the customer about the delay or check alternative fulfillment options. What would you prefer?',
    timestamp: '14:33',
    data: { orderId: 'ORD-2847', shortfall: 5, etaRestock: '2 days' }
  }
];

const quickCommands = [
  { icon: '📦', text: 'Check inventory levels', category: 'Inventory' },
  { icon: '📊', text: 'Show today\'s sales report', category: 'Reports' },
  { icon: '🚚', text: 'Track order #ORD-2847', category: 'Orders' },
  { icon: '⚠️', text: 'List items below reorder point', category: 'Alerts' },
  { icon: '💰', text: 'Revenue forecast next month', category: 'Analytics' },
  { icon: '👥', text: 'Find customers with pending invoices', category: 'Customers' }
];

const capabilities = [
  { category: 'Natural Language Queries', items: ['Complex data retrieval', 'Multi-step reasoning', 'Context awareness'] },
  { category: 'Actions & Automation', items: ['Create orders', 'Update inventory', 'Send notifications'] },
  { category: 'Analytics & Insights', items: ['Generate reports', 'Predict trends', 'Identify anomalies'] },
  { category: 'Voice Commands', items: ['Speech-to-text', 'Hands-free operation', 'Multi-language support'] }
];

export default function NLPInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulation only
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-cyan-600" />
          Natural Language Interface
        </h1>
        <p className="text-neutral-600 mt-2">GPT-4 powered conversational AI for hands-free supply chain management</p>
      </div>

      {/* AI Model Info */}
      <div className="card p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">Advanced NLP System Active</h3>
            <p className="text-sm text-neutral-600 mt-1">
              GPT-4 with RAG (Retrieval-Augmented Generation) for accurate supply chain queries and actions.
              Response accuracy: <span className="font-bold text-cyan-600">96.8%</span> with full context awareness
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Model: GPT-4 + Fine-tuning</span>
              <span>Speech recognition: Whisper v3</span>
              <span>Languages: 12 supported</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold">LogiSync AI Assistant</div>
                <div className="text-xs text-cyan-100 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Online & Ready
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm font-medium">
              Clear Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-4 h-96 overflow-y-auto bg-neutral-50">
          {mockConversation.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-2xl ${msg.role === 'user' ? 'order-2' : ''}`}>
                <div className={`px-4 py-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-br-none' 
                    : 'bg-white border-2 border-neutral-200 text-neutral-900 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.message}</p>
                  {msg.data && (
                    <div className="mt-2 pt-2 border-t border-neutral-200">
                      <div className="text-xs font-medium opacity-80">Query Results:</div>
                      {msg.data.breakdown && (
                        <div className="flex gap-2 mt-1">
                          {msg.data.breakdown.map((item, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className={`text-xs text-neutral-500 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.timestamp}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t-2 border-neutral-200">
          <div className="flex gap-2">
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your supply chain..."
              className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-cyan-600 focus:outline-none"
            />
            <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
          {isListening && (
            <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              Listening... speak now
            </div>
          )}
        </div>
      </div>

      {/* Quick Commands */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Commands</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickCommands.map((cmd, idx) => (
            <button
              key={idx}
              className="p-4 text-left bg-neutral-50 hover:bg-cyan-50 border-2 border-neutral-200 hover:border-cyan-300 rounded-lg transition-all group"
            >
              <div className="text-2xl mb-2">{cmd.icon}</div>
              <div className="text-sm font-medium text-neutral-900 group-hover:text-cyan-600">{cmd.text}</div>
              <div className="text-xs text-neutral-500 mt-1">{cmd.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">AI Capabilities</h2>
        <div className="grid grid-cols-2 gap-4">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
              <div className="font-bold text-neutral-900 mb-3">{cap.category}</div>
              <ul className="space-y-2">
                {cap.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm text-neutral-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="text-sm text-neutral-600 mb-2">Queries Today</div>
          <div className="text-3xl font-bold text-neutral-900">1,247</div>
          <div className="text-xs text-green-600 mt-1">↑ 23% vs yesterday</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-neutral-600 mb-2">Avg Response Time</div>
          <div className="text-3xl font-bold text-neutral-900">1.2s</div>
          <div className="text-xs text-blue-600 mt-1">0.8s faster</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-neutral-600 mb-2">Accuracy Rate</div>
          <div className="text-3xl font-bold text-neutral-900">96.8%</div>
          <div className="text-xs text-purple-600 mt-1">High confidence</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-neutral-600 mb-2">Voice Commands</div>
          <div className="text-3xl font-bold text-neutral-900">342</div>
          <div className="text-xs text-orange-600 mt-1">27% of queries</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-600" />
          System Intelligence & Performance
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-cyan-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Natural Understanding:</span> Processes complex multi-step queries like "Show pending orders with inventory issues" with 96.8% accuracy</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Context Awareness:</span> Remembers conversation history and user preferences - "the one with inventory issue" correctly resolved to ORD-2847</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Voice Recognition:</span> Whisper v3 model achieves 98.2% transcription accuracy across 12 languages with domain-specific vocabulary</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Productivity Boost:</span> Users complete tasks 3.2x faster with voice commands vs manual navigation - 1,247 queries handled today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
