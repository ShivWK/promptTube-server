import express from "express";
import { getSearchSuggestion } from "../controllers/youtubeController.js";

const youtubeRouter = express.Router();

youtubeRouter.get("/searchSuggestion", getSearchSuggestion);

export default youtubeRouter;