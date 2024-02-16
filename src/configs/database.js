const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASS, {
  dialect: 'mysql',
  host: 'localhost'
});

const syncDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await sequelize.sync({ force: false });
    console.log('Database synced');
  }
};

module.exports = { sequelize, syncDatabase };

