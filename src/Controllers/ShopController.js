const Game = require('../Models/product');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');

class ShopController {
    async shopPage(req, res, next) {
        try {
            //pagination
            const perPage = 9;
            const page = parseInt(req.query.page) || 1;

            const totalGames = await Game.countDocuments();
            const totalPages = Math.ceil(totalGames / perPage);
            const games = await Game.find()
                .skip((page - 1) * perPage)
                .limit(perPage).lean();

            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push({ number: i, isCurrent: i === page });
            }
            //
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('auth/login');
                }
                userId = user.id;
            })
            const user = await User.findOne({ _id: userId }).lean();
            res.render('shop', {
                games, user, pages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page - 1,
                nextPage: page + 1,
            });
        } catch (error) {
            next(error);
        }
    }

    //[POST] 
    async filterPrice(req, res, next) {
        try {
            const perPage = 9;
            const page = parseInt(req.query.page) || 1;

            const totalGames = await Game.countDocuments();
            const totalPages = Math.ceil(totalGames / perPage);

            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push({ number: i, isCurrent: i === page });
            }
            const { price } = req.body;
            if (!price || isNaN(price)) {
                return res.status(400).json({ error: "Invalid price value" });
            }
            const games = await Game.find({ price: { $gt: price } }).lean();
            res.json(games);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ShopController;