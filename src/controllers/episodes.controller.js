/**
 * Episodes Controller
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { BaseController } = require('./base.controller');
const { logger } = require('../utils/logger');
const { BadRequestError } = require('../utils/errors');
const { EpisodesExtractor } = require('../extractors/episodes.extractor');

class EpisodesController extends BaseController {
  async getEpisodes(req, res, next) {
    await this.execute(req, res, next, async () => {
      try {
        const { id, season } = req.params;

        if (!id) {
          throw new BadRequestError('ID parameter is required');
        }

        if (!season) {
          throw new BadRequestError('Season parameter is required');
        }

        const seasonNum = parseInt(season, 10);
        if (isNaN(seasonNum) || seasonNum < 1) {
          throw new BadRequestError('Season must be a positive integer');
        }

        const provider = req.query.provider;
        const episodesExtractor = new EpisodesExtractor(provider);
        const result = await episodesExtractor.extractFromAjax(id, seasonNum);

        res.status(200).json({
          id: id,
          postId: result.postId,
          season: seasonNum,
          episodes: result.episodes,
        });
      } catch (error) {
        logger.error('Error extracting episodes data', error);
        throw new BadRequestError(`Failed to extract episodes data: ${error.message}`);
      }
    });
  }
}

module.exports = { EpisodesController };
