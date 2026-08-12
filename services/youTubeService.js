
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

const youtubeRequest = async (endpoint, params) => {
    const searchParams = new URLSearchParams({
        ...params,
        key: process.env.YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_URL}${endpoint}?${searchParams}`, {
        headers: {
            "Referer": "https://prompttube-server.onrender.com"
        }
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("YouTube API error:", data);

        throw new Error(
            data?.error?.message || "YouTube API request failed"
        );
    }

    return data;
};

export const searchYouTube = async (query) => {
    const data = await youtubeRequest("/search", {
        part: "snippet",
        type: "video",
        order: "rating",
        maxResults: "50",
        q: query,
    });

    return data.items || [];
};

export const getVideoDetails = async (videoIds) => {
    if (!videoIds.length) return [];

    const data = await youtubeRequest("/videos", {
        part: "snippet,contentDetails,statistics",
        id: videoIds.join(","),
    });

    return data.items || [];
};

export const getVideoComments = async (videoId) => {
    try {
        const data = await youtubeRequest("/commentThreads", {
            part: "snippet",
            videoId,
            maxResults: "15",
            order: "relevance",
            textFormat: "plainText",
        });

        return (
            data.items?.map(
                (item) =>
                    item.snippet.topLevelComment.snippet.textDisplay
            ) || []
        );
    } catch (error) {
        // Some videos have comments disabled.
        console.warn(
            `Could not fetch comments for ${videoId}:`,
            error.message
        );

        return [];
    }
};