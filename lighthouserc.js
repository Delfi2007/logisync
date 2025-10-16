module.exports = {
  ci: {
    collect: {
      // Number of runs per URL
      numberOfRuns: 3,
      // URLs to test
      url: [
        'http://localhost:5173/login',
        'http://localhost:5173/dashboard',
        'http://localhost:5173/inventory',
        'http://localhost:5173/customers',
        'http://localhost:5173/warehouses',
        'http://localhost:5173/orders',
      ],
      // Lighthouse settings
      settings: {
        preset: 'desktop',
        // Run specific audits
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Throttling settings (simulated slow 4G)
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      // Performance budgets
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        
        // Core Web Vitals thresholds
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Resource budgets
        'resource-summary:script:size': ['warn', { maxNumericValue: 300000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 200000 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 1000000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
