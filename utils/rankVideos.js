export const rankVideos = (videos, searchIntent) => {
    return videos
        .map((video) => {
            const title =
                video.snippet?.title?.toLowerCase() || "";

            const description =
                video.snippet?.description?.toLowerCase() || "";

            let score = 0;

            for (const keyword of searchIntent.intent) {
                const term = keyword.toLowerCase();

                if (title.includes(term)) {
                    score += 10;
                }

                if (description.includes(term)) {
                    score += 5;
                }
            }

            if (searchIntent.preferences.educational) {
                if (
                    title.includes("tutorial") ||
                    title.includes("course") ||
                    title.includes("learn")
                ) {
                    score += 5;
                }
            }

            if (searchIntent.preferences.beginnerFriendly) {
                if (
                    title.includes("beginner") ||
                    title.includes("from scratch") ||
                    title.includes("zero to")
                ) {
                    score += 5;
                }
            }

            return {
                ...video,
                _smartScore: score,
            };
        })
        .sort((a, b) => b._smartScore - a._smartScore);
};