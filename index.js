const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

const youtubeRouter = require("./routes/youtubeRouter");
const userRouter = require("./routes/userActivityRoutes");

app.use(express.json());
dotenv.config({ path: "./.env" });

const allowedOrigins = [
    "http://localhost:5173",
    "https://prompttube-ai.shivendra.site",
    "https://prompttube.shivendradwivedi.com"
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connection made");
    })
    .catch(err => {
        console.log("Connection failed", err);
    })

app.get("/", (req, res) => {
    res.status(200).send("PromptTube proxy server is running")
})

app.get("/api/server/wake-up", (req, res) => {
    console.log("Wake up call received");
    res.status(200).json({
        status: "success",
        message: "I'm awake"
    })
})

app.use("/api/v1/youtube", youtubeRouter);
app.use("/api/v1/user", userRouter);

app.use((req, res) => {
    res.status(404).send("Not found");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`PromptTube proxy server is running on port ${PORT}`)
})