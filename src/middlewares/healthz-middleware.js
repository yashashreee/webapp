const responseHeaders = require('../headers');
const logger = require('./logger/index');

const healthCheckMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    logger.error(`Service not allowed - ${req.method}`);
    return res.status(405).header(responseHeaders).json();
  }
  if (
    Object.keys(req.query).length > 0 ||
    Object.keys(req.params).length > 0 ||
    Object.keys(req.body).length > 0
    // (Object.keys(req.body).length === 0 && req.body.constructor === Object)
  ) {
    logger.error('Bad Request');
    return res.status(400).header(responseHeaders).json();
  }
  next();
};

module.exports = {
  healthCheckMiddleware,
};