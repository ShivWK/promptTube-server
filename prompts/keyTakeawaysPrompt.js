export default function keyPointsPrompt(videoData) {
    return `
Extract the key takeaways from this video.

Rules:
- Return 5-8 concise bullet points when sufficient video data is available.
- Each point should be short and meaningful.
- Return markdown bullets only.
- No introduction or conclusion.
- Never mention "transcript", "transcription", or "provided transcript".
- Refer to the content as "the video" or "video data".
- Speak naturally as if you understood the video.
- Always respond in English.
- Never invent, assume, or hallucinate information that is not present in the video data.
- Never return an empty response.
- Never return an empty list or empty bullet list.
- If the video data is missing, insufficient, or unusable, return exactly one markdown bullet explaining that key takeaways cannot be generated because the video data is not available or sufficient.
- Always return a meaningful text response.
- Don't include hyphen "-" before the points.

Video data:

${videoData}
`;
}