const express = require('express');
const router = express.Router();

const ShopController = require('../Controllers/ShopController.js');
const MiddlewareController = require('../Controllers/MiddlewareController.js');

router.post('/filter-price', MiddlewareController.verifyToken, ShopController.filterPrice);
router.get('/', MiddlewareController.verifyToken, ShopController.shopPage);

module.exports = router;