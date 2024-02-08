const sequelize = require('../configs/database');

const responseHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'X-Content-Type-Options': 'nosniff',
};

const healthCheck = async (req, res) => {
  try {
    // check database connectivity
    await isDbConnected();

    // if successful, send HTTP 200
    return res.status(200).header(responseHeaders).json();
  } catch (error) {
    // if unsuccessful, send HTTP 503
    return res.status(503).header(responseHeaders).json();
  }
};

// function to check database connection
const isDbConnected = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    throw new Error('Database connection error: ' + error.message);
  }
};

module.exports = {
  healthCheck,
};
