/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { sendError } = require('../utils/response');
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');
const { ZodError } = require('zod');

function errorMiddleware(error, _req, res, _next) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    sendError(res, 'Validation failed', 400, JSON.stringify(errors));
    return;
  }

  // Handle custom application errors
  if (error instanceof AppError) {
    sendError(res, error, error.statusCode);
    return;
  }

  // Handle generic errors
  if (error instanceof Error) {
    logger.error('Unhandled error', error);
    sendError(res, error, 500);
    return;
  }

  // Handle unknown errors
  logger.error('Unknown error', error);
  sendError(res, 'An unexpected error occurred', 500);
}

module.exports = { errorMiddleware };
