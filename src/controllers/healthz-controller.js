const { sequelize } = require('../configs/database');
const responseHeaders = require('../headers');
const logger = require('../../logger/index');

const healthCheck = async (req, res) => {
  try {
    await isDbConnected();
    logger.info('Database connected!');
    return res.status(200).header(responseHeaders).send();
  }
  catch (error) {
    logger.error(`Service Unavailable - ${error}`);
    return res.status(503).header(responseHeaders).json({ error: 'Service Unavailable' });
  }
};

const isDbConnected = async () => {
  try {
    await sequelize.authenticate();
  }
  catch (error) {
    logger.error('Database connection error: ' + error.message);
    throw new Error('Database connection error: ' + error.message);
  }
};

module.exports = {
  healthCheck,
};
