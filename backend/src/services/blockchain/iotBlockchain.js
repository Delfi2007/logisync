/**
 * IoT Blockchain Integration Service
 * Connects IoT devices with blockchain for immutable sensor data tracking
 */

const crypto = require('crypto');
const blockchainService = require('./blockchainService');

class IoTBlockchainService {
  constructor() {
    this.devices = new Map(); // deviceId -> device info
    this.sensorData = new Map(); // deviceId -> data array
    this.deviceChains = new Map(); // deviceId -> blockchain
  }

  /**
   * Register IoT device on blockchain
   */
  registerDevice(deviceData) {
    const deviceId = this.generateDeviceId();
    
    const device = {
      id: deviceId,
      name: deviceData.name,
      type: deviceData.type, // temperature, humidity, motion, weight, etc.
      location: deviceData.location,
      warehouse_id: deviceData.warehouse_id,
      public_key: this.generateDeviceKey(deviceId),
      registered_at: new Date().toISOString(),
      status: 'active'
    };

    this.devices.set(deviceId, device);

    // Record registration on blockchain
    const txHash = blockchainService.createTransaction({
      type: 'iot_device_registration',
      device_id: deviceId,
      device_type: device.type,
      location: device.location,
      timestamp: Date.now()
    });

    return {
      device_id: deviceId,
      transaction_hash: txHash,
      device,
      message: 'Device registered on blockchain'
    };
  }

  /**
   * Record sensor data on blockchain
   */
  recordSensorData(deviceId, sensorReading) {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error('Device not registered');
    }

    // Create data hash for integrity
    const dataHash = this.hashSensorData(sensorReading);
    
    const record = {
      device_id: deviceId,
      timestamp: sensorReading.timestamp || new Date().toISOString(),
      reading: sensorReading.value,
      unit: sensorReading.unit,
      data_hash: dataHash,
      verified: true
    };

    // Store locally
    if (!this.sensorData.has(deviceId)) {
      this.sensorData.set(deviceId, []);
    }
    this.sensorData.get(deviceId).push(record);

    // Record on blockchain
    const txHash = blockchainService.createTransaction({
      type: 'iot_sensor_data',
      device_id: deviceId,
      reading: sensorReading.value,
      unit: sensorReading.unit,
      data_hash: dataHash,
      timestamp: Date.now()
    });

