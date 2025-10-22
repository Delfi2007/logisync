/**
 * Time Series Analysis Service for Dashboard
 * Implements statistical analysis and anomaly detection
 */

class TimeSeriesAnalysisService {
  /**
   * Calculate moving average for trend analysis
   */
  calculateMovingAverage(data, window = 7) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < window - 1) {
        result.push(null);
      } else {
        const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / window);
      }
    }
    return result;
  }

  /**
   * Detect anomalies using statistical methods (Z-score)
   */
  detectAnomalies(data, threshold = 2.5) {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    const anomalies = [];
    data.forEach((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev);
      if (zScore > threshold) {
        anomalies.push({
          index,
          value,
          zScore,
          severity: zScore > 3 ? 'high' : 'medium'
        });
      }
    });

    return anomalies;
  }

  /**
   * Exponential smoothing for forecasting
   */
  exponentialSmoothing(data, alpha = 0.3) {
    const smoothed = [data[0]];
    for (let i = 1; i < data.length; i++) {
      smoothed.push(alpha * data[i] + (1 - alpha) * smoothed[i - 1]);
    }
    return smoothed;
  }

  /**
   * Calculate trend using linear regression
   */
  calculateTrend(data) {
    const n = data.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * data[i], 0);
    const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
      slope,
      intercept,
      direction: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
      strength: Math.abs(slope)
    };
  }

  /**
   * Seasonal decomposition (simplified)
   */
  detectSeasonality(data, period = 7) {
    const seasonal = [];
    for (let i = 0; i < period; i++) {
      const values = [];
      for (let j = i; j < data.length; j += period) {
        values.push(data[j]);
      }
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      seasonal.push(avg);
    }
    return seasonal;
  }

  /**
   * Forecast next N values using exponential smoothing
   */
  forecast(data, periods = 7, alpha = 0.3) {
    const smoothed = this.exponentialSmoothing(data, alpha);
    const lastValue = smoothed[smoothed.length - 1];
    const trend = this.calculateTrend(data);
    
    const forecasts = [];
    for (let i = 1; i <= periods; i++) {
      forecasts.push(lastValue + trend.slope * i);
    }
    
    return forecasts;
  }
}

module.exports = new TimeSeriesAnalysisService();
