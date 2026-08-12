const searchYouTube = async (query) => {
    const url =
        "https://youtube.googleapis.com/youtube/v3/search" +
        `?part=snippet` +
        `&order=rating`+
        `&type=video` +
        `&maxResults=50` +
        `&q=${encodeURIComponent(query)}` +
        `&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("YouTube search failed");
    }

    const data = await response.json();

    return data.items || [];
};