const logger = require('../util/logger');

/**
 * Define a logging middleware 
 */
const requestLogger = (req, res, next) => {
  // processing the necessary logic
  logger.info("[logging.js] logging...");

  // pass to next step
  next();
}

module.exports = requestLogger;