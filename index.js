require("express-async-errors");

const express = require("express");
const config = require("config");

const logger = require("./src/util/logger");

const app = express();

// route all requests to specific router based on end points
require("./src/routes/routes")(app);

// Add subscription to handle uncaught exception and rejection
process.on("uncaughtException", ex => {
  logger.error(ex.message, ex);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  logger.error(err.message, err);
  process.exit(1);
});

// Start up the service and listen to a given port
const port = config.get("port") || 3000;
app.listen(port, () => {
  logger.info(`Listening to port ${port}`);
});
