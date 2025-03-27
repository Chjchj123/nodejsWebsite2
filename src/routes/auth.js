const express = require('express');
const router = express.Router();

const AuthController = require('../Controllers/AuthController.js');

router.get('/login', AuthController.login);
router.post('/login-submit', AuthController.loginSubmit);
router.post('/logout', AuthController.logout);
router.post('/register', AuthController.registerSubmit);

module.exports = router;