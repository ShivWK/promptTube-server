export default function keyPointsPrompt(transcript) {
    return `
Extract the key takeaways from this transcript.

Rules:
- Return 5-10 bullet points.
- Each point should be short.
- No introduction.
- Return markdown bullets only.

Transcript:

${transcript}
`;
}