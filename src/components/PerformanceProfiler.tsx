import { Profiler, ProfilerOnRenderCallback } from 'react';
import { ReactNode } from 'react';

/**
 * Performance Profiler Component
 * 
 * Wraps components to measure render performance
 * Logs metrics in development mode
 */

interface PerformanceProfilerProps {
  id: string;
  children: ReactNode;
  logResults?: boolean;
}

// Store render times for analysis
const renderTimes: Record<string, number[]> = {};

/**
 * Callback function for Profiler
 */
const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  // Store render time
  if (!renderTimes[id]) {
    renderTimes[id] = [];
  }
  renderTimes[id].push(actualDuration);

  // Log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Profiler] ${id} - ${phase}:`, {
      actualDuration: `${actualDuration.toFixed(2)}ms`,
      baseDuration: `${baseDuration.toFixed(2)}ms`,
      startTime: `${startTime.toFixed(2)}ms`,
      commitTime: `${commitTime.toFixed(2)}ms`,
    });
  }

  // Warning for slow renders
  if (actualDuration > 16) {
    console.warn(
      `[Profiler] Slow render detected in ${id}: ${actualDuration.toFixed(2)}ms (>${16}ms threshold)`
    );
  }
};

/**
 * Performance Profiler Component
 */
export function PerformanceProfiler({
  id,
  children,
  logResults = false,
}: PerformanceProfilerProps) {
  return (
    <Profiler id={id} onRender={logResults ? onRenderCallback : () => {}}>
      {children}
    </Profiler>
  );
}

/**
 * Get render statistics for a component
 */
export function getRenderStats(id: string) {
  const times = renderTimes[id] || [];
  
  if (times.length === 0) {
    return null;
  }

  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  return {
    count: times.length,
    average: avg,
    min,
    max,
    total: sum,
  };
}

/**
 * Get all render statistics
 */
export function getAllRenderStats() {
  const stats: Record<string, any> = {};
  
  Object.keys(renderTimes).forEach((id) => {
    stats[id] = getRenderStats(id);
  });
  
  return stats;
}

/**
 * Clear render statistics
 */
export function clearRenderStats() {
  Object.keys(renderTimes).forEach((key) => {
    delete renderTimes[key];
  });
}

/**
 * Log render statistics to console
 */
export function logRenderStats() {
  console.group('📊 Component Render Statistics');
  
  const stats = getAllRenderStats();
  
  Object.entries(stats).forEach(([id, stat]) => {
    if (!stat) return;
    
    console.group(id);
    console.log(`Renders: ${stat.count}`);
    console.log(`Average: ${stat.average.toFixed(2)}ms`);
    console.log(`Min: ${stat.min.toFixed(2)}ms`);
    console.log(`Max: ${stat.max.toFixed(2)}ms`);
    console.log(`Total: ${stat.total.toFixed(2)}ms`);
    console.groupEnd();
  });
  
  console.groupEnd();
}

// Make available globally for debugging
declare global {
  interface Window {
    renderProfiler: {
      getStats: typeof getRenderStats;
      getAllStats: typeof getAllRenderStats;
      clearStats: typeof clearRenderStats;
      logStats: typeof logRenderStats;
    };
  }
}

if (typeof window !== 'undefined') {
  window.renderProfiler = {
    getStats: getRenderStats,
    getAllStats: getAllRenderStats,
    clearStats: clearRenderStats,
    logStats: logRenderStats,
  };
}

export default PerformanceProfiler;
