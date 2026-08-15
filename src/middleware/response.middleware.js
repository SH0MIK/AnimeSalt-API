/**
 * Response Middleware
 * Automatically wraps API responses with success, timestamp, etc.
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

/**
 * Middleware to automatically wrap API responses
 * Only applies to /api routes
 */
function responseMiddleware(req, res, next) {
  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method to wrap response
  res.json = function (data) {
    // If response already has success field, don't wrap it again
    if (data && typeof data === 'object' && 'success' in data) {
      // Just ensure timestamp exists
      if (!data.timestamp) {
        data.timestamp = new Date().toISOString();
      }
      return originalJson(data);
    }

    // Handle special cases for pagination (currentPage, totalPages at top level)
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const hasPagination = 'currentPage' in data || 'totalPages' in data;
      
      if (hasPagination) {
        // Extract pagination fields
        const { currentPage, totalPages, ...restData } = data;
        
        // Wrap the response with pagination at top level
        const wrappedResponse = {
          success: true,
          currentPage: currentPage,
          totalPages: totalPages,
          data: restData,
          timestamp: new Date().toISOString(),
        };
        
        return originalJson(wrappedResponse);
      }
    }

    // For arrays, wrap in items object for consistency
    // For objects, wrap directly
    let responseData = data;
    if (Array.isArray(data)) {
      responseData = { items: data };
    }

    // Wrap the response
    const wrappedResponse = {
      success: true,
      data: responseData,
      timestamp: new Date().toISOString(),
    };

    return originalJson(wrappedResponse);
  };

  next();
}

module.exports = { responseMiddleware };
