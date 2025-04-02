const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

const User = new Schema({
    name: { type: String, default: "" },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    slug: { type: String, slug: 'username' },
    cart: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false },
    wallet: { type: Number, default: 0, get: v => parseFloat(v.toFixed(2)) },
    email: { type: String, default: "Example@email.com" },
    phone: { type: String, default: "0123456789" },
}, {
    timestamps: true
});


// plugin
mongoose.plugin(slug);

module.exports = mongoose.model('User', User);