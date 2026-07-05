const mongoose = require("mongoose");

const userActivityModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    videoType: {
        type: String,
        enum: ["history", "liked", "watch-later"],
        required: true,
    },

    videoId: {
        type: [String],
        required: true,
        default: []
    }
}, { versionKey: false })

const UserActivityModel = mongoose.model("UserActivity", userActivityModel);
module.exports = UserActivityModel;