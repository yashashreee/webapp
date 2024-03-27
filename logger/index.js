const { LoggingWinston } = require('@google-cloud/logging-winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

const loggingWinston = new LoggingWinston({
  level: 'info'
});

const logger = createLogger({
  transports: [
    new transports.File({
      filename: `../logs/info.log`,
      level: 'info',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: `../logs/error.log`,
      level: 'error',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: `../logs/warn.log`,
      level: 'warn',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.Console({
      level: 'info',
      format: combine(
        timestamp(),
        json(),
        format.prettyPrint()
      )
    }),

    loggingWinston
  ]
});

module.exports = logger;
