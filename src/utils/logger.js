/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { config } = require('../config');

class Logger {
  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}`;
  }

  info(message, ...args) {
    console.log(this.formatMessage('info', message), ...args);
  }

  warn(message, ...args) {
    console.warn(this.formatMessage('warn', message), ...args);
  }

  error(message, error, ...args) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(this.formatMessage('error', message, errorMessage), ...args);
    if (error instanceof Error && config.isDevelopment) {
      console.error(error.stack);
    }
  }

  debug(message, ...args) {
    if (config.isDevelopment) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }
}

const logger = new Logger();

module.exports = { logger };
