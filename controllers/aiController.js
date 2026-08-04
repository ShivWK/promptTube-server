import { asyncErrorHandler, requiredFieldsCheck } from "../utils/wrapper.js";
import { askAI, getTranscript } from "../services/aiService.js";

export const aiHandler = asyncErrorHandler(async (req, res) => {
    console.log("Hit AiHandler");
    const { mode, transcript, question } = req.body;

    requiredFieldsCheck({ args: [mode, transcript], fields: ["mode", "transcript"] });

    const result = await askAI({
        transcript,
        mode,
        question,
    });

    return res.status(200).json({
        success: true,
        data: result,
    });
});

export const transcriber = asyncErrorHandler(async (req, res) => {
    console.log("Hit Transcriber");
    const { videoId } = req.body;

    requiredFieldsCheck({ args: [videoId], fields: ["videoId"] });

    const transcript = await getTranscript(videoId);

    if (
        !transcript ||
        (Array.isArray(transcript) && transcript.length === 0) ||
        (typeof transcript === "string" && transcript.trim() === "")
    ) {
        return res.status(404).json({
            success: false,
            message: "No transcript is available for this video."
        });
    }

    return res.status(200).json({
        success: true,
        transcript
    })
});