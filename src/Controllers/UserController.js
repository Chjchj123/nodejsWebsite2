const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const Games = require('../Models/product');
const bcrypt = require('bcryptjs');
const Imap = require("imap-simple");
const axios = require("axios");
const config = {
    imap: {
        user: "quanganh2004dasuo@gmail.com",
        password: 'zemb hdog gsgx etmt',
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
    },
};

class UserController {
    async profile(req, res, next) {
        const token = req.cookies.accessToken;
        var userId;
        jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
            if (error) {
                return res.redirect('auth/login');
            }
            userId = user.id;
        });
        const user = await User.findOne({ _id: userId }).lean();
        res.render('user/profile', { user });
    }

    async editSubmit(req, res, next) {
        try {
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('auth/login');
                }
                userId = user.id;
            })
            const user = await User.findOne({ _id: userId });
            user.name = req.body.name;
            user.email = req.body.email;
            user.phone = req.body.phone;
            await user.save();
            return res.redirect(`/user/profile/` + user.slug);
        } catch (error) {
            next(error);
        }
    }

    // [GET]
    async changePassword(req, res, next) {
        try {
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('/auth/login');
                }
                userId = user.id;
            })
            const user = await User.findOne({ _id: userId }).lean();
            res.render('user/changePassword', { user });
        } catch (error) {
            next(error);
        }
    }

    // [PUT]
    async changePasswordSubmit(req, res, next) {
        try {
            const salt = await bcrypt.genSalt(10);
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('/auth/login');
                }
                userId = user.id;
            })
            const user = await User.findOne({ _id: userId });
            const validPassword = await bcrypt.compare(
                req.body.oldPass,
                user.password,
            );
            if (!validPassword) {
                return res.status(404).json("Wrong Old Password");
            }

            const hash = await bcrypt.hash(req.body.newPassword, salt);
            user.password = hash;
            user.save();
            return res.redirect('/user/profile/' + user.slug);
        } catch (error) {
            next(error);
        }
    }

    //[POST]
    async addToCart(req, res, next) {
        try {
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('auth/login');
                }
                userId = user.id;
            })
            const user = await User.findOne({ _id: userId });
            const games = await Games.findOne({ _id: req.params._id }).lean();
            user.cart.push(games._id);
            await user.save();
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }

    //[GET]
    async showCart(req, res, next) {
        try {
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('auth/login');
                }
                userId = user.id;
            })
            const user = await User.findOne({ _id: userId }).lean();
            const games = await Games.find({ _id: { $in: user.cart } }).lean();
            res.render('user/cart', { games, user });
        } catch (error) {
            next(error);
        }
    }

    //[POST]
    async removeFromCart(req, res, next) {
        try {
            const token = req.cookies.accessToken;
            var userId;
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('/auth/login');
                }
                userId = user.id;
            })
            const user = await User.findOne({ _id: userId });
            user.cart = user.cart.filter(item => item !== req.params._id);
            user.save();
            return res.redirect('/user/cart/' + userId);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new UserController;