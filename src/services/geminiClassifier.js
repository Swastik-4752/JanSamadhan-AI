import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

/**
 * Uses Groq (llama-3.1-8b-instant) to classify a municipal complaint.
 * @param {string} description – The complaint description text.
 * @returns {Promise<{category: string, priority: string} | null>}
 */
export async function classifyComplaint(description) {
    try {
        const prompt = `You are a municipal complaint classifier for Delhi MCD. Based on this complaint description, return ONLY a JSON object with two fields:
- category: one of [Road & Potholes, Garbage & Sanitation, Water Leakage, Streetlight, Drainage, Other]
- priority: one of [Urgent, Standard]

Urgent means immediate safety risk or complete service failure.
Standard means inconvenience but not emergency.

Complaint: ${description}

Return ONLY valid JSON, no explanation, no markdown.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0,
            response_format: { type: "json_object" },
        });

        const text = chatCompletion.choices[0]?.message?.content || "";

        // Strip markdown fences if present (e.g. ```json ... ```) just in case
        const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

        const parsed = JSON.parse(cleaned);

        // Validate the returned values
        const validCategories = [
            "Road & Potholes",
            "Garbage & Sanitation",
            "Water Leakage",
            "Streetlight",
            "Drainage",
            "Other",
        ];
        const validPriorities = ["Urgent", "Standard"];

        if (
            !validCategories.includes(parsed.category) ||
            !validPriorities.includes(parsed.priority)
        ) {
            console.warn("Groq returned unexpected values:", parsed);
            return null;
        }

        return { category: parsed.category, priority: parsed.priority };
    } catch (err) {
        console.error("Groq classification error:", err);
        return null;
    }
}
