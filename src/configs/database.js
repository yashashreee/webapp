const { Sequelize } = require('sequelize');
const logger = require('../../logger/index');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASS, {
  dialect: process.env.DIALECT,
  host: process.env.HOST
});

const syncDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await sequelize.sync({ force: false });
    logger.info('Database synced');
  }
};

module.exports = { sequelize, syncDatabase };
