export default function summaryPrompt(transcript) {
    return `
You are an expert educator.

Summarize the following YouTube transcript.

Rules:
- Keep it concise.
- Use simple language.
- Cover every important topic.
- Don't hallucinate.
- Return only plain markdown.

Transcript:

${transcript}
`;
}