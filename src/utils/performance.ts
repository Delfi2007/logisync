/**
 * Performance monitoring utilities
 * 
 * This module provides utilities for measuring and reporting
 * Core Web Vitals and custom performance metrics.
 */

import { onCLS, onLCP, onTTFB, onINP, onFCP, Metric } from 'web-vitals';

// Performance metric types
export interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number;  // Cumulative Layout Shift
  lcp?: number;  // Largest Contentful Paint
  ttfb?: number; // Time to First Byte
  inp?: number;  // Interaction to Next Paint (replaced FID)
  
  // Custom metrics
  fcp?: number;  // First Contentful Paint
  tti?: number;  // Time to Interactive
  
  // Page info
  url: string;
  timestamp: number;
}

// Store metrics in memory
const metrics: PerformanceMetrics = {
  url: window.location.href,
  timestamp: Date.now(),
};

/**
 * Report metric to analytics service
 * In production, this would send to your analytics platform
 */
function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    url: window.location.href,
    timestamp: Date.now(),
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
    });
  }

  // In production, send to analytics service
  // Example: navigator.sendBeacon('/api/analytics', body);
  
  // Store in localStorage for debugging
  try {
    const stored = localStorage.getItem('performance-metrics') || '[]';
    const allMetrics = JSON.parse(stored);
    allMetrics.push(JSON.parse(body));
    // Keep only last 50 measurements
    if (allMetrics.length > 50) {
      allMetrics.shift();
    }
    localStorage.setItem('performance-metrics', JSON.stringify(allMetrics));
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Initialize Core Web Vitals monitoring
 */
export function initPerformanceMonitoring() {
  // Measure Cumulative Layout Shift (CLS)
  // Good: < 0.1, Needs improvement: 0.1-0.25, Poor: > 0.25
  onCLS((metric) => {
    metrics.cls = metric.value;
    sendToAnalytics(metric);
  });

  // Measure First Contentful Paint (FCP)
  // Good: < 1.8s, Needs improvement: 1.8-3s, Poor: > 3s
  onFCP((metric: Metric) => {
    metrics.fcp = metric.value;
    sendToAnalytics(metric);
  });

  // Measure Largest Contentful Paint (LCP)
  // Good: < 2.5s, Needs improvement: 2.5-4s, Poor: > 4s
  onLCP((metric) => {
    metrics.lcp = metric.value;
    sendToAnalytics(metric);
  });

  // Measure Time to First Byte (TTFB)
  // Good: < 800ms, Needs improvement: 800-1800ms, Poor: > 1800ms
  onTTFB((metric) => {
    metrics.ttfb = metric.value;
    sendToAnalytics(metric);
  });

  // Measure Interaction to Next Paint (INP)
  // Good: < 200ms, Needs improvement: 200-500ms, Poor: > 500ms
  onINP((metric) => {
    metrics.inp = metric.value;
    sendToAnalytics(metric);
  });

  // Log initial performance metrics
  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance] Monitoring initialized');
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return { ...metrics };
}

/**
 * Clear stored performance metrics
 */
