import groq from '../utils/groq.js';

import summaryPrompt from '../prompts/summaryPrompt.js';
import keyPointsPrompt from '../prompts/keyTakeawaysPrompt.js';
import questionPrompt from '../prompts/answerQuestionPrompt.js';

export async function askAI({
    transcript,
    mode,
    question,
}) {
    let prompt;

    switch (mode) {
        case "summary":
            prompt = summaryPrompt(transcript);
            break;

        case "keyPoints":
            prompt = keyPointsPrompt(transcript);
            break;

        case "question":
            prompt = questionPrompt(
                transcript,
                question
            );
            break;

        default:
            throw new Error("Invalid AI mode");
    }

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.3,

        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    console.log(completion);

    return completion.choices[0].message.content;
}
