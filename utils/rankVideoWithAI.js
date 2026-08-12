import groq from "./groq.js";

export const rankVideosWithAI = async (
    smartQuery,
    searchIntent,
    videos
) => {
    const prompt = `
You are an intelligent YouTube recommendation system.

User request:
${smartQuery}

Interpreted requirements:
${JSON.stringify(searchIntent)}

Analyze the following YouTube videos and determine which
ones best satisfy the user's request.

Consider:

- relevance
- educational value
- usefulness
- title and description
- engagement
- comments
- recency when relevant
- whether the video actually matches the user's requirements

Do NOT rank a video highly simply because it has many views.

Return ONLY valid JSON:

{
    "recommendations": [
        {
            "videoId": "...",
            "rank": 1,
            "score": 95,
            "reason": "...",
            "strengths": [],
            "weaknesses": []
        }
    ]
}

Videos:
${JSON.stringify(videos)}
`;

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: {
            type: "json_object",
        },
    });

    // console.log(
    //     "AI Content:",
    //     completion.choices[0].message.content
    // );

    return JSON.parse(
        completion.choices[0].message.content
    );
};