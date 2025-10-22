// Simple cache-control middleware for API routes
export const noCache = (req, res, next) => {
  // Only apply to API routes
  if (req.path.startsWith('/api')) {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    // Disable ETag to avoid 304 based on ETag
    res.removeHeader && res.removeHeader('ETag');
  }
  next();
};

export default noCache;
