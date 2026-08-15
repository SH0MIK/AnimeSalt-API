/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

module.exports = {
  ...require('./error.middleware'),
  ...require('./not-found.middleware'),
  ...require('./validation.middleware'),
};
