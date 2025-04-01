const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');

const homeController = require('../Controllers/HomeController');
const MiddlewareController = require('../Controllers/MiddlewareController.js');
const uploadDir = path.join(__dirname, "../public/img");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

var upload = multer({ storage: storage });

router.get('/admin', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.admin);
router.get('/admin/create', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.create);
router.post('/admin/create-submit', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, upload.single("image"), homeController.createSubmit);
router.post('/admin/add-money-to-user', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.addMoney);
router.get('/admin/show-all', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.getDataGameManager);
router.get('/admin/edit-games/:slug', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.editGameView);
router.put('/admin/edit-games-submit/:slug', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, upload.single("image"), homeController.editGameSubmit);
router.get('/admin/delete-game', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.deleteList);
router.delete('/admin/delete-submit/:slug', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.deleteGames);
router.patch('/admin/restore/:slug', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.restoreGames);
router.delete('/admin/hard-delete/:slug', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.hardDelete);
router.post('/admin/submit-forms-container', MiddlewareController.verifyToken, MiddlewareController.verifyAdmin, homeController.submitFormHandler);
router.get('/add-fund', MiddlewareController.verifyToken, homeController.addFund);
router.get('/', MiddlewareController.verifyToken, homeController.show);

module.exports = router;
