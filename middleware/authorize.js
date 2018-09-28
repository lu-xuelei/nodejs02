const logger = require("../util/logger");

const ROLES = {
  ADMIN: "ADMIN",
}
/**
 * Define a middlewares for authorization
 */
const admin = (req, res, next) => {
  // processing the necessary logic
  logger.info("[authorize] check admin role for user");
  const roles = req.user.roles;
  if (!roles || roles.indexOf(ROLES.ADMIN) < 0) {
    return res.status(403).send("Access denied");
  }
  next();
};

module.exports = {admin};
