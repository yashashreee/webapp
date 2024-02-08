const bcrypt = require('bcrypt');
const Users = require('../models/user');

const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, ...extra_fields } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'Missing required info' });
    }

    if (Object.keys(extra_fields).length > 0) {
      return res.status(400).json({ error: 'Unexpected info present' });
    }

    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
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

      return res.status(201).json({ message: 'User created successfully', user: user });
    }
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: 'Service Unavailable' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = req.user;

    const getUser = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    };

    return res.status(200).json({ message: 'Please find your information below', user: getUser });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: 'Service unavailable' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password, first_name, last_name, ...extra_fields } = req.body;

    const checkUser = await Users.findByPk(userId);

    if (email) {
      return res.status(403).json({ error: 'You are not allowed to update email' });
    }

    if (Object.keys(extra_fields).length > 0) {
      return res.status(400).json({ error: 'Unexpected info present' });
    }
    const user = {
      id: checkUser.id,
      email: checkUser.email,
      first_name: checkUser.first_name,
      last_name: checkUser.last_name,
      account_created: checkUser.account_created,
      account_updated: checkUser.account_updated,
    };

    if (
      Object.keys(req.body).length === 0 ||
      (
        (password === null || password === "") &&
        (first_name === null || first_name === "") &&
        (last_name === null || last_name === "")
      )
    ) {
      return res.status(204).json({ error: 'No content! No info has benn changed', use: user });
    } else {
      checkUser.first_name = first_name || checkUser.first_name;
      checkUser.last_name = last_name || checkUser.last_name;
      checkUser.account_updated = new Date();

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        checkUser.password = hashedPassword;
      }

      await checkUser.save();
      res.status(200).json({ message: 'Info updated successfully', user: checkUser });
    }
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: 'Service Unavailable' });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser
};