    return {
      transaction_hash: txHash,
      record,
      blockchain_recorded: true
    };
  }

  /**
   * Batch record multiple sensor readings
   */
  recordBatchSensorData(deviceId, readings) {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error('Device not registered');
    }

    const records = [];
    const txHashes = [];

    readings.forEach(reading => {
      const result = this.recordSensorData(deviceId, reading);
      records.push(result.record);
      txHashes.push(result.transaction_hash);
    });

    return {
      device_id: deviceId,
      total_readings: readings.length,
      records,
      transaction_hashes: txHashes,
      batch_recorded: true
    };
  }

  /**
   * Verify sensor data integrity
   */
  verifySensorData(deviceId, record) {
    // Recalculate hash
    const calculatedHash = this.hashSensorData({
      value: record.reading,
      unit: record.unit,
      timestamp: record.timestamp
    });

    // Compare with stored hash
    const isValid = calculatedHash === record.data_hash;

    // Check blockchain record
    const blockchainHistory = blockchainService.getTransactionHistory();
    const blockchainRecord = blockchainHistory.find(
      tx => tx.device_id === deviceId && tx.data_hash === record.data_hash
    );

    return {
      device_id: deviceId,
      record_valid: isValid,
      blockchain_verified: !!blockchainRecord,
      calculated_hash: calculatedHash,
      stored_hash: record.data_hash,
      blockchain_transaction: blockchainRecord?.hash || null
    };
  }

  /**
   * Get device sensor history from blockchain
   */
  getDeviceHistory(deviceId, options = {}) {
    const { startDate, endDate, limit = 100 } = options;
    
    let data = this.sensorData.get(deviceId) || [];

    // Filter by date range
    if (startDate) {
      data = data.filter(d => new Date(d.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      data = data.filter(d => new Date(d.timestamp) <= new Date(endDate));
    }

    // Limit results
    data = data.slice(-limit);

    // Get blockchain confirmations
    const blockchainHistory = blockchainService.getTransactionHistory();
    const blockchainRecords = blockchainHistory.filter(tx => tx.device_id === deviceId);

    return {
      device_id: deviceId,
      total_records: data.length,
      blockchain_confirmations: blockchainRecords.length,
      data,
      data_integrity: 'verified_on_blockchain'
    };
  }

  /**
   * Detect anomalies in sensor data using blockchain verification
   */
  detectAnomalies(deviceId) {
    const data = this.sensorData.get(deviceId) || [];
    if (data.length < 10) {
      return { anomalies: [], message: 'Insufficient data for analysis' };
    }

    const readings = data.map(d => d.reading);
    const mean = readings.reduce((a, b) => a + b, 0) / readings.length;
    const stdDev = Math.sqrt(
      readings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / readings.length
    );

    const anomalies = [];
    data.forEach((record, index) => {
      const zScore = Math.abs((record.reading - mean) / stdDev);
      
      if (zScore > 3) {
        // Verify if anomaly is tampered data
        const verification = this.verifySensorData(deviceId, record);
        
        anomalies.push({
          index,
          timestamp: record.timestamp,
          reading: record.reading,
          z_score: zScore.toFixed(2),
          severity: zScore > 4 ? 'critical' : 'high',
          data_integrity: verification.record_valid ? 'intact' : 'compromised',
          blockchain_verified: verification.blockchain_verified
        });
      }
    });

    return {
      device_id: deviceId,
      total_readings: data.length,
      anomalies_detected: anomalies.length,
      anomalies,
      baseline_mean: mean.toFixed(2),
      baseline_stddev: stdDev.toFixed(2)
    };
  }

  /**
   * Create smart contract for automated IoT actions
   */
  createIoTSmartContract(deviceId, contractConditions) {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error('Device not registered');
    }

    const contractId = crypto.randomBytes(16).toString('hex');
    
    const contract = {
      id: contractId,
      device_id: deviceId,
      conditions: contractConditions, // e.g., { temperature: { above: 25, action: 'alert' } }
      created_at: new Date().toISOString(),
      status: 'active',
      executions: []
    };

    // Record on blockchain
    const txHash = blockchainService.createTransaction({
      type: 'iot_smart_contract',
      contract_id: contractId,
      device_id: deviceId,
      conditions: contractConditions,
      timestamp: Date.now()
    });

    return {
      contract_id: contractId,
      transaction_hash: txHash,
      contract,
      message: 'IoT smart contract deployed on blockchain'
    };
  }

  /**
   * Execute smart contract based on sensor data
   */
  executeSmartContract(contractId, contract, sensorReading) {
    const conditions = contract.conditions;
    let triggered = false;
    const actions = [];

    // Check conditions
    Object.keys(conditions).forEach(metric => {
      const condition = conditions[metric];
      
      if (condition.above && sensorReading.value > condition.above) {
        triggered = true;
        actions.push({
          action: condition.action,
          reason: `${metric} above threshold (${sensorReading.value} > ${condition.above})`
        });
      }
      
      if (condition.below && sensorReading.value < condition.below) {
        triggered = true;
        actions.push({
          action: condition.action,
          reason: `${metric} below threshold (${sensorReading.value} < ${condition.below})`
        });
      }
    });

    if (triggered) {
      // Record execution on blockchain
      const txHash = blockchainService.createTransaction({
        type: 'iot_contract_execution',
        contract_id: contractId,
        device_id: contract.device_id,
        sensor_value: sensorReading.value,
        actions,
        timestamp: Date.now()
      });

      contract.executions.push({
        timestamp: new Date().toISOString(),
        sensor_reading: sensorReading.value,
        actions,
        transaction_hash: txHash
      });

      return {
        executed: true,
        contract_id: contractId,
        actions,
        transaction_hash: txHash
      };
    }

    return {
      executed: false,
      contract_id: contractId,
      message: 'No conditions triggered'
    };
  }

  /**
   * Get device status and health
   */
  getDeviceStatus(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    const data = this.sensorData.get(deviceId) || [];
    const lastReading = data[data.length - 1];
    const minutesSinceUpdate = lastReading 
      ? (Date.now() - new Date(lastReading.timestamp).getTime()) / (1000 * 60)
      : null;

    // Determine health
    let health = 'unknown';
    if (!lastReading) {
      health = 'no_data';
    } else if (minutesSinceUpdate < 5) {
      health = 'excellent';
    } else if (minutesSinceUpdate < 30) {
      health = 'good';
    } else if (minutesSinceUpdate < 120) {
      health = 'degraded';
    } else {
      health = 'offline';
    }

    return {
      device_id: deviceId,
      device_name: device.name,
      type: device.type,
      status: device.status,
      health,
      total_readings: data.length,
      last_reading: lastReading,
      minutes_since_update: minutesSinceUpdate ? Math.round(minutesSinceUpdate) : null,
      location: device.location
    };
  }

  /**
   * Aggregate sensor data by time period
   */
  aggregateSensorData(deviceId, period = 'hourly') {
    const data = this.sensorData.get(deviceId) || [];
    if (data.length === 0) {
      return { aggregated: [], message: 'No data available' };
    }

    const aggregated = {};
    const periodMs = period === 'hourly' ? 3600000 : period === 'daily' ? 86400000 : 60000;

    data.forEach(record => {
      const timestamp = new Date(record.timestamp).getTime();
      const bucket = Math.floor(timestamp / periodMs) * periodMs;
      const bucketKey = new Date(bucket).toISOString();

      if (!aggregated[bucketKey]) {
        aggregated[bucketKey] = {
          timestamp: bucketKey,
          readings: [],
          count: 0
        };
      }

      aggregated[bucketKey].readings.push(record.reading);
      aggregated[bucketKey].count++;
    });

    // Calculate statistics for each bucket
    const results = Object.values(aggregated).map(bucket => ({
      timestamp: bucket.timestamp,
      count: bucket.count,
      average: bucket.readings.reduce((a, b) => a + b, 0) / bucket.readings.length,
      min: Math.min(...bucket.readings),
      max: Math.max(...bucket.readings)
    }));

    return {
      device_id: deviceId,
      period,
      aggregated: results
    };
  }

  // ============ Helper Methods ============

  generateDeviceId() {
    return 'IoT_' + crypto.randomBytes(16).toString('hex');
  }

  generateDeviceKey(deviceId) {
    return crypto.createHash('sha256').update(deviceId).digest('hex');
  }

  hashSensorData(data) {
    const dataString = JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }
}

module.exports = new IoTBlockchainService();
