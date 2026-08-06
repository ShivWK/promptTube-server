export default function summaryPrompt(transcript) {
    return `
You are an expert educator.

Summarize this youtube transcript.

Return ONLY valid JSON.

{
    "title": "",
    "summary": ""
}

Rules:
- Keep it concise.
- Use simple language.
- Cover every important topic.
- Don't hallucinate.
- Do not use markdown.
- Do not use headings.
- Do not wrap in code blocks.

Transcript:

${transcript}
`;
}