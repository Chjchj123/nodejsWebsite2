const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const SpecsSchema = new Schema({
    os: { type: String },
    Processor: { type: String },
    Memory: { type: String },
    GraphicsCard: { type: String },
    Storage: { type: String },
    SoundCard: { type: String },
    AdditionalNote: { type: String },
});

const Games = new Schema({
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    image: { type: String },
    slug: { type: String, slug: 'name' },
    trailerVideo: { type: String },
    isHot: { type: Boolean, default: false },
    specs: { type: SpecsSchema },
}, {
    timestamps: true
});


// plugin
mongoose.plugin(slug);
Games.plugin(mongooseDelete);
Games.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

module.exports = mongoose.model('Game', Games);