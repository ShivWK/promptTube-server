const { asyncErrorHandler, requiredFieldsCheck } = require("./../utils/wrapper");
const UserActivityModel = require("./../models/userActivityModel");
const SubscriptionsModel = require("./../models/subscriptions");
const CommentsModel = require("./../models/commentsModel");
const clearIfEmpty = require("./../utils/wrapper");

exports.addVideo = asyncErrorHandler(async (req, res) => {
    const { userId, videoId, videoType } = req.body;

    requiredFieldsCheck({ args: [userId, videoId, videoType], fields: ["userId", "videoId", "videoType"] })

    const doc = await UserActivityModel.findOneAndUpdate(
        { userId, videoType },
        { $addToSet: { videoId } },
        { new: true, upsert: true }
    );

    return res.status(200).json({
        status: "success",
        data: doc
    })
})

exports.getVideo = asyncErrorHandler(async (req, res) => {
    const { userId } = req.query;
    requiredFieldsCheck({ args: [userId], fields: ["userId"] })

    const doc = await UserActivityModel.find({ userId });

    return res.status(200).json({
        status: "success",
        data: doc,
    })
})

exports.removeVideo = asyncErrorHandler(async (req, res) => {
    const { userId, videoType, videoId } = req.body;
    requiredFieldsCheck({ args: [userId, videoType], fields: ["userId", "videoType"] });

    const doc1 = await UserActivityModel.findOneAndUpdate(
        { userId, videoType },
        { $pull: { videoId } }
    )

    res.status(200).json({
        status: "success",
        data: doc1,
        message: "video removed successfully"
    })

    // clearIfEmpty({ Model: UserActivityModel, filter: { userId, videoType }, field: "videoId" })

    const doc2 = await UserActivityModel.findOne({ userId, videoType });

    if (doc2 && doc2.videoId.length === 0) {
        const doc = await UserActivityModel.findOneAndDelete({ userId, videoType });
        console.log("Removed Document", doc);
    }
})

exports.addSubscription = asyncErrorHandler(async (req, res) => {
    const { userId, channelId } = req.body;
    requiredFieldsCheck({ args: [userId, channelId], fields: ["userId", "channelId"] });

    const doc = await SubscriptionsModel.findOneAndUpdate(
        { userId },
        { $addToSet: { channelId } },
        { new: true, upsert: true }
    )

    return res.status(200).json({
        status: "success",
        data: doc
    })
})

exports.getSubscription = asyncErrorHandler(async (req, res) => {
    const { userId } = req.query;
    requiredFieldsCheck({ args: [userId], fields: ["userId"] });

    const doc = await SubscriptionsModel.find({ userId })

    return res.status(200).json({
        status: "success",
        data: doc
    })
})

exports.removeSubscription = asyncErrorHandler(async (req, res) => {
    const { userId, channelId } = req.body;
    requiredFieldsCheck({ args: [userId, channelId], fields: ["userId", "channelId"] });

    const doc1 = await SubscriptionsModel.findOneAndUpdate(
        { userId },
        { $pull: { channelId } }
    )

    res.status(200).json({
        status: "success",
        data: doc1,
        message: "Unsubscribed successfully"
    })

    // clearIfEmpty({ Model: SubscriptionsModel, filter: { userId }, field: "channelId" })

    const doc2 = await SubscriptionsModel.findOne({ userId });

    if (doc2 && doc2.channelId.length === 0) {
        const doc = await SubscriptionsModel.findOneAndDelete({ userId });
        console.log("Removed Document", doc);
    }
})

exports.addComment = asyncErrorHandler(async (req, res) => {
    const { userId, videoId, comment } = req.body;
    requiredFieldsCheck({ args: [userId, videoId, comment], fields: ["userId", "videoId", "comment"] });

    const doc = await CommentsModel.findOneAndUpdate(
        { userId, videoId },
        { $addToSet: { comment } },
        { new: true, upsert: true }
    )

    return res.status(200).json({
        status: "success",
        data: doc
    })
})

exports.getComment = asyncErrorHandler(async (req, res) => {
    const { userId } = req.query;
    requiredFieldsCheck({ args: [userId], fields: ["userId"] });

    const doc = await CommentsModel.find({ userId })

    return res.status(200).json({
        status: "success",
        data: doc
    })
})

exports.removeComment = asyncErrorHandler(async (req, res) => {
    const { userId, comment, videoId } = req.body;
    requiredFieldsCheck({ args: [userId, videoId, comment], fields: ["userId", "videoId", "comment"] });

    const doc1 = await CommentsModel.findOneAndUpdate(
        { userId, videoId },
        { $pull: { comment } }
    )

    res.status(200).json({
        status: "success",
        data: doc1,
        message: "Unsubscribed successfully"
    })

    // clearIfEmpty({ Model: CommentsModel, filter: { userId, videoId }, field: "comment" })

    const doc2 = await CommentsModel.findOne({ userId, videoId });

    if (doc2 && doc2.comment.length === 0) {
        const doc = await CommentsModel.findOneAndDelete({ userId, videoId });
        console.log("Removed Document", doc);
    }
})
