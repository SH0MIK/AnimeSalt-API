/**
 * Embed Controller
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { BaseController } = require('./base.controller');
const { logger } = require('../utils/logger');
const { BadRequestError } = require('../utils/errors');
const { EmbedExtractor } = require('../extractors/embed.extractor');

class EmbedController extends BaseController {
  async getEmbed(req, res, next) {
    await this.execute(req, res, next, async () => {
      try {
        const { id } = req.params;

        if (!id) {
          throw new BadRequestError('ID parameter is required');
        }

        const provider = req.query.provider;
        const embedExtractor = new EmbedExtractor(provider);
        const embedData = await embedExtractor.extractFromUrl(id);

        res.status(200).json(embedData);
      } catch (error) {
        logger.error('Error extracting embed data', error);
        throw new BadRequestError(`Failed to extract embed data: ${error.message}`);
      }
    });
  }
}

module.exports = { EmbedController };
