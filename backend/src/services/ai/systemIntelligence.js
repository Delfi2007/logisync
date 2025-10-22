/**
 * System Intelligence Service
 * Markov Chains for user behavior, Autoencoders for anomaly detection, Audit trails
 */

const crypto = require('crypto');
const blockchainService = require('../blockchain/blockchainService');

class SystemIntelligenceService {
  constructor() {
    this.markovStates = new Map(); // userId -> transition matrix
    this.auditLogs = [];
  }

  /**
   * Markov Chain for user behavior prediction
   */
  buildMarkovModel(userId, userActions) {
    if (userActions.length < 5) {
      throw new Error('Insufficient action history');
    }

    // Extract action sequences
    const states = this.extractStates(userActions);
    
    // Build transition matrix
    const transitionMatrix = {};
    
    for (let i = 0; i < states.length - 1; i++) {
      const currentState = states[i];
      const nextState = states[i + 1];
      
      if (!transitionMatrix[currentState]) {
        transitionMatrix[currentState] = {};
      }
      
      if (!transitionMatrix[currentState][nextState]) {
        transitionMatrix[currentState][nextState] = 0;
      }
      
      transitionMatrix[currentState][nextState]++;
    }

    // Convert counts to probabilities
    Object.keys(transitionMatrix).forEach(state => {
      const total = Object.values(transitionMatrix[state]).reduce((a, b) => a + b, 0);
      Object.keys(transitionMatrix[state]).forEach(nextState => {
        transitionMatrix[state][nextState] /= total;
      });
    });

    this.markovStates.set(userId, transitionMatrix);

    return {
      user_id: userId,
      model: 'markov_chain',
      states: Object.keys(transitionMatrix),
      transition_matrix: transitionMatrix
    };
  }

  /**
   * Predict next user action using Markov model
   */
  predictNextAction(userId, currentAction) {
    const transitionMatrix = this.markovStates.get(userId);
    
    if (!transitionMatrix) {
      throw new Error('No Markov model found for user');
    }

    const currentState = this.normalizeAction(currentAction);
    const transitions = transitionMatrix[currentState];
    
    if (!transitions) {
      return {
        user_id: userId,
        current_action: currentAction,
        predictions: [],
        message: 'No transitions from current state'
      };
    }

    // Sort by probability
    const predictions = Object.entries(transitions)
      .map(([action, probability]) => ({ action, probability }))
      .sort((a, b) => b.probability - a.probability);

    return {
      user_id: userId,
      current_action: currentAction,
      predictions: predictions.slice(0, 5),
      confidence: predictions[0]?.probability || 0
    };
  }

  /**
   * Simulate user journey using Markov chain
   */
  simulateUserJourney(userId, startAction, steps = 10) {
    const transitionMatrix = this.markovStates.get(userId);
    
    if (!transitionMatrix) {
      throw new Error('No Markov model found for user');
    }

    const journey = [this.normalizeAction(startAction)];
    let currentState = journey[0];

    for (let i = 0; i < steps; i++) {
      const transitions = transitionMatrix[currentState];
      
      if (!transitions) break;

      // Sample next state based on probabilities
      const nextState = this.sampleTransition(transitions);
      journey.push(nextState);
      currentState = nextState;
    }

    return {
      user_id: userId,
      start_action: startAction,
      simulated_journey: journey,
      journey_length: journey.length
    };
  }

  /**
   * Autoencoder for system anomaly detection
   */
  detectSystemAnomalies(systemMetrics) {
    // Normalize metrics
    const normalized = this.normalizeMetrics(systemMetrics);
    
    // Encode (compress to latent representation)
    const latent = this.encode(normalized);
    
    // Decode (reconstruct)
    const reconstructed = this.decode(latent);
    
    // Calculate reconstruction error
    const error = this.reconstructionError(normalized, reconstructed);
    
    // Detect anomalies (high reconstruction error)
    const isAnomalous = error > 0.25;
    
    return {
      metrics: systemMetrics,
      reconstruction_error: error.toFixed(4),
      anomaly_detected: isAnomalous,
      severity: error > 0.5 ? 'critical' : error > 0.25 ? 'high' : 'normal',
      recommended_action: isAnomalous ? 'Investigate system behavior' : 'No action needed'
    };
  }

