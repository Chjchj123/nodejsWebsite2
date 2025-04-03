const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let refreshTokensArr = [];
class AuthController {
    login(req, res) {
        res.render('auth/login');
    }

    async registerSubmit(req, res, next) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            //
            const checkUserName = await User.findOne({ username: req.body.username });
            if (!checkUserName) {
                const newUser = await new User({
                    name: req.body.name,
                    username: req.body.username,
                    password: hash,
                });
                await newUser.save();
                res.redirect('back');
            } else {
                res.status(400).json('We already have that username');
            }

        } catch (error) {
            next(error)
        }
    }

    async loginSubmit(req, res, next) {
        try {
            const userNameCheck = await User.findOne({ username: req.body.username });

            if (!userNameCheck) {
                return res.status(400).json('Wrong USERNAME');
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                userNameCheck.password,
            );

            if (!validPassword) {
                return res.status(400).json('WRONG PASSWORD');
            } else {
                const accessToken = jwt.sign({
                    id: userNameCheck._id,
                }, process.env.ACCESSTOKEN,
                    {
                        expiresIn: "9h"
                    });
                refreshTokensArr.push(accessToken);
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                    path: "/",
                });
                res.redirect('/');
            }
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: "strict" });
            refreshTokensArr = refreshTokensArr.filter(token => token !== req.cookies.refreshToken);
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController;