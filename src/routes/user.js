const express = require('express');
const router = express.Router();

const userController = require('../Controllers/UserController.js');
const MiddlewareController = require('../Controllers/MiddlewareController.js');

router.get('/profile/:slug', MiddlewareController.verifyToken, userController.profile);
router.put('/profile/edit-submit/:slug', MiddlewareController.verifyToken, userController.editSubmit);
router.get('/change-password/:_id', MiddlewareController.verifyToken, userController.changePassword);
router.put('/change-password-submit/:_id', MiddlewareController.verifyToken, userController.changePasswordSubmit);
router.post('/cart-add/:_id', MiddlewareController.verifyToken, userController.addToCart);
router.get('/cart/:_id', MiddlewareController.verifyToken, userController.showCart);
router.post('/remove-cart/:_id', MiddlewareController.verifyToken, userController.removeFromCart);


module.exports = router;