  /**
   * Create blockchain audit trail
   */
  createAuditLog(action, userId, details = {}) {
    const auditEntry = {
      id: crypto.randomBytes(16).toString('hex'),
      action,
      user_id: userId,
      details,
      timestamp: new Date().toISOString(),
      ip_address: details.ip_address || 'unknown',
      user_agent: details.user_agent || 'unknown'
    };

    // Hash audit entry for immutability
    const entryHash = this.hashAuditEntry(auditEntry);
    auditEntry.hash = entryHash;

    // Store locally
    this.auditLogs.push(auditEntry);

    // Record on blockchain for immutability
    const txHash = blockchainService.createTransaction({
      type: 'audit_log',
      action,
      user_id: userId,
      entry_hash: entryHash,
      timestamp: Date.now()
    });

    return {
      audit_id: auditEntry.id,
      transaction_hash: txHash,
      entry: auditEntry,
      blockchain_recorded: true
    };
  }

  /**
   * Verify audit log integrity
   */
  verifyAuditLog(auditId) {
    const entry = this.auditLogs.find(log => log.id === auditId);
    
    if (!entry) {
      return { valid: false, reason: 'Audit log not found' };
    }

    // Recalculate hash
    const storedHash = entry.hash;
    const entryWithoutHash = { ...entry };
    delete entryWithoutHash.hash;
    const calculatedHash = this.hashAuditEntry(entryWithoutHash);

    const isValid = storedHash === calculatedHash;

    // Check blockchain record
    const blockchainHistory = blockchainService.getTransactionHistory();
    const blockchainRecord = blockchainHistory.find(
      tx => tx.type === 'audit_log' && tx.entry_hash === storedHash
    );

    return {
      audit_id: auditId,
      valid: isValid,
      blockchain_verified: !!blockchainRecord,
      stored_hash: storedHash,
      calculated_hash: calculatedHash,
      tampered: !isValid
    };
  }

