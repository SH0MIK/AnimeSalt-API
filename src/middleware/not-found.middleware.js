/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const path = require('path');

function notFoundMiddleware(req, res) {
  // Serve 404.html for all routes (including API routes)
  res.status(404).sendFile(path.join(__dirname, '../../public/404.html'));
}

module.exports = { notFoundMiddleware };
