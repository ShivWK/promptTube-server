export default function questionPrompt(
    transcript,
    question
) {
    return `
You are answering questions about a YouTube video.

Only answer from the transcript.

If the transcript doesn't contain the answer, clearly say so.

Transcript:

${transcript}

Question:

${question}
`;
}