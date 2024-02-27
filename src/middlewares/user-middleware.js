const bcrypt = require('bcrypt');
const Users = require('../models/user');
const responseHeaders = require('../headers');

const basicAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).header(responseHeaders).json({ error: 'Unauthenticated! Please enter credentials' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  try {
    const user = await Users.findOne({ where: { email } });

    if(!user) {
      return res.status(400).header(responseHeaders).json({ error: 'User not found! Please enter valid credentials' });
    }
    
    if (user && await bcrypt.compare(password, user.password)) {
      req.user = user;
      next();
    } else {
      return res.status(401).header(responseHeaders).json({ error: 'Unauthenticated! Please enter valid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(503).header(responseHeaders).json({ error: 'Service unavailable' });
  }
};

module.exports = { basicAuth };
