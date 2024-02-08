const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASS, {
  dialect: 'mysql',
  host: 'localhost',
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection authenticated');
  })
  .catch((error) => {
    console.error('Unable to authenticate database connection:', error.message);
  });

module.exports = sequelize;
