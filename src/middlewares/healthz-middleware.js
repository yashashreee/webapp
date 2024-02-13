const responseHeaders = require('../headers');

const healthCheckMiddleware = (req, res, next) => {
  // anyother method is not allowed
  if (req.method !== 'GET') {
    return res.status(405).header(responseHeaders).json();
  }
  // check for a payload
  if (
    Object.keys(req.query).length > 0 ||
    Object.keys(req.params).length > 0 ||
    Object.keys(req.body).length > 0
    // (Object.keys(req.body).length === 0 && req.body.constructor === Object)
  ) {
    return res.status(400).header(responseHeaders).json();
  }
  next();
};

module.exports = {
  healthCheckMiddleware,
};