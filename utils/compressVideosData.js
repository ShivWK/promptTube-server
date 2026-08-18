export const compressVideoData = (videos) => {
    return videos.map((video) => {
        const snippet = video.snippet || {};
        const statistics = video.statistics || {};
        const contentDetails = video.contentDetails || {};

        

        return {
            videoId: video.id,

            title: snippet.title || "",

            description: (snippet.description || "").slice(0, 1500),

            channel: snippet.channelTitle || "",

            publishedAt: snippet.publishedAt || "",

            language: snippet.defaultLanguage || snippet.defaultAudioLanguage || null,

            duration: contentDetails.duration || "",

            views: Number(statistics.viewCount || 0),

            likes: Number(statistics.likeCount || 0),

            commentCount: Number(statistics.commentCount || 0),

            comments: (video.comments || [])
                .slice(0, 3)
                .map((comment) =>
                    typeof comment === "string"
                        ? comment.slice(0, 400)
                        : comment.text?.slice(0, 400)
                )
                .filter(Boolean),

            smartScore: video._smartScore || 0,
        };
    });
};