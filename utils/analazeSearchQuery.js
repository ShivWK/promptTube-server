import groq from "./groq.js";

export const analyzeSearchQuery = async (smartQuery) => {
    const prompt = `
You are a search query understanding system.

The user will describe what they want in natural language.

Convert their request into structured search requirements.

User request:"${smartQuery}"

Return ONLY valid JSON in this exact structure:

{
    "searchQuery": "optimized YouTube search query",
    "intent": ["keyword1", "keyword2"],
    "preferences": {
        "long": false,
        "beginnerFriendly": false,
        "advanced": false,
        "recent": false,
        "educational": false
    }
}

Rules:

- searchQuery must be suitable for YouTube search.
- Keep searchQuery concise.
- Do not put conversational language into searchQuery.
- Extract meaningful concepts from the user's request.
- Do not invent requirements that the user did not mention.
`;

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
    });

    const content = completion.choices[0].message.content;

    return JSON.parse(content);
};