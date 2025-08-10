export function parseJsonFromText(text: string): any {
    if (!text || typeof text !== 'string') {
        throw new Error("Invalid input: text must be a non-empty string.");
    }
    
    // Attempt to find a JSON object within markdown ```json ... ```
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
        try {
            return JSON.parse(jsonMatch[1]);
        } catch (e) {
            console.error("Failed to parse JSON from markdown block, falling back.", e);
        }
    }

    // Attempt to find JSON object directly if no markdown block or if parsing failed
    // This is useful if the AI wraps the JSON in conversational text.
    try {
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
            const potentialJson = text.substring(startIndex, endIndex + 1);
            return JSON.parse(potentialJson);
        }
    } catch (e) {
        // This is not a critical error, just one of the parsing strategies failing.
    }
    
    // Final fallback: try to parse the entire string as-is
    try {
        return JSON.parse(text);
    } catch(e) {
        console.error("Failed to parse JSON directly from the full text:", text);
        throw new Error("Не удалось разобрать JSON ответ от ИИ. Ответ не является валидным JSON.");
    }
}
