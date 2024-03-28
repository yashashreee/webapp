const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/index');
const responseHeaders = require('./src/headers');
const { sequelize } = require('./src/configs/database');
const logger = require('./logger/index');
require('dotenv').config();

const app = express();

sequelize.sync({ force: false }).then(() => {
  logger.info('Database synced');
});

app.use(bodyParser.json());
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).header(responseHeaders).json({ error: 'API not Found' });
});

const port = process.env.PORT;
app.listen(port, () => { });
logger.info(`App is running on port ${port}`);


module.exports = app;
