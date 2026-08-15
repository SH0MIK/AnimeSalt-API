/**
 * Router Configuration
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { config } = require('./config');
const { errorMiddleware } = require('./middleware/error.middleware');
const { notFoundMiddleware } = require('./middleware/not-found.middleware');
const { responseMiddleware } = require('./middleware/response.middleware');
const apiRoutes = require('./routes');

function getCorsOrigin(origin) {
  if (origin === '*' || !origin) return '*';
  if (typeof origin === 'string' && origin.includes(',')) {
    return origin.split(',').map((o) => o.trim());
  }
  return origin;
}

function getAllowedOrigins() {
  const origin = process.env.CORS_ORIGIN || '*';
  if (origin === '*') return '*';
  if (typeof origin === 'string' && origin.includes(',')) {
    return origin.split(',').map((o) => o.trim());
  }
  return [origin];
}

function setupRouter(app) {
  // Security middleware
  app.use(helmet());

  // Origin blocking middleware for API routes only
  app.use('/api', (req, res, next) => {
    const allowedOrigins = getAllowedOrigins();
    
    // If '*' is allowed, skip origin check
    if (allowedOrigins === '*') {
      return next();
    }

    const origin = req.headers.origin;
    const referer = req.headers.referer || req.headers.referrer;
    
    // Extract origin from referer if origin is not present
    let requestOrigin = origin;
    if (!requestOrigin && referer) {
      try {
        const refererUrl = new URL(referer);
        requestOrigin = refererUrl.origin;
      } catch (e) {
        // Invalid referer URL, ignore
      }
    }
    
    // Block requests without origin or referer
    if (!requestOrigin) {
      return res.status(403).sendFile(path.join(__dirname, '../public/403.html'));
    }

    // Check if origin is in allowed list
    if (Array.isArray(allowedOrigins) && allowedOrigins.includes(requestOrigin)) {
      return next();
    }

    // Block the request - origin not allowed
    return res.status(403).sendFile(path.join(__dirname, '../public/403.html'));
  });

  // CORS configuration - Only allow GET requests
  const corsOptions = {
    origin: getCorsOrigin(config.cors.origin),
    credentials: config.cors.credentials,
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));

  // Compression middleware
  app.use(compression());

  // Only allow GET requests for API routes
  app.use('/api', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'OPTIONS') {
      return res.status(405).json({
        error: 'Method Not Allowed',
        message: 'Only GET requests are allowed',
      });
    }
    next();
  });

  // Serve static files from public directory
  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath, {
    index: 'index.html',
    extensions: ['html', 'htm']
  }));

  // API response middleware - automatically wraps responses with success, timestamp
  app.use('/api', responseMiddleware);

  // API routes
  app.use('/api', apiRoutes);

  // Serve index.html for root route
  app.get('/', (_req, res) => {
    const indexPath = path.join(__dirname, '../public/index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        logger.error('Error serving index.html', err);
        res.status(500).send('Error loading page');
      }
    });
  });

  // 404 handling middleware (must be after all routes)
  // This will handle unmatched routes - JSON for API, HTML for others
  app.use(notFoundMiddleware);

  // Error handling middleware (must be last)
  app.use(errorMiddleware);
}

module.exports = { setupRouter };
