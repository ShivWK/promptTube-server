import { asyncErrorHandler, requiredFieldsCheck } from "../utils/wrapper.js";
import { askAI, getTranscript, smartSearch } from "../services/aiService.js";
import { getVideoDetails } from "../services/youTubeService.js";

export const aiHandler = asyncErrorHandler(async (req, res) => {
    console.log("Hit AiHandler");
    const { mode, transcript, question, videoMetadata } = req.body;

    requiredFieldsCheck({
        args: [mode, transcript, videoMetadata],
        fields: ["mode", "transcript", "videoMetadata"]
    });

    const result = await askAI({
        transcript,
        mode,
        question,
        videoMetadata
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

export const giveMetaData = async (req, res) => {
    console.log("Hit MetaData");
    const { videoId } = req.body;

    requiredFieldsCheck({ args: [videoId], fields: ["videoId"] });

    const metaData = await getVideoDetails(videoId);

    if (!metaData) {
        return res.status(404).json({
            success: false,
            message: "No metadata is available for this video."
        });
    }

    return res.status(200).json({
        success: true,
        metadata: metaData,
    })
}

export const smartSearchHandler = asyncErrorHandler(async (req, res) => {
    console.log("Hit Smart Search");
    const { smartQuery } = req.body;

    requiredFieldsCheck({
        args: [smartQuery],
        fields: ["smartQuery"],
    });

    const result = await smartSearch(smartQuery);

    return res.status(200).json({
        success: true,
        data: result,
    });
})