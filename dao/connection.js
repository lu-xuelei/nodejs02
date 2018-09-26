const mongoose = require("mongoose");

const logger = require("../util/logger");

// Connect to mongo database
mongoose
  .connect(
    "mongodb://localhost/nodejs01",
    { useNewUrlParser: true }
  )
  .then(() => {
    logger.debug("[connection] Connected to nodejs01");
  })
  .catch(err => {
    logger.debug("[connection] Failed to connect to nodejs01");
  });

module.exports = mongoose;