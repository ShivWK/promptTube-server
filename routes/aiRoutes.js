import express from "express";
import { aiHandler, transcriber } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/query", aiHandler);
aiRouter.post("/transcript", transcriber);

export default aiRouter;