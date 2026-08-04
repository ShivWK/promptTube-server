import { asyncErrorHandler, requiredFieldsCheck } from "../utils/wrapper.js";
import { askAI } from "../services/aiService.js";

export const aiHandler = asyncErrorHandler(async (req, res, next) => {
    console.log("Hit aiHandler");
    const { mode, transcript, question } = req.body;

    requiredFieldsCheck({ args: [mode, transcript], fields: ["mode", "transcript"] });

    const result = await askAI({
        transcript,
        mode,
        question,
    });

    res.json({
        success: true,
        data: result,
    });
})