const Games = require('../Models/product');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const { exec } = require("child_process");

class HomeController {
    async show(req, res, next) {
        try {
            const accessToken = req.cookies.accessToken;
            var userId;
            jwt.verify(accessToken, process.env.ACCESSTOKEN, (erorr, user) => {
                if (erorr) {
                    res.status(500).json("Error To Get User");
                }
                userId = user.id;
            })
            const user = await User.findOne({ _id: userId }).lean();
            const gameData = await Games.find({ deleted: false }).limit(12).lean();
            const allGameData = await Games.find().lean();
            const bestSeller = await Games.find({ isHot: true }).lean();
            const totalProducts = await Games.countDocuments();
            res.render('home', { gameData, user, bestSeller, allGameData, totalProducts });
        } catch (error) {
            next(error);
        }
    }

    async admin(req, res) {
        const accessToken = req.cookies.accessToken;
        var userId;
        jwt.verify(accessToken, process.env.ACCESSTOKEN, (erorr, user) => {
            if (erorr) {
                res.status(500).json("Error To Get User");
            }
            userId = user.id;
        })
        const user = await User.findOne({ _id: userId });
        const totalUser = await User.countDocuments();
        const totalProducts = await Games.countDocuments();
        const getAllUser = await User.find().lean();
        res.render('adminDashboard', { layout: false, totalUser, totalProducts, getAllUser });
    }

    async addMoney(req, res, next) {
        try {
            const userId = req.body.addMoney
            const user = await User.findOne({ _id: userId });
            const amount = req.body.money;
            user.wallet += amount;
            user.wallet.toFixed(2);
            user.save();
            return res.redirect('/user/profile/' + user.slug);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            res.render('admin/create', { layout: false });
        } catch (error) {
            next(error);
        }
    }

    // [POST]
    async createSubmit(req, res, next) {
        try {
            if (req.file == null) {
                return res.status(500).json("Please Add Picture To Your Game!");
            }
            const game = new Games({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: req.file ? req.file.filename : "",
                slug: req.body.name,
                trailerVideo: req.body.trailerVideoId,
                specs: {
                    os: req.body.os,
                    Processor: req.body.chip,
                    Memory: req.body.ram,
                    GraphicsCard: req.body.graphicsCard,
                    Storage: req.body.storage,
                    SoundCard: req.body.soundCard || "N/A",
                    AdditionalNote: req.body.additionalNote || ""
                }
            });
            game.save();
            exec(
                'git add . && git commit -m "Update uploaded files" && git push origin',
                (err, stdout, stderr) => {
                    if (err) {
                        console.error(`Lỗi: ${err.message}`);
                        return;
                    }
                    console.log(stdout || stderr);
                }
            );
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }

    // GET
    async getDataGameManager(req, res, next) {
        try {
            const GameData = await Games.find({}).lean();
            res.render('admin/gameManager', { GameData, layout: false });
        } catch (error) {
            next(error);
        }
    }

    async editGameView(req, res, next) {
        try {
            const GameData = await Games.findOne({ slug: req.params.slug }).lean();
            res.render('admin/editGames', { GameData, layout: false });
        } catch (error) {
            next(error);
        }
    }

    // [PUT]
    async editGameSubmit(req, res, next) {
        try {
            const GameData = await Games.findOne({ slug: req.params.slug }).lean();
            const data = req.body;
            if (data.image !== null) {
                await fs.unlink(`src/public/img/` + GameData.image);
                data.image = req.file.filename;
            }
            data.trailerVideoId = req.body.trailerVideoId;
            data.specs = {
                os: req.body.os,
                Processor: req.body.chip,
                Memory: req.body.ram,
                GraphicsCard: req.body.graphicsCard,
                Storage: req.body.storage,
                SoundCard: req.body.soundCard || "N/A",
                AdditionalNote: req.body.additionalNote || ""
            };
            switch (req.body.action) {
                case "true":
                    data.isHot = req.body.action;
                    break;
                case "false":
                    data.isHot = req.body.action;
                    break;
                default:
                    data.isHot = false;
                    break;
            }
            await Games.updateOne({ slug: req.params.slug }, data);
            exec(
                'git add . && git commit -m "Update uploaded files" && git push origin',
                (err, stdout, stderr) => {
                    if (err) {
                        console.error(`Lỗi: ${err.message}`);
                        return;
                    }
                    console.log(stdout || stderr);
                }
            );
            return res.redirect('/admin/show-all');
        } catch (error) {
            next(error);
        }
    }

    async deleteList(req, res, next) {
        try {
            const gameData = await Games.findWithDeleted({ deleted: true }).lean();
            res.render('admin/recycleBin', { gameData, layout: false });
        } catch (error) {
            next(error);
        }
    }

    //DELETE
    async deleteGames(req, res, next) {
        try {
            await Games.delete({ slug: req.params.slug });
            res.redirect("/");
        } catch (error) {
            next(error);
        }
    }

    // PATCH
    async restoreGames(req, res, next) {
        try {
            await Games.restore({ slug: req.params.slug });
            res.redirect("/");
        } catch (error) {
            next(error);
        }
    }

    // [DELETE]
    async hardDelete(req, res, next) {
        try {
            const GameData = await Games.findOneWithDeleted({ slug: req.params.slug, deleted: true });
            await fs.unlink(`src/public/img/` + GameData.image);
            await Games.findOneAndDelete({ slug: GameData.slug }).lean();
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }

    // POST
    async submitFormHandler(req, res, next) {
        try {
            switch (req.body.action) {
                case 'restore':
                    await Games.restore({ slug: { $in: req.body.gameSlug } }).lean();
                    res.redirect('/');
                    break;
                case 'delete':
                    await Games.deleteMany({ slug: { $in: req.body.gameSlug } });
                    res.redirect('/');
                    break;
                default:
                    res.json('invalid');
                    break;
            }

        } catch (error) {
            next();
        }
    }
    // 404 site 
    get404 = (req, res) => {
        res.status(404).render("404");
    };

    async addFund(req, res, next) {
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
            res.render('contact', { user });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new HomeController;