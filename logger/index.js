const { LoggingWinston } = require('@google-cloud/logging-winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;
const appRoot = require("app-root-path");

const loggingWinston = new LoggingWinston();

const logger = createLogger({
  transports: [
    loggingWinston,
    
    new transports.File({
      filename: `${appRoot}/logs/info.log`,
      level: 'info',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: `${appRoot}/logs/error.log`,
      level: 'error',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.Console({
      format: combine(
        timestamp(),
        json(),
        format.prettyPrint()
      )
    })
  ]
});

module.exports = logger;
