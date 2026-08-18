import groq from "../config/groq.js"; 
import supadata from '../utils/supadata.js';

import summaryPrompt from '../prompts/summaryPrompt.js';
import keyPointsPrompt from '../prompts/keyTakeawaysPrompt.js';
import questionPrompt from '../prompts/answerQuestionPrompt.js';

import { searchYouTube, getVideoComments, getVideoDetails } from './youTubeService.js';
import { analyzeSearchQuery } from '../utils/analazeSearchQuery.js';
import { rankVideos } from '../utils/rankVideos.js';
import { rankVideosWithAI } from '../utils/rankVideoWithAI.js';
import { compressVideoData } from '../utils/compressVideosData.js';

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

    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL,

        temperature: 0.3,

        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    let response = null;
    const content = completion.choices[0].message.content

    if (mode === "summary" || mode === "question") {
        response = JSON.parse(content);
    } else if (mode === "keyPoints") {
        response = content
            .split("\n")
            .map(item => item.replace(/^\*\s*/, "").trim())
            .filter(Boolean);
    }

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

export const smartSearch = async (smartQuery) => {
    const searchIntent = await analyzeSearchQuery(smartQuery);

    const searchResults = await searchYouTube(searchIntent.searchQuery);

    const rankedResults = rankVideos(searchResults, searchIntent);

    const candidates = rankedResults.slice(0, 6);

    const videoIds = candidates
        .map(video => video.id.videoId)
        .filter(Boolean);

    const videoDetails = await getVideoDetails(videoIds);

    const enrichedVideos = await Promise.all(
        videoDetails.map(async (video) => ({
            ...video,
            _smartScore: candidates.find(candidateVideo => candidateVideo.id.videoId === video.id)?._smartScore,
            comments: await getVideoComments(video.id),
        }))
    );

    const videos = compressVideoData(enrichedVideos)

    const aiResult = await rankVideosWithAI(
        smartQuery,
        searchIntent,
        videos,
    );

    const recommendations = aiResult.recommendations.map((recommendation) => {
        const video = enrichedVideos.find(
            (video) => video.id === recommendation.videoId
        );

        return {
            ...video,
            ...recommendation,
        };
    });

    return recommendations;
};
