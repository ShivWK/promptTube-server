const express = require("express");
const youtubeRouter = express.Router();

const {
    getSearchSuggestion
} = require("../controllers/youtubeController")

youtubeRouter.get("/searchSuggestion", getSearchSuggestion);

module.exports = youtubeRouter;