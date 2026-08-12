export const rankVideos = (videos, searchIntent) => {
    const intentKeywords = Array.isArray(searchIntent?.intent)
        ? searchIntent.intent
        : [];

    const preferences = searchIntent?.preferences || {};

    const normalize = (value = "") =>
        value
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    const tokenize = (value = "") =>
        normalize(value)
            .split(" ")
            .filter((word) => word.length > 1);

    const intentText = normalize(intentKeywords.join(" "));

    // Terms that usually indicate the video is educational.

    const educationalTerms = [
        "tutorial",
        "course",
        "learn",
        "guide",
        "explained",
        "explanation",
        "from scratch",
        "step by step",
        "crash course",
        "masterclass",
    ];

    // Terms that usually indicate beginner-friendly content.

    const beginnerTerms = [
        "beginner",
        "beginners",
        "from scratch",
        "zero to",
        "for beginners",
        "step by step",
        "basic",
        "basics",
        "fundamentals",
        "introduction",
        "intro",
    ];

    // These are generally poor signals for an educational Smart Search result unless the user's intent specifically asks for them.

    const negativeTerms = [
        "shorts",
        "reaction",
        "compilation",
        "trailer",
        "teaser",
        "edit",
    ];

    return videos.map((video) => {
        const title = normalize(video.snippet?.title);
        const description = normalize(video.snippet?.description);

        const titleWords = tokenize(title);
        const descriptionWords = tokenize(description);

        let relevanceScore = 0;
        let preferenceScore = 0;
        let qualityScore = 0;
        let negativeScore = 0;


        // 1. RELEVANCE SCORE

        // Exact full intent phrase in title.
        if (intentText && title.includes(intentText)) {
            relevanceScore += 30;
        }

        // Individual intent keywords.
        for (const keyword of intentKeywords) {
            const term = normalize(keyword);

            if (!term) continue;

            // Strongest signal: title.
            if (title.includes(term)) {
                relevanceScore += 10;
            }

            // Description is useful but weaker.
            if (description.includes(term)) {
                relevanceScore += 3;
            }
        }

        // Bonus when several intent words occur in the title. This prevents a video matching only one keyword from beating a video matching most of the user's intent.
        const normalizedIntentWords = tokenize(intentText);

        if (normalizedIntentWords.length > 0) {
            const matchedTitleWords = normalizedIntentWords.filter(
                (word) => titleWords.includes(word)
            ).length;

            const titleMatchRatio = matchedTitleWords / normalizedIntentWords.length;
            relevanceScore += Math.round(titleMatchRatio * 15);
        }


        // 2. USER PREFERENCE SCORE
        if (preferences.educational) {
            for (const term of educationalTerms) {
                if (title.includes(term)) {
                    preferenceScore += 5;
                }
            }

            // Don't allow this category to dominate.
            preferenceScore = Math.min(preferenceScore, 15);
        }

        if (preferences.beginnerFriendly) {
            for (const term of beginnerTerms) {
                if (title.includes(term)) {
                    preferenceScore += 5;
                }
            }

            preferenceScore = Math.min(preferenceScore, 15);
        }

        // Long-video preference.
        if (preferences.longVideo) {
            const duration = parseYouTubeDuration(
                video.contentDetails?.duration
            );

            if (duration >= 30 * 60) {
                preferenceScore += 8;
            }

            if (duration >= 60 * 60) {
                preferenceScore += 7;
            }
        }

        // Short-video preference.
        if (preferences.shortVideo) {
            const duration = parseYouTubeDuration(
                video.contentDetails?.duration
            );

            if (duration > 0 && duration <= 10 * 60) {
                preferenceScore += 10;
            }
        }

        // 3. QUALITY SCORE Keep these signals relatively small. We don't want a highly popular but irrelevant video to outrank a highly relevant video.

        const views = Number(video.statistics?.viewCount || 0);
        const likes = Number(video.statistics?.likeCount || 0);
        const comments = Number(video.statistics?.commentCount || 0);

        // Views are a weak quality signal.
        if (views >= 100_000) {
            qualityScore += 4;
        } else if (views >= 10_000) {
            qualityScore += 2;
        }

        // Likes indicate some level of audience satisfaction.
        if (likes >= 10_000) {
            qualityScore += 4;
        } else if (likes >= 1_000) {
            qualityScore += 2;
        }

        // Comments indicate discussion/engagement.
        if (comments >= 1_000) {
            qualityScore += 3;
        } else if (comments >= 100) {
            qualityScore += 2;
        }

        qualityScore = Math.min(qualityScore, 15);

        // NEGATIVE SIGNALS
        for (const term of negativeTerms) {
            if (title.includes(term)) {
                negativeScore += 10;
            }
        }

        // FINAL SCORE
        const finalScore = relevanceScore + preferenceScore + qualityScore - negativeScore;

        return {
            ...video,
            _smartScore: finalScore,

            _ranking: {
                relevance: relevanceScore,
                preferences: preferenceScore,
                quality: qualityScore,
                negative: negativeScore,
            },
        };
    })
        .sort((a, b) => b._smartScore - a._smartScore);
};


/**
 * Convert YouTube ISO 8601 duration into seconds.
 * Examples:
 * PT10M       -> 600
 * PT1H20M     -> 4800
 * PT1H2M30S   -> 3750
 */
const parseYouTubeDuration = (duration = "") => {
    if (!duration) return 0;

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) return 0;

    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);

    return (hours * 60 * 60 + minutes * 60 + seconds);
};