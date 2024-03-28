const bcrypt = require('bcrypt');
const Users = require('../models/user');
const responseHeaders = require('../headers');
const logger = require('../../logger/index');
const { PubSub } = require('@google-cloud/pubsub');
const crypto = require('crypto');
const TrackEmail = require('../models/track-email');

const pubsub = new PubSub();

function generateVerificationToken() {
  return crypto.randomBytes(16).toString('hex');
}

async function publishMessageToPubSub(user) {
  const topicName = process.env.PUBSUB_TOPIC;

  const verificationToken = generateVerificationToken();

  const data = {
    user: user,
    verificationToken: verificationToken,
  };

  const dataBuffer = Buffer.from(JSON.stringify(data));

  try {
    await pubsub.topic(topicName).publish(dataBuffer);
    logger.info('Message published to Pub/Sub topic successfully');
  } catch (error) {
    logger.error('Error publishing message to Pub/Sub topic:', error);
    throw error;
  }
}

const verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  
  try {
    const emailTrack = await TrackEmail.findOne({ where: { verification_token: token } });
    const currentTime = Date.now();

    if (currentTime > emailTrack.send_at) {
      logger.error('Verification link has expired');
      return res.status(400).json({ error: 'Verification link has expired' });
    }

    const user = await Users.findOne({ where: { email: email } });

    if (!user) {
      logger.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    if (emailTrack.is_verified) {
      logger.error('User already verified');
      return res.status(404).json({ error: 'User already verified' });
    }

    emailTrack.is_verified = true;
    await emailTrack.save();

    logger.info('Email verification successful');
    res.status(200).send('Email verification successful');

  }
  catch (error) {
    logger.error('Error verifying email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

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
      return res.status(400).header(responseHeaders).json({ error: 'Invalid input: Required fields must be strings.' });
    }

    if (!email && !password && !first_name && !last_name) {
      logger.error('Missing required info - Bad Rquest');
      return res.status(400).header(responseHeaders).json({ error: 'Missing required info' });
    }

    if (!email && !password && !first_name && !last_name) {
      logger.error('Missing required info - Bad Rquest');
      return res.status(400).header(responseHeaders).json({ error: 'Missing required info' });
    }

    if (email === "" || password === "" || first_name === "" || last_name === "") {
      logger.error('Feilds are empty - Bad Rquest');
      return res.status(400).header(responseHeaders).json({error: 'Feilds are empty' });
    }

    if (Object.keys(extra_fields).length > 0) {
      logger.error('Unexpected info present - Bad Rquest');
      return res.status(400).header(responseHeaders).json({error: 'Unexpected info present' });
    }
 
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      logger.error(`User with this email already exists - Bad Rquest - ${existingUser}`);
      return res.status(400).header(responseHeaders).json({error: 'User with this email already exists' });
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
      await publishMessageToPubSub(user);

      return res.status(201).header(responseHeaders).json({ message: 'User created successfully', user: user });
    }
  }
  catch (error) {
    logger.error(error);

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

    logger.error('Service Unavailable - 503');
    return res.status(503).header(responseHeaders).json({ error: 'Service Unavailable' });
  }
};

module.exports = {
  verifyEmail,
  createUser,
  getUser,
  updateUser
};
