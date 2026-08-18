export default function summaryPrompt(videoData) {
    return `
You are an expert educator.

Generate a concise summary of this YouTube video using only the available video data.

Return ONLY valid JSON in exactly this format:

{
  "title": "...",
  "summary": "..."
}

Rules:
- Always return valid JSON.
- Always return a meaningful response.
- Never return an empty response.
- Never return an empty "title" or empty "summary".
- Keep the summary concise and easy to understand.
- Use simple, natural English.
- Cover the important topics and main ideas from the video.
- Base the summary only on the information available in the video data.
- Do not invent, assume, or hallucinate information.
- Do not use markdown.
- Do not use headings inside the summary.
- Do not wrap the JSON in a code block.
- Never mention "transcript", "transcription", or "provided transcript".
- Refer to the source only as "the video" or "video data".
- If the video data is missing, empty, insufficient, or unusable, do not attempt to generate a summary. Instead, return a meaningful fallback response in the same JSON format.
- For unavailable video data, use a title such as "Summary Unavailable" and clearly explain in the "summary" field that the video could not be processed and a summary cannot be generated.
- Always respond in English.

Video data:

${videoData}
`;
}