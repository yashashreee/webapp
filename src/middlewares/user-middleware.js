const bcrypt = require('bcrypt');
const Users = require('../models/user');
const responseHeaders = require('../headers');
const logger = require('../../logger/index');

const basicAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    logger.error('Unauthenticated! Please enter credentials');
    return res.status(401).header(responseHeaders).send();
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  try {
    const user = await Users.findOne({ where: { email } });

    if(!user) {
      logger.error(`User not found! Please enter valid credentials - email:${email}`)
      return res.status(400).header(responseHeaders).send();
    }
    
    if (user && await bcrypt.compare(password, user.password)) {
      req.user = user;
      next();
    } else {
      logger.error('Unauthenticated! Please enter valid credentials');
      return res.status(401).header(responseHeaders).send();
    }
  }
  catch (error) {
    logger.error(error);

    logger.error('Service unavailable - 503')
    return res.status(503).header(responseHeaders).send();
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const user = req.user;
    const emailTrack = await TrackEmail.findOne({ where: { email: user.email } });
    const isVerified = user && emailTrack.is_verified;

    if (!isVerified) {
      logger.error('You do not have access. Please verify your email.');
      return res.status(401).json({ error: 'You do not have access. Please verify your email.' });
    }
    
    next();
  } catch (error) {

    logger.error('Error verifying user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  basicAuth,
  verifyUser
};