export function clearPerformanceMetrics() {
  try {
    localStorage.removeItem('performance-metrics');
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Get stored performance metrics from localStorage
 */
export function getStoredMetrics(): any[] {
  try {
    const stored = localStorage.getItem('performance-metrics') || '[]';
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

/**
 * Calculate average metrics from stored data
 */
export function getAverageMetrics() {
  const stored = getStoredMetrics();
  
  if (stored.length === 0) {
    return null;
  }

  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  stored.forEach((metric: any) => {
    const name = metric.name;
    const value = metric.value;
    
    if (!sums[name]) {
      sums[name] = 0;
      counts[name] = 0;
    }
    
    sums[name] += value;
    counts[name]++;
  });

  const averages: Record<string, number> = {};
  Object.keys(sums).forEach((name) => {
    averages[name] = sums[name] / counts[name];
  });

  return averages;
}

/**
 * Measure custom timing
 */
export function measureTiming(name: string, startMark: string, endMark: string) {
  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
    }
    
    return measure.duration;
  } catch (e) {
    console.error('Error measuring timing:', e);
    return 0;
  }
}

/**
 * Mark a performance point
 */
export function mark(name: string) {
  try {
    performance.mark(name);
  } catch (e) {
    console.error('Error marking performance:', e);
  }
}

/**
 * Get navigation timing metrics
 */
export function getNavigationTiming() {
  const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!perfData) {
    return null;
  }

  return {
    // DNS lookup time
    dns: perfData.domainLookupEnd - perfData.domainLookupStart,
    
    // TCP connection time
    tcp: perfData.connectEnd - perfData.connectStart,
    
    // Request time
    request: perfData.responseStart - perfData.requestStart,
    
    // Response time
    response: perfData.responseEnd - perfData.responseStart,
    
    // DOM processing time
    domProcessing: perfData.domComplete - perfData.domInteractive,
    
    // DOM content loaded
    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
    
    // Load complete
    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
    
    // Total page load time
    totalPageLoad: perfData.loadEventEnd - perfData.fetchStart,
  };
}

/**
 * Get resource timing metrics
 */
export function getResourceTiming() {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const stats = {
    total: resources.length,
    totalSize: 0,
    totalDuration: 0,
    byType: {} as Record<string, { count: number; size: number; duration: number }>,
  };

  resources.forEach((resource) => {
    const duration = resource.responseEnd - resource.startTime;
    const size = resource.transferSize || 0;
    
    stats.totalDuration += duration;
    stats.totalSize += size;
    
    // Determine resource type from name
    let type = 'other';
    if (resource.name.endsWith('.js')) type = 'script';
    else if (resource.name.endsWith('.css')) type = 'stylesheet';
    else if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) type = 'image';
    else if (resource.name.match(/\.(woff|woff2|ttf|eot)$/)) type = 'font';
    
    if (!stats.byType[type]) {
      stats.byType[type] = { count: 0, size: 0, duration: 0 };
    }
    
    stats.byType[type].count++;
    stats.byType[type].size += size;
    stats.byType[type].duration += duration;
  });

  return stats;
}

/**
 * Log performance summary to console
 */
export function logPerformanceSummary() {
  console.group('📊 Performance Summary');
  
  // Core Web Vitals
  console.group('Core Web Vitals');
  const vitals = getPerformanceMetrics();
  if (vitals.lcp) console.log(`LCP: ${vitals.lcp.toFixed(2)}ms`);
  if (vitals.fcp) console.log(`FCP: ${vitals.fcp.toFixed(2)}ms`);
  if (vitals.cls) console.log(`CLS: ${vitals.cls.toFixed(4)}`);
  if (vitals.ttfb) console.log(`TTFB: ${vitals.ttfb.toFixed(2)}ms`);
  if (vitals.inp) console.log(`INP: ${vitals.inp.toFixed(2)}ms`);
  console.groupEnd();
  
  // Navigation timing
  console.group('Navigation Timing');
  const nav = getNavigationTiming();
  if (nav) {
    console.log(`DNS: ${nav.dns.toFixed(2)}ms`);
    console.log(`TCP: ${nav.tcp.toFixed(2)}ms`);
    console.log(`Request: ${nav.request.toFixed(2)}ms`);
    console.log(`Response: ${nav.response.toFixed(2)}ms`);
    console.log(`DOM Processing: ${nav.domProcessing.toFixed(2)}ms`);
    console.log(`Total Load: ${nav.totalPageLoad.toFixed(2)}ms`);
  }
  console.groupEnd();
  
  // Resource timing
  console.group('Resource Timing');
  const resources = getResourceTiming();
  console.log(`Total Resources: ${resources.total}`);
  console.log(`Total Size: ${(resources.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Total Duration: ${resources.totalDuration.toFixed(2)}ms`);
  console.log('By Type:', resources.byType);
  console.groupEnd();
  
  console.groupEnd();
}

// Export window interface for debugging
declare global {
  interface Window {
    performanceMonitor: {
      getMetrics: typeof getPerformanceMetrics;
      getStored: typeof getStoredMetrics;
      getAverage: typeof getAverageMetrics;
      clear: typeof clearPerformanceMetrics;
      logSummary: typeof logPerformanceSummary;
      getNavigation: typeof getNavigationTiming;
      getResources: typeof getResourceTiming;
    };
  }
}

// Make available in console for debugging
if (typeof window !== 'undefined') {
  window.performanceMonitor = {
    getMetrics: getPerformanceMetrics,
    getStored: getStoredMetrics,
    getAverage: getAverageMetrics,
    clear: clearPerformanceMetrics,
    logSummary: logPerformanceSummary,
    getNavigation: getNavigationTiming,
    getResources: getResourceTiming,
  };
}
