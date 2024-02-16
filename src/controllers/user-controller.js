const bcrypt = require('bcrypt');
const Users = require('../models/user');
const responseHeaders = require('../headers');

const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, ...extra_fields } = req.body;

    if (!email && !password && !first_name && !last_name) {
      return res.status(400).header(responseHeaders).json({ error: 'Missing required info' });
    }

    if (email === "" || password === "" || first_name === "" || last_name === "") {
      return res.status(400).header(responseHeaders).json({ error: 'Feilds are empty' });
    }

    if (Object.keys(extra_fields).length > 0) {
      return res.status(400).header(responseHeaders).json({ error: 'Unexpected info present' });
    }

    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).header(responseHeaders).json({ error: 'User with this email already exists' });
    } else {
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

      return res.status(201).header(responseHeaders).json({ message: 'User created successfully', user: user });
    }
  } catch (error) {
    console.error(error);
    return res.status(503).header(responseHeaders).json({ error: 'Service Unavailable' });
  }
};

const getUser = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0) {
      return res.status(400).header(responseHeaders).json({ error: 'No parameters allowed' });
    }
    const user = req.user;
    console.log('hi', responseHeaders);
    const getUser = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    };

    return res.status(200).header(responseHeaders).json({ message: 'Please find your information below', user: getUser });
  } catch (error) {
    console.error(error);
    return res.status(503).header(responseHeaders).json({ error: 'Service unavailable' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password, first_name, last_name, ...extra_fields } = req.body;

    const checkUser = await Users.findByPk(userId);

    if (email) {
      return res.status(403).header(responseHeaders).json({ error: 'You are not allowed to update email' });
    }

    if (Object.keys(req.body).length === 0 || password === "" || first_name === "" || last_name === "") {
      return res.status(400).header(responseHeaders).json({ error: 'Feilds are empty' });
    }

    if (Object.keys(extra_fields).length > 0) {
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
    return res.status(204).header(responseHeaders).json();
  } catch (error) {
    console.error(error);
    return res.status(503).header(responseHeaders).json({ error: 'Service Unavailable' });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser
};
