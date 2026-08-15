/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const cheerio = require('cheerio');
const { httpClient } = require('../utils/http');
const { logger } = require('../utils/logger');
const { ScraperError } = require('../utils/errors');

class BaseExtractor {
  async scrape(url, options) {
    try {
      logger.info(`Scraping URL: ${url}`);
      const html = await httpClient.get(url, options);
      const data = await this.extract(html, url);

      return {
        data,
        metadata: {
          url,
          extractedAt: new Date().toISOString(),
          source: this.getSourceName(),
          provider: this.base?.providerId || 'unknown',
        },
      };
    } catch (error) {
      logger.error(`Failed to scrape ${url}`, error);
      throw new ScraperError(
        `Failed to scrape ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  loadCheerio(html) {
    return cheerio.load(html);
  }

  sanitizeText(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  extractAttribute(element, attribute) {
    return element?.attr(attribute)?.trim() || '';
  }

  extractText(element) {
    return this.sanitizeText(element?.text());
  }

  /**
   * Normalize image URLs across providers.
   * Handles protocol-relative URLs and known CDN domain swaps.
   */
  normalizeImageUrl(imageUrl) {
    if (!imageUrl) return '';

    // Protocol-relative → https
    if (imageUrl.startsWith('//')) {
      imageUrl = `https:${imageUrl}`;
    }

    // Common CDN / legacy domain fixes (both sites share similar image infra)
    imageUrl = imageUrl
      .replace(/img\.anime-world\.co/g, 'img.watchanimeworld.net')
      .replace(/http:\/\//g, 'https://');

    return imageUrl;
  }

  /**
   * Extract slug / type from a full or relative content URL.
   */
  parseContentUrl(link) {
    if (!link) {
      return { id: '', type: 'unknown' };
    }

    const fullUrl = this.base ? this.base.buildUrl(link) : link;
    const cleanUrl = fullUrl.replace(/\/$/, '');
    const urlParts = cleanUrl.split('/').filter(Boolean);
    const id = urlParts[urlParts.length - 1] || '';

    let type = 'unknown';
    if (fullUrl.includes('/series/')) {
      type = 'series';
    } else if (fullUrl.includes('/movies/') || fullUrl.includes('/movie/')) {
      type = 'movie';
    }

    return { id, type, fullUrl };
  }
}

module.exports = { BaseExtractor };
