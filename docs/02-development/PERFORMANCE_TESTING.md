# Performance Testing Guide

## Overview

This guide covers performance testing for the LogiSync application using Lighthouse CI and web-vitals monitoring.

## Prerequisites

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Build the Application:**
   ```bash
   npm run build
   ```

## Running Performance Tests

### Option 1: Automated Lighthouse CI Tests

Run complete Lighthouse audits across all pages:

```bash
# Start preview server and run Lighthouse tests
npm run perf:test
```

This command will:
1. Build the production bundle
2. Start a preview server
3. Run Lighthouse audits on all configured pages
4. Generate performance reports

### Option 2: Manual Lighthouse Tests

**Step 1: Start Preview Server**
```bash
npm run preview
```

**Step 2: Run Lighthouse Collection**
```bash
npm run lighthouse:collect
```

**Step 3: Assert Performance Budgets**
```bash
npm run lighthouse:assert
```

### Option 3: Browser DevTools

1. Open application in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select categories: Performance, Accessibility, Best Practices, SEO
5. Click "Analyze page load"

## Core Web Vitals Monitoring

The application automatically monitors Core Web Vitals in both development and production.

### Available Metrics

- **LCP (Largest Contentful Paint)**: Time for largest content element to render
  - Good: < 2.5s
  - Needs Improvement: 2.5-4s
  - Poor: > 4s

- **FCP (First Contentful Paint)**: Time for first content to appear
  - Good: < 1.8s
  - Needs Improvement: 1.8-3s
  - Poor: > 3s

- **CLS (Cumulative Layout Shift)**: Visual stability score
  - Good: < 0.1
  - Needs Improvement: 0.1-0.25
  - Poor: > 0.25

- **TTFB (Time to First Byte)**: Server response time
  - Good: < 800ms
  - Needs Improvement: 800-1800ms
  - Poor: > 1800ms

- **INP (Interaction to Next Paint)**: Responsiveness
  - Good: < 200ms
  - Needs Improvement: 200-500ms
  - Poor: > 500ms

### Accessing Metrics

**In Browser Console:**

```javascript
// Get current metrics
window.performanceMonitor.getMetrics()

// Get stored metrics from localStorage
window.performanceMonitor.getStored()

// Get average metrics
window.performanceMonitor.getAverage()

// Clear stored metrics
window.performanceMonitor.clear()

// Log full performance summary
window.performanceMonitor.logSummary()

// Get navigation timing
window.performanceMonitor.getNavigation()

// Get resource timing
window.performanceMonitor.getResources()
```

## React Component Profiling

Profile React component render performance:

**In Browser Console:**

```javascript
// Get stats for specific component
window.renderProfiler.getStats('ComponentName')

// Get all component stats
window.renderProfiler.getAllStats()

// Log all stats to console
window.renderProfiler.logStats()

// Clear stats
window.renderProfiler.clearStats()
```

## Performance Budgets

### Configured Budgets (lighthouserc.js)

**Performance Scores:**
- Performance: > 80% (error if fails)
- Accessibility: > 90% (warning)
- Best Practices: > 90% (warning)
- SEO: > 90% (warning)

**Core Web Vitals:**
- First Contentful Paint: < 2000ms (warning)
- Largest Contentful Paint: < 2500ms (error)
- Cumulative Layout Shift: < 0.1 (error)
- Total Blocking Time: < 300ms (warning)

**Resource Budgets:**
- JavaScript: < 300 KB
- CSS: < 50 KB
- Images: < 200 KB
- Total: < 1000 KB

## Interpreting Results

### Lighthouse Score Ranges

- **90-100**: Excellent - No action needed
- **50-89**: Good - Minor improvements possible
- **0-49**: Poor - Needs optimization

### Common Issues and Fixes

**Issue: Large JavaScript Bundles**
- Solution: Code splitting, lazy loading, tree shaking
- Check: `stats.html` for bundle analysis

**Issue: Slow LCP**
- Solution: Optimize images, lazy load below-fold content
- Check: Network tab for large resources

**Issue: High CLS**
- Solution: Set image dimensions, avoid dynamic content insertion
- Check: Layout shift regions in DevTools

**Issue: Long TTFB**
- Solution: Optimize server response, use CDN, enable caching
- Check: Network timing in DevTools

**Issue: Poor INP**
- Solution: Reduce JavaScript execution, optimize event handlers
- Check: Performance profiler for long tasks

## Continuous Monitoring

### Local Development

Core Web Vitals are automatically monitored and logged to console in development mode.

### Production

Metrics are stored in localStorage and can be retrieved for analysis:

```javascript
const metrics = window.performanceMonitor.getStored();
console.table(metrics);
```

In production, these metrics should be sent to an analytics service (e.g., Google Analytics, Sentry, Custom endpoint).

## Optimization Checklist

- [ ] Bundle size < 300 KB per chunk
- [ ] LCP < 2.5s
- [ ] FCP < 1.8s
- [ ] CLS < 0.1
- [ ] TTFB < 800ms
- [ ] INP < 200ms
- [ ] Images optimized and lazy-loaded
- [ ] Code split by route
- [ ] Vendor libraries separated
- [ ] Compression enabled (gzip/brotli)
- [ ] Caching headers configured
- [ ] No console.logs in production
- [ ] Source maps disabled in production

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [React Profiler API](https://react.dev/reference/react/Profiler)
- [Vite Performance](https://vitejs.dev/guide/performance.html)

## Troubleshooting

### Lighthouse Tests Fail to Run

**Issue**: Preview server not starting
```bash
# Manually start preview server first
npm run preview

# In another terminal, run lighthouse
npm run lighthouse
```

### Web Vitals Not Logging

**Issue**: Metrics not appearing in console
- Check browser console for errors
- Ensure `initPerformanceMonitoring()` is called
- Verify web-vitals package is installed

### High Memory Usage

**Issue**: localStorage full
```javascript
// Clear old metrics
window.performanceMonitor.clear()
```

## Next Steps

1. Run initial performance baseline
2. Identify bottlenecks
3. Implement optimizations
4. Re-run tests to verify improvements
5. Set up continuous monitoring in CI/CD
