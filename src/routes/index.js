const homeRouter = require('./home.js');
const gameRouter = require('./game.js');
const authRouter = require('./auth.js');
const userRouter = require('./user.js');
const pageShopRouter = require('./shop.js');

function router(app) {

    app.use('/games', gameRouter);
    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/shop-page', pageShopRouter);
    app.use("/", homeRouter);
}

module.exports = router;