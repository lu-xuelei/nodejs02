const winston = require("winston");

const logger = winston.createLogger({
  level: "silly",
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "logfile.log" })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

module.exports = logger;

// const debug = require('debug')('app:debug');
// const info = require('debug')('app:info');
// const warn = require('debug')('app:warn');
// const error = require('debug')('app:error');

// module.exports = {
//   debug, info, warn, error
// }
