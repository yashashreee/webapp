const { LoggingWinston } = require('@google-cloud/logging-winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, prettyPrint } = format;

const myFormat = printf(({ level, message,  timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const loggingWinston = new LoggingWinston({
  level: 'info',
  format: combine(
    timestamp(),
    colorize(),
    myFormat,
  )
});

const logger = createLogger({
  transports: [
    new transports.File({
      filename: `/var/log/webapp/info.log`,
      level: 'info',
      format: combine(
        timestamp(),
        prettyPrint()
      )
    }),

    new transports.File({
      filename: `/var/log/webapp/error.log`,
      level: 'error',
      format: combine(
        timestamp(),
        prettyPrint()
      )
    }),

    new transports.File({
      filename: `/var/log/webapp/warn.log`,
      level: 'warn',
      format: combine(
        timestamp(),
        prettyPrint()
      )
    }),

    new transports.Console({
      format: combine(
        timestamp(),
        format.prettyPrint()
      )
    }),

    loggingWinston
  ]
});

module.exports = logger;
