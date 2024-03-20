const { LoggingWinston } = require('@google-cloud/logging-winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

const loggingWinston = new LoggingWinston();

const logger = createLogger({
  transports: [
    loggingWinston,
    
    new transports.File({
      filename: `/var/logs/info.log`,
      level: 'INFO',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: `/var/logs/error.log`,
      level: 'ERROR',
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
