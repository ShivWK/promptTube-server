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
    removeComment,
    uploadProfilePicture
} from "./../controllers/userActivityController.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const userRouter = express.Router();
userRouter.use(verifyFirebaseToken);

userRouter.route("/memoryVideos")
    .post(getVideo)
    .patch(addVideo)
    .delete(removeVideo);

userRouter.route("/subscription")
    .patch(addSubscription)
    .post(getSubscription)
    .delete(removeSubscription);

userRouter.route("/comments")
    .patch(addComment)
    .post(getComment)
    .delete(removeComment);

userRouter.patch("/profile/picture", upload.single("profilePic"), uploadProfilePicture)

export default userRouter;