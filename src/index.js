require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const expressHandleBars = require('express-handlebars').engine;
const router = require("./routes");
const db = require('./Config/Db');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const flash = require("connect-flash");
const handlebarsHelpers = require("handlebars-helpers")();
const Games = require('./Models/product');
const errorController = require('./Controllers/HomeController');
const userController = require('./Controllers/UserController');


const cors = require('cors');
app.use(cors());

app.use(flash());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, 'user')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));
app.use(methodOverride('_method'));

const hbsHelpers = {
    range: function (start, end, options) {
        let result = "";
        for (let i = start; i <= end; i++) {
            result += options.fn(i);
        }
        return result;
    }
};
app.engine('hbs', expressHandleBars({
    helpers: { sum: (a, b) => a + b, ...handlebarsHelpers, ...hbsHelpers },
    extname: '.hbs'
}));
app.use(express.urlencoded({
    extended: true
}));

app.use(async (req, res, next) => {
    try {
        res.locals.allGameData = await Games.find().lean();
        next();
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu game:", error);
        res.locals.allGameData = [];
        next();
    }
});

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));



router(app);
db.connect();

app.use(errorController.get404);
app.listen(port, '0.0.0.0', () => {
    console.log('Connect Successfull in localhost');
})