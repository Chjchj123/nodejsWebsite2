const Game = require('../Models/product');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const UserComment = require('../Models/commentpost');

class GameController {
    async showGameProducts(req, res, next) {
        try {
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('/auth/login');
                }
                userId = user.id;
            });
            const user = await User.findOne({ _id: userId }).lean();
            const GameData = await Game.findOne({ slug: req.params.slug }).lean();
            const recGame = await Game.find({ slug: { $ne: req.params.slug } }).limit(9).lean();
            const userCmt = await UserComment.find({ gameId: GameData._id }).lean();
            res.render('gameProducts', { GameData, recGame, user, userCmt });
        } catch (error) {
            next(error);
        }
    }

    async postCommentSubmit(req, res, next) {
        try {
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('/auth/login');
                }
                userId = user.id;
            });
            const user = await User.findOne({ _id: userId });
            const comment = new UserComment({
                userId: user._id,
                gameId: req.params._id,
                name: req.body.name,
                content: req.body.content,
            });
            await comment.save();
            return res.redirect('back');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GameController;