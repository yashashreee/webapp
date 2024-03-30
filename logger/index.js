const { LoggingWinston } = require('@google-cloud/logging-winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

const loggingWinston = new LoggingWinston({
  level: 'info',
});

const logger = createLogger({
  transports: [
    new transports.File({
      filename: `/info.log`,
      level: 'info',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: `/error.log`,
      level: 'error',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: `/warn.log`,
      level: 'warn',
      format: combine(
        timestamp(),
        json()
      )
    }),

    loggingWinston
  ]
});

module.exports = logger;
