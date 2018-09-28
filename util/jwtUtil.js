const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const logger = require('./logger');

const jwtPrivateKey = config.get("jwtPrivateKey");
if (!jwtPrivateKey) {
  logger.error("JWT Private Key is not defined: nodejs01_jwtPrivateKey");
  process.exit(1)
}

/**
 * Generate JWT token for a given user object
 *
 * @param {Object} user a user object with {id, email, name, ...}
 * @returns JWT token
 */
const sign = user => {
  return jwt.sign(_.pick(user, ["_id", "email", "name", "roles"]), jwtPrivateKey);
};

/**
 * Verify JWT token with private key
 * @param {String} token a JWT token to be verified
 * @returns user object if token is valid, null otherwise
 */
const verify = token => {
  try {
    return jwt.verify(token, jwtPrivateKey);
  } catch (err) {
    logger.warn("[jwtUtil] invalid token found", err);
    return null;
  }
};

const headerKey = "x-auth-token";

module.exports = { sign, verify, headerKey };
