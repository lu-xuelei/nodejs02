const mongoose = require("mongoose");
const config = require("config");

const logger = require("../util/logger");

const dbUrl = config.get("database.url");

// Connect to mongo database
mongoose
  .connect(
    dbUrl,
    { useNewUrlParser: true }
  )
  .then(() => {
    logger.debug("[connection] Connected to nodejs01");
  });

module.exports = mongoose;
