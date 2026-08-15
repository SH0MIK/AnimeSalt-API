/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

function sendSuccess(res, data, message, statusCode = 200) {
  const response = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

function sendError(res, error, statusCode = 500, message) {
  const errorMessage = error instanceof Error ? error.message : error;
  const response = {
    success: false,
    error: errorMessage,
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

function sendPaginated(res, data, page, limit, total) {
  const totalPages = Math.ceil(total / limit);
  const response = {
    success: true,
    data: {
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(response);
}

module.exports = { sendSuccess, sendError, sendPaginated };
