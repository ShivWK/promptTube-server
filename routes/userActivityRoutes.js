import express from "express";
import {
    addVideo,
    removeVideo,
    getVideo,
    addSubscription,
    getSubscription,
    removeSubscription,
    addComment,
    getComment,
    removeComment
} from "./../controllers/userActivityController.js";

const userRouter = express.Router();

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

export default userRouter;