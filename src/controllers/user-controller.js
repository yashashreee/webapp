const bcrypt = require('bcrypt');
const Users = require('../models/user');
const responseHeaders = require('../headers');
const logger = require('../../logger/index');

const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, ...extra_fields } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      logger.error('Invalid email format.');
      return res.status(400).header(responseHeaders).send();
    }

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof first_name !== 'string' ||
      typeof last_name !== 'string'
    ) {
      logger.warn('Invalid input: Required fields must be strings.');
      return res.status(400).header(responseHeaders).send();
    }

    if (!email && !password && !first_name && !last_name) {
      logger.error('Missing required info - Bad Rquest');
      return res.status(400).header(responseHeaders).send();
    }

    if (!email && !password && !first_name && !last_name) {
      logger.error('Missing required info - Bad Rquest');
      return res.status(400).header(responseHeaders).send();
    }

    if (email === "" || password === "" || first_name === "" || last_name === "") {
      logger.error('Feilds are empty - Bad Rquest');
      return res.status(400).header(responseHeaders).sen();
    }

    if (Object.keys(extra_fields).length > 0) {
      logger.error('Unexpected info present - Bad Rquest');
      return res.status(400).header(responseHeaders).send();
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      logger.error(`User with this email already exists - Bad Rquest - ${existingUser}`);
      return res.status(400).header(responseHeaders).send();
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await Users.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
      });

      const user = {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        account_created: newUser.account_created,
        account_updated: newUser.account_updated,
      };

      logger.info(`User created successfully - user:${user}`);
      return res.status(201).header(responseHeaders).json({ message: 'User created successfully', user: user });
    }
  }
  catch (error) {
    logger.error(error);
    console.error(error);

    logger.error('Service Unavailable - 503');
    return res.status(503).header(responseHeaders).json({ error: 'Service Unavailable' });
  }
};

const getUser = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0) {
      logger.error('No parameters allowed - Bad Rquest');
      return res.status(400).header(responseHeaders).json({ error: 'No parameters allowed' });
    }
    const user = req.user;
    const getUser = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    };

    logger.info(`Please find your information: ${getUser}`);
    return res.status(200).header(responseHeaders).json({ message: 'Please find your information below', user: getUser });
  }
  catch (error) {
    logger.error(error);
    console.error(error);

    logger.error('Service unavailable - 503');
    return res.status(503).header(responseHeaders).json({ error: 'Service unavailable' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password, first_name, last_name, ...extra_fields } = req.body;

    const checkUser = await Users.findByPk(userId);

    if (email) {
      logger.error('You are not allowed to update email - Bad Rquest');
      return res.status(400).header(responseHeaders).json({ error: 'You are not allowed to update email' });
    }

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof first_name !== 'string' ||
      typeof last_name !== 'string'
    ) {
      logger.warn('Invalid input: Required fields must be strings.');
      return res.status(400).header(responseHeaders).send();
    }

    if (Object.keys(req.body).length === 0 || password === "" || first_name === "" || last_name === "") {
      logger.error('Feilds are empty - Bad Rquest');
      return res.status(400).header(responseHeaders).json({ error: 'Feilds are empty' });
    }

    if (Object.keys(extra_fields).length > 0) {
      logger.error('Unexpected info present - Bad Rquest');
      return res.status(400).header(responseHeaders).json({ error: 'Unexpected info present' });
    }

    checkUser.first_name = first_name || checkUser.first_name;
    checkUser.last_name = last_name || checkUser.last_name;
    checkUser.account_updated = new Date();

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      checkUser.password = hashedPassword;
    }

    await checkUser.save();
    logger.info(`User updated successfully - user:${checkUser}`);
    return res.status(204).header(responseHeaders).json();
  }
  catch (error) {
    logger.error(error);
    console.error(error);

    logger.error('Service Unavailable - 503');
    return res.status(503).header(responseHeaders).json({ error: 'Service Unavailable' });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser
};
