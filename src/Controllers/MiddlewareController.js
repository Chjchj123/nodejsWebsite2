const jwt = require('jsonwebtoken');
const User = require('../Models/user');

class MiddlewareController {
    verifyToken(req, res, next) {
        const token = req.cookies.accessToken;
        if (token) {
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.redirect('/auth/login');
                }
                req.username = user;
                next();
            });
        } else {
            res.json(req.cookies.accessToken);
            // return res.redirect('/auth/login');
        }
    }

    async verifyAdmin(req, res, next) {
        const token = req.cookies.accessToken;
        var userId;
        if (token) {
            jwt.verify(token, process.env.ACCESSTOKEN, (error, user) => {
                if (error) {
                    return res.status(500).json({ message: "You Are Not Admin" });
                }
                userId = user.id;
            });
            const data = await User.findOne({ _id: userId }).lean();
            if (data.isAdmin) {
                next();
            } else {
                return res.status(500).json({ message: "You Are Not Admin" });
            }
        } else {
            return res.redirect('/auth/login');
        }
    }
}

module.exports = new MiddlewareController;