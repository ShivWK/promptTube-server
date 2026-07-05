import mongoose from "mongoose";

const subscriptionsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    channelId: {
        type: [String],
        default: []
    }
}, { versionKey: false })

const SubscriptionsModel = mongoose.model("Subscriptions", subscriptionsSchema);
export default SubscriptionsModel;