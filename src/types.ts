/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Language {
  code: string;
  name: string;
  flag: string; // Emoji character representing the flag / region
}

export interface TranslationHistoryItem {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string; // ISO date string
  tone?: string;
}

export interface FavoritePhrase {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string; // ISO date string
  tone?: string;
  category: string; // Folder/Category (defaults to "General")
}

export type Theme = "light" | "dark";

export interface AppNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "fa", name: "Persian", flag: "🇮🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
];

export interface LinguisticInsightIdiom {
  phrase: string;
  meaning: string;
  context: string;
}

export interface LinguisticInsightGrammar {
  rule: string;
  explanation: string;
  example: string;
}

export interface LinguisticInsightAlternative {
  phrase: string;
  register: string;
  whyUseIt: string;
}

export interface LinguisticInsightCulture {
  title: string;
  fact: string;
}

export interface LinguisticInsights {
  idioms: LinguisticInsightIdiom[];
  grammarDifferences: LinguisticInsightGrammar[];
  alternativePhrases: LinguisticInsightAlternative[];
  culturalNuances: LinguisticInsightCulture[];
}
