const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/index');
const responseHeaders = require('./src/headers');
const { syncDatabase, sequelize } = require('./src/configs/database');

const startServer = () => {
  const app = express();

  sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
  });

  app.use(bodyParser.json());
  app.use('/', routes);

  app.use((req, res, next) => {
    res.status(404).header(responseHeaders).json({ error: 'API not Found' });
  });

  syncDatabase().then(() => {
    const port = process.env.PORT;
    const server = app.listen(port, () => {});

    process.on('SIGTERM', () => {
      console.log('Received SIGTERM. Closing server...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });
  });

  module.exports = app;
};

startServer();
