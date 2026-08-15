/**
 * Home Controller
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { BaseController } = require('./base.controller');
const { sendSuccess } = require('../utils/response');
const { logger } = require('../utils/logger');
const { BadRequestError } = require('../utils/errors');
const { HomeExtractor } = require('../extractors/home.extractor');

class HomeController extends BaseController {
  async home(_req, res, next) {
    await this.execute(_req, res, next, async () => {
      try {
        const provider = _req.query.provider;
        const homeExtractor = new HomeExtractor(provider);
        const homeData = await homeExtractor.extractFromFile(null);

        sendSuccess(res, homeData);
      } catch (error) {
        logger.error('Error extracting home page data', error);
        throw new BadRequestError('Failed to extract home page data');
      }
    });
  }
}

module.exports = { HomeController };
