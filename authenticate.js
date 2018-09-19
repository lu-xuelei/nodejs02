/**
 * Define a middleware for authentication
 */
const authenticate = (req, res, next) => {
  // processing the necessary logic
  console.log("[authenticate.js] authenticating user...");

  // pass to next step
  next();
}

module.exports = authenticate;