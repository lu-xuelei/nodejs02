const logger = require('../util/logger');

/**
 * Error handling middleware to be applied to end of routes
 */
module.exports = (err, req, res, next) => {
  logger.error(err.message, err);
  res.status(500).send("Internal System Error");
}