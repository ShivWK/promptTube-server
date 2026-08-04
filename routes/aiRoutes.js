import express from "express";
import { aiHandler } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/query", aiHandler);

export default aiRouter;