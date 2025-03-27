const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema({
    userId: { type: String },
    gameId: { type: String },
    name: { type: String },
    content: { type: String },
}, {
    timestamps: true
});

CommentSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.createdAt = DateTime.fromJSDate(ret.createdAt)
            .setZone("Asia/Ho_Chi_Minh")
            .toFormat("EEEE, MMM dd yyyy");
        return ret;
    },
});

module.exports = mongoose.model('UserComment', CommentSchema);
