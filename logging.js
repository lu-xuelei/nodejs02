const debug = require('debug')('app:debug');
const info = require('debug')('app:info');
const warn = require('debug')('app:warn');
const error = require('debug')('app:error');

/**
 * Define a logging middleware 
 */
const logger = (req, res, next) => {
  // processing the necessary logic
  info("[logging.js] logging...");

  // pass to next step
  next();
}


module.exports = {
  debug, info, warn, error, logger
}