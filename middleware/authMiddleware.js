import "../config/firebaseAdmin.js"
import { getAuth } from "firebase-admin/auth";

const verifyFirebaseToken = async (req, res, next) => {
    console.log("Middleware Called");

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const idToken = authHeader.split("Bearer ")[1];

        const decodedToken = await getAuth().verifyIdToken(idToken);
        req.user = decodedToken;

        console.log("Token Verified")

        next();
    } catch (error) {
        console.error("Firebase token verification failed:", error);

        return res.status(401).json({
            message: "Invalid or expired authentication token",
        });
    }
};

export default verifyFirebaseToken;