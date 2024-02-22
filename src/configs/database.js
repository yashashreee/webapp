const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  port: process.env.PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: process.env.DIALECT,
  host: process.env.HOST,
});

const syncDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await sequelize.sync({ force: false });
    console.log('Database synced');
  }
};

module.exports = { sequelize, syncDatabase };
