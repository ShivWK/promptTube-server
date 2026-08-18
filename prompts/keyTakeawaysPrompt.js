export default function keyPointsPrompt(videoData, videoMetadata) {
    return `
Extract the key takeaways from this YouTube video.

VIDEO METADATA:
${JSON.stringify(videoMetadata, null, 2)}

VIDEO CONTENT:
${videoData}

Rules:
- Extract 5-8 concise and meaningful key takeaways from the video content.
- Each takeaway should be short and focused on an important idea, fact, conclusion, lesson, or point discussed in the video.
- The video content must be the primary source for the key takeaways.
- Use video metadata only for context. Do not turn metadata such as views, likes, comments, duration, or publication date into key takeaways.
- Do not treat the video's description, tags, or other metadata as proof that something was discussed in the video.
- Do not invent, assume, or hallucinate information.
- Never mention "transcript", "transcription", or "provided transcript".
- Refer to the source only as "the video", "video content", or "video information".
- Speak naturally as if you understood the video.
- Always respond in English.
- Do not include an introduction or conclusion.
- Do not use headings.
- Do not include hyphens, bullets, numbering, or other list markers before the takeaways. Return each takeaway as a separate plain-text line.
- Never return an empty response.
- Never return an empty list or empty set of takeaways.
- If the video content is missing, empty, insufficient, or unusable, return exactly one plain-text line explaining that key takeaways cannot be generated because the video content is not available or sufficient.
- Always return a meaningful text response.

Return only the key takeaways as plain-text lines.
`;
}