import express from "express";
import { aiHandler, transcriber, smartSearchHandler } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/query", aiHandler);
aiRouter.post("/transcript", transcriber);
aiRouter.post("/smartQuery", smartSearchHandler);


export default aiRouter;