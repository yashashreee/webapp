const bcrypt = require('bcrypt');
const Users = require('../models/user');

const basicAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthenticated! Please enter credentials' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  try {
    const user = await Users.findOne({ where: { email } });

    if(!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user && await bcrypt.compare(password, user.password)) {
      req.user = user;
      next();
    } else {
      return res.status(401).json({ error: 'Unauthenticated! Please enter valid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: 'Service unavailable' });
  }
};

module.exports = { basicAuth };
