/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const axios = require('axios');
const { logger } = require('./logger');

class HttpClient {
  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`HTTP Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('HTTP Request Error', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`HTTP Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error(
          `HTTP Error: ${error.response?.status || 'Unknown'} ${error.config?.url || 'Unknown URL'}`,
          error
        );
        return Promise.reject(error);
      }
    );
  }

  async get(url, options = {}) {
    const config = {
      url,
      method: 'GET',
      timeout: options?.timeout ?? 30000,
      headers: {
        ...this.client.defaults.headers,
        ...options?.headers,
      },
    };

    let lastError;
    // Default to 2 retries for flaky streaming sites / Cloudflare
    const retries = options?.retries ?? 2;
    const retryDelay = options?.retryDelay ?? 1000;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.client.request(config);
        return response.data;
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          logger.warn(`Request failed, retrying... (${attempt + 1}/${retries})`);
          await this.delay(retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError;
  }

  async getBuffer(url, options = {}) {
    const config = {
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: options?.timeout,
      headers: {
        ...this.client.defaults.headers,
        ...options?.headers,
      },
    };

    const response = await this.client.request(config);
    return Buffer.from(response.data);
  }

  async post(url, data, options = {}) {
    const config = {
      url,
      method: 'POST',
      data,
      timeout: options?.timeout,
      headers: {
        ...this.client.defaults.headers,
        ...options?.headers,
      },
    };

    let lastError;
    const retries = options?.retries ?? 0;
    const retryDelay = options?.retryDelay ?? 1000;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.client.request(config);
        return response.data;
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          logger.warn(`Request failed, retrying... (${attempt + 1}/${retries})`);
          await this.delay(retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const httpClient = new HttpClient();

module.exports = { httpClient };
