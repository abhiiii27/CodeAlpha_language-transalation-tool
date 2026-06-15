export function getGeminiApiKey(): string | null {
    const raw = process.env.GEMINI_API_KEY;
    if (!raw) return null;

    const trimmed = raw.trim();
    if (!trimmed) return null;

    // common placeholder values seen in templates
    const lower = trimmed.toLowerCase();
    if (lower === "my_gemini_api_key" || lower.includes("placeholder")) return null;

    return trimmed;
}

export function isGeminiConfigured(): boolean {
    return getGeminiApiKey() !== null;
}

