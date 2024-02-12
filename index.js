const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/index');
const sequelize = require('./src/configs/database');

const app = express();

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

app.use(bodyParser.json());
app.use('/', routes);

app.use((res) => {
  res.status(404).json({ error: 'Not Found' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
