const express = require("express");
const userRouter = express.Router();
const { 
    addVideo,
    removeVideo,
    getVideo,
    addSubscription,
    getSubscription,
    removeSubscription,
    addComment,
    getComment,
    removeComment
 } = require("./../controllers/userActivityController");

userRouter.route("/memoryVideos")
    .get(getVideo)
    .patch(addVideo)
    .delete(removeVideo);

userRouter.route("/subscription")
    .patch(addSubscription)
    .get(getSubscription)
    .delete(removeSubscription);

userRouter.route("/comments")
    .patch(addComment)
    .get(getComment)
    .delete(removeComment);

module.exports = userRouter;