import groq from '../utils/groq.js';
import supadata from '../utils/supadata.js';

import summaryPrompt from '../prompts/summaryPrompt.js';
import keyPointsPrompt from '../prompts/keyTakeawaysPrompt.js';
import questionPrompt from '../prompts/answerQuestionPrompt.js';

export async function askAI({ transcript, mode, question }) {
    let prompt;

    switch (mode) {
        case "summary":
            prompt = summaryPrompt(transcript);
            break;

        case "keyPoints":
            prompt = keyPointsPrompt(transcript);
            break;

        case "question":
            prompt = questionPrompt(
                transcript,
                question
            );
            break;

        default:
            throw new Error("Invalid AI mode");
    }

    // console.log("Prepared Prompt", prompt)

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.3,

        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTranscript = async (videoId) => {
    const result = await supadata.transcript({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        text: true,
        mode: "auto",
    });

    if (!("jobId" in result)) {
        return result.content ?? result;
    }

    const jobId = result.jobId;

    const MAX_RETRIES = 30;

    for (let i = 0; i < MAX_RETRIES; i++) {
        await sleep(2000);

        const job = await supadata.transcript.getJobStatus(jobId);

        if (job.status === "completed") {
            return job.content;
        }

        if (job.status === "failed") {
            throw new Error(job.error);
        }
    }

    throw new Error("Transcript generation timed out.");
};
