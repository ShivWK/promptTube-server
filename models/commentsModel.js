const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    videoId: {
        type: String,
        required: true
    },

    comment: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    }
}, { versionKey: false })

const CommentsModel = mongoose.model("Comments", commentsSchema);
module.exports = CommentsModel;