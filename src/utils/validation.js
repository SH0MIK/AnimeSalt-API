/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { z } = require('zod');

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const idSchema = z.object({
  id: z.string().min(1),
});

function validateQuery(schema) {
  return (data) => {
    return schema.parse(data);
  };
}

function validateParams(schema) {
  return (data) => {
    return schema.parse(data);
  };
}

function validateBody(schema) {
  return (data) => {
    return schema.parse(data);
  };
}

module.exports = {
  paginationSchema,
  idSchema,
  validateQuery,
  validateParams,
  validateBody,
};
