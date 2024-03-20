const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

const logger = createLogger({
  transports: [
    new transports.File({
      filename: `/var/log/webapp/info.log`,
      level: 'INFO',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: `/var/log/webapp/error.log`,
      level: 'ERROR',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: `/var/log/webapp/warn.log`,
      level: 'WARNING',
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
