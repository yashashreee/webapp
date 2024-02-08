const express = require('express');
const healthzController = require('../controllers/healthz-controller');
const healthzMiddleware = require('../middlewares/healthz-middleware');

const router = express.Router();

router.get('/', healthzMiddleware.healthCheckMiddleware, healthzController.healthCheck);

router.post('/', healthzMiddleware.healthCheckMiddleware, healthzController.healthCheck);
router.put('/', healthzMiddleware.healthCheckMiddleware, healthzController.healthCheck);
router.delete('/', healthzMiddleware.healthCheckMiddleware, healthzController.healthCheck);
router.head('/', healthzMiddleware.healthCheckMiddleware, healthzController.healthCheck);
router.options('/', healthzMiddleware.healthCheckMiddleware, healthzController.healthCheck);

module.exports = router;
