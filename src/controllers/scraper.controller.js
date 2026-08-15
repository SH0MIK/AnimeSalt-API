/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { BaseController } = require('./base.controller');
const { sendSuccess } = require('../utils/response');
const { logger } = require('../utils/logger');
const { BadRequestError } = require('../utils/errors');
const { listProviders, DEFAULT_PROVIDER } = require('../config/providers');

class ScraperController extends BaseController {
  async scrape(req, res, next) {
    await this.execute(req, res, next, async () => {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        throw new BadRequestError('URL is required');
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        throw new BadRequestError('Invalid URL format');
      }

      logger.info(`Scrape request received for: ${url}`);

      // TODO: Implement extractor selection logic based on URL or extractor parameter
      // For now, this is a placeholder
      sendSuccess(res, { message: 'Scraper endpoint ready', url }, 'Scrape request received');
    });
  }

  async health(_req, res, next) {
    await this.execute(_req, res, next, async () => {
      sendSuccess(
        res,
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          defaultProvider: DEFAULT_PROVIDER,
          providers: listProviders(),
        },
        'Service is healthy'
      );
    });
  }

  async providers(_req, res, next) {
    await this.execute(_req, res, next, async () => {
      sendSuccess(
        res,
        {
          default: DEFAULT_PROVIDER,
          providers: listProviders(),
        },
        'Available scrape providers'
      );
    });
  }
}

module.exports = { ScraperController };
