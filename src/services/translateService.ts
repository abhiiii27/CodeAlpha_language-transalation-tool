import { LinguisticInsights } from "../types";

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
  isLocalFallback?: boolean;
}

export const translateService = {
  async getInsights(
    text: string,
    translatedText: string,
    sourceLang: string,
    targetLang: string,
    tone?: string
  ): Promise<LinguisticInsights> {
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          translatedText,
          sourceLang,
          targetLang,
          tone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error status ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Client insights service error:", error);
      throw new Error(error.message || "Failed to communicate with insights server.");
    }
  },

  async translate(
    text: string,
    sourceLang: string,
    targetLang: string,
    tone?: string
  ): Promise<TranslationResult> {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
          tone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error status ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Client translation service error:", error);
      throw new Error(error.message || "Failed to communicate with translation server.");
    }
  },

  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      return data.detectedSourceLanguage || "English";
    } catch (error: any) {
      console.error("Client detection service error:", error);
      return "English"; // Graceful fallback
    }
  },
};
