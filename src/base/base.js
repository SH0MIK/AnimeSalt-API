/**
 * Base Scraper for multi-provider AnimeSalt / WatchAnimeWorld sites
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { resolveProvider, DEFAULT_PROVIDER } = require('../config/providers');

class WatchAnimeWorldBase {
  /**
   * @param {string} [providerKey] - Provider id or alias (e.g. 'animesalt', 'watchanimeworld')
   */
  constructor(providerKey = DEFAULT_PROVIDER) {
    const provider = resolveProvider(providerKey);
    this.providerId = provider.id;
    this.providerName = provider.name;
    this.baseUrl = provider.baseUrl;
  }

  buildUrl(path) {
    if (!path) return this.baseUrl;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }
}

module.exports = { WatchAnimeWorldBase };
