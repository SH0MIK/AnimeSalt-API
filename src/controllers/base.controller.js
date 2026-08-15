/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { sendError } = require('../utils/response');
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');

class BaseController {
  handleError(error, req, res, next) {
    if (error instanceof AppError) {
      sendError(res, error, error.statusCode);
      return;
    }

    if (error instanceof Error) {
      logger.error('Unhandled error in controller', error);
      sendError(res, error, 500);
      return;
    }

    logger.error('Unknown error in controller', error);
    sendError(res, 'An unexpected error occurred', 500);
  }

  async execute(req, res, next, handler) {
    try {
      await handler();
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }
}

module.exports = { BaseController };
