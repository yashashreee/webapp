const express = require('express');
const userController = require('../controllers/user-controller');
const userMiddleware = require('../middlewares/user-middleware');

const router = express.Router();

router.post('/', userController.createUser);

router.get('/self', userMiddleware.basicAuth, userMiddleware.verifyUser, userController.getUser);
router.put('/self', userMiddleware.basicAuth, userMiddleware.verifyUser, userController.updateUser);

router.get('/verify-email', userController.verifyEmail);

module.exports = router;
