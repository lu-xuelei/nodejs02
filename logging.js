/**
 * Define a logging middleware 
 */
const logger = (req, res, next) => {
  // processing the necessary logic
  console.log("[logging.js] logging...");

  // pass to next step
  next();
}

module.exports = logger;