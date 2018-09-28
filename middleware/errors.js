/**
 * Error handling middleware to be applied to end of routes
 */
module.exports = (err, req, res, next) => {
  res.status(500).send("Internal System Error");
}