const express = require('express');
const router = express.Router();

const GameController = require('../Controllers/GameController.js');
const MiddlewareController = require('../Controllers/MiddlewareController.js');

router.post('/post-comment/:_id', MiddlewareController.verifyToken, GameController.postCommentSubmit);
router.get('/:slug', MiddlewareController.verifyToken, GameController.showGameProducts);


module.exports = router;