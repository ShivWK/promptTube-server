const enrichVideos = async (videos) => {
    if (!videos.length) return [];

    const ids = videos
        .map((video) => video.id?.videoId)
        .filter(Boolean);

    const url =
        "https://www.googleapis.com/youtube/v3/videos" +
        `?part=snippet,contentDetails,statistics` +
        `&id=${ids.join(",")}` +
        `&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch video metadata");
    }

    const data = await response.json();

    return data.items || [];
};