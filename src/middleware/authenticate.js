const logger = require("../util/logger");
const jwt = require("../util/jwtUtil");

/**
 * Define a middleware for authentication
 */
const authenticate = (req, res, next) => {
  // processing the necessary logic
  logger.info("[authenticate] authenticating user...");
  const token = req.header(jwt.headerKey);
  if (!token) {
    return res.status(401).send("Access denied. Token not provided");
  }
  const decoded = jwt.verify(token);
  if (!decoded) {
    return res.status(401).send("Access denied. Token not valid");
  }

  // Authentication success, add user to request and pass to next step
  req.user = decoded;
  next();
};

module.exports = authenticate;
