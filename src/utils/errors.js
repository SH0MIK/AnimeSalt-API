/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors) {
    super(message, 400);
    this.errors = errors;
  }
}

class ScraperError extends AppError {
  constructor(message = 'Scraping failed', originalError) {
    super(message, 500);
    this.originalError = originalError;
  }
}

module.exports = {
  AppError,
  NotFoundError,
  BadRequestError,
  ValidationError,
  ScraperError,
};