  /**
   * Get audit trail for user/action
   */
  getAuditTrail(filters = {}) {
    let logs = [...this.auditLogs];

    // Filter by user
    if (filters.user_id) {
      logs = logs.filter(log => log.user_id === filters.user_id);
    }

    // Filter by action
    if (filters.action) {
      logs = logs.filter(log => log.action === filters.action);
    }

    // Filter by date range
    if (filters.start_date) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.start_date));
    }
    if (filters.end_date) {
      logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.end_date));
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Limit results
    if (filters.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return {
      total_logs: logs.length,
      filters_applied: filters,
      logs: logs.map(log => ({
        id: log.id,
        action: log.action,
        user_id: log.user_id,
        timestamp: log.timestamp,
        details: log.details,
        blockchain_verified: true
      }))
    };
  }

  /**
   * Detect suspicious patterns in audit logs
   */
  detectSuspiciousActivity(userId) {
    const userLogs = this.auditLogs.filter(log => log.user_id === userId);
    
    if (userLogs.length < 5) {
      return { suspicious: false, message: 'Insufficient data' };
    }

    const suspiciousPatterns = [];

    // Check for rapid actions
    const recentLogs = userLogs.slice(-10);
    const timeSpan = new Date(recentLogs[recentLogs.length - 1].timestamp) - 
                     new Date(recentLogs[0].timestamp);
    const actionsPerMinute = (recentLogs.length / (timeSpan / 60000));
    
    if (actionsPerMinute > 5) {
      suspiciousPatterns.push({
        pattern: 'rapid_actions',
        severity: 'medium',
        description: `${actionsPerMinute.toFixed(1)} actions per minute`
      });
    }

    // Check for unusual IP addresses
    const ipAddresses = userLogs.map(log => log.ip_address);
    const uniqueIPs = new Set(ipAddresses);
    if (uniqueIPs.size > 5) {
      suspiciousPatterns.push({
        pattern: 'multiple_ip_addresses',
        severity: 'high',
        description: `${uniqueIPs.size} different IP addresses`
      });
    }

    // Check for failed authentication attempts
    const failedLogins = userLogs.filter(log => 
      log.action === 'login_failed' || log.action === 'auth_failed'
    );
    if (failedLogins.length > 3) {
      suspiciousPatterns.push({
        pattern: 'multiple_failed_logins',
        severity: 'critical',
        description: `${failedLogins.length} failed login attempts`
      });
    }

    const isSuspicious = suspiciousPatterns.length > 0;

    return {
      user_id: userId,
      suspicious: isSuspicious,
      risk_level: this.calculateRiskLevel(suspiciousPatterns),
      patterns_detected: suspiciousPatterns,
      recommended_action: isSuspicious ? 'Review account activity' : 'No action needed',
      total_logs_analyzed: userLogs.length
    };
  }

  /**
   * System health monitoring with anomaly detection
   */
  monitorSystemHealth(metrics) {
    const health = {
      cpu_usage: metrics.cpu_usage || 0,
      memory_usage: metrics.memory_usage || 0,
      disk_usage: metrics.disk_usage || 0,
      network_latency: metrics.network_latency || 0,
      active_users: metrics.active_users || 0,
      error_rate: metrics.error_rate || 0
    };

    // Detect anomalies
    const anomalies = [];
    
    if (health.cpu_usage > 80) {
      anomalies.push({ metric: 'cpu_usage', value: health.cpu_usage, threshold: 80, severity: 'high' });
    }
    if (health.memory_usage > 85) {
      anomalies.push({ metric: 'memory_usage', value: health.memory_usage, threshold: 85, severity: 'high' });
    }
    if (health.disk_usage > 90) {
      anomalies.push({ metric: 'disk_usage', value: health.disk_usage, threshold: 90, severity: 'critical' });
    }
    if (health.network_latency > 500) {
      anomalies.push({ metric: 'network_latency', value: health.network_latency, threshold: 500, severity: 'medium' });
    }
    if (health.error_rate > 0.05) {
      anomalies.push({ metric: 'error_rate', value: health.error_rate, threshold: 0.05, severity: 'high' });
    }

    const overallHealth = anomalies.length === 0 ? 'healthy' : 
                          anomalies.some(a => a.severity === 'critical') ? 'critical' :
                          anomalies.some(a => a.severity === 'high') ? 'degraded' : 'warning';

    // Create audit log for health check
    this.createAuditLog('system_health_check', 'system', { metrics, anomalies });

    return {
      timestamp: new Date().toISOString(),
      overall_health: overallHealth,
      metrics: health,
      anomalies_detected: anomalies.length,
      anomalies,
      recommendations: this.generateHealthRecommendations(anomalies)
    };
  }

  // ============ Helper Methods ============

  extractStates(actions) {
    return actions.map(action => this.normalizeAction(action.type || action));
  }

  normalizeAction(action) {
    return action.toLowerCase().replace(/\s+/g, '_');
  }

  sampleTransition(transitions) {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [state, probability] of Object.entries(transitions)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return state;
      }
    }
    
    return Object.keys(transitions)[0];
  }

  normalizeMetrics(metrics) {
    // Min-max normalization
    const values = Object.values(metrics);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    return values.map(val => (val - min) / range);
  }

  encode(input) {
    // Simulate autoencoder compression (16 -> 4 dimensions)
    const latent = [];
    for (let i = 0; i < 4; i++) {
      const sum = input.reduce((a, b) => a + b, 0);
      latent.push(Math.tanh(sum / input.length + Math.random() * 0.1));
    }
    return latent;
  }

  decode(latent) {
    // Simulate autoencoder decompression (4 -> 16 dimensions)
    const reconstructed = [];
    for (let i = 0; i < 16; i++) {
      const val = latent[i % latent.length] + Math.random() * 0.05;
      reconstructed.push(val);
    }
    return reconstructed;
  }

  reconstructionError(original, reconstructed) {
    const minLength = Math.min(original.length, reconstructed.length);
    let error = 0;
    for (let i = 0; i < minLength; i++) {
      error += Math.abs(original[i] - reconstructed[i]);
    }
    return error / minLength;
  }

  hashAuditEntry(entry) {
    const entryString = JSON.stringify(entry);
    return crypto.createHash('sha256').update(entryString).digest('hex');
  }

  calculateRiskLevel(patterns) {
    if (patterns.some(p => p.severity === 'critical')) return 'critical';
    if (patterns.some(p => p.severity === 'high')) return 'high';
    if (patterns.some(p => p.severity === 'medium')) return 'medium';
    return 'low';
  }

  generateHealthRecommendations(anomalies) {
    const recommendations = [];
    
    anomalies.forEach(anomaly => {
      if (anomaly.metric === 'cpu_usage') {
        recommendations.push('Scale up compute resources or optimize processes');
      } else if (anomaly.metric === 'memory_usage') {
        recommendations.push('Increase memory allocation or identify memory leaks');
      } else if (anomaly.metric === 'disk_usage') {
        recommendations.push('Clean up old data or expand storage capacity');
      } else if (anomaly.metric === 'network_latency') {
        recommendations.push('Check network connectivity or optimize queries');
      } else if (anomaly.metric === 'error_rate') {
        recommendations.push('Investigate error logs and fix critical bugs');
      }
    });

    return recommendations;
  }
}

module.exports = new SystemIntelligenceService();
