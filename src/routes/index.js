const express = require('express');
const healthzRoutes = require('./healthz-route');
const userRoutes = require('./user-route');

const router = express.Router();

router.use('/healthz', healthzRoutes);
router.use('/v2/user', userRoutes);

module.exports = router;
