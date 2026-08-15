/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { ZodError } = require('zod');
const { ValidationError } = require('../utils/errors');

function validateBody(schema) {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError('Request body validation failed', error.errors);
      }
      next(error);
    }
  };
}

function validateQuery(schema) {
  return (req, _res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError('Query parameter validation failed', error.errors);
      }
      next(error);
    }
  };
}

function validateParams(schema) {
  return (req, _res, next) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError('URL parameter validation failed', error.errors);
      }
      next(error);
    }
  };
}

module.exports = { validateBody, validateQuery, validateParams };
