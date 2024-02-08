const express = require('express');
const healthzRoutes = require('./healthz-route');

const router = express.Router();

router.use('/healthz', healthzRoutes);

module.exports = router;
