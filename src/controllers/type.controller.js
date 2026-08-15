/**
 * Type Controller
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { BaseController } = require('./base.controller');
const { logger } = require('../utils/logger');
const { BadRequestError } = require('../utils/errors');
const { TypeExtractor } = require('../extractors/type.extractor');

class TypeController extends BaseController {
  async getType(req, res, next) {
    await this.execute(req, res, next, async () => {
      try {
        const type = req.params.type;
        const pathType = req.params.pathType || 'category'; // 'category' or 'letter'
        const { page = 1 } = req.query;

        if (!type || type.trim() === '') {
          throw new BadRequestError('Type parameter is required');
        }

        // Validate page
        const pageNum = parseInt(page);
        if (isNaN(pageNum) || pageNum < 1) {
          throw new BadRequestError('Page must be a positive integer');
        }

        const provider = req.query.provider;
        const typeExtractor = new TypeExtractor(provider);
        const typeData = await typeExtractor.extractFromFile(null, type, pageNum, pathType);

        res.status(200).json({
          currentPage: typeData.pagination.currentPage,
          totalPages: typeData.pagination.totalPages,
          items: typeData.items,
        });
      } catch (error) {
        logger.error('Error extracting type page data', error);
        throw new BadRequestError('Failed to extract type page data');
      }
    });
  }
}

module.exports = { TypeController };